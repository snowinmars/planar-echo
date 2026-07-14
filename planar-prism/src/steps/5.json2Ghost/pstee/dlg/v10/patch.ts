import iterate from '@/steps/iterate.js';
import attachWeights from './1.attachWeights.js';
import patchTranslation from './2.patchTranslation.js';
import splitTranslation from './3.splitTranslation.js';
import nestDialogue from './4.nestDialogue.js';
import extendWithEmptyResponses from './5.extendWithemptyResponses.js';
import buildDialogueSkeleton from './6.buildDialogueSkeleton.js';
import translateDialogue from './7.translateDialogue.js';
import { pickCreatureOrItemToTalk } from './pickCre.js';
import { reportProgress } from '@/shared/report.js';

import type {
  GhostCreatureV10,
  GhostCreatureV11,
  GhostItemV10,
} from '../../../types.js';
import type { GameLanguage, WhoId } from '@planar/shared';
import type { Tlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { RawDlg } from '@/steps/4.biffs2json/pstee/dlg/index.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { GhostDlg } from '../../../types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV11;

export const patchDlgs = (
  dlgs: RawDlg[],
  cres: Map<string, GhostCreature>,
  items: Map<string, GhostItemV10>,
  tlk: Tlk,
  language: GameLanguage,
  discover: DiscoverNext,
): AsyncIterableIterator<GhostDlg> => iterate<RawDlg, GhostDlg>(
  dlgs,
  (dlg, i) => {
    switch (dlg.header.version) {
      case 'v1.0': {
        const weighted = attachWeights(dlg);
        const translated = patchTranslation(weighted, tlk);
        const splitted = splitTranslation(translated, language);
        const nested = nestDialogue(splitted);
        const nestedExtendedWithEmptyResponses = extendWithEmptyResponses(nested);

        const creatureOrItem = pickCreatureOrItemToTalk(cres, items, dlg.resourceName);
        const npc = getNpcIdAndName(creatureOrItem);

        const ghostSkeleton = buildDialogueSkeleton(nestedExtendedWithEmptyResponses, discover);
        const ghostSkeletonTranslation = translateDialogue({
          dlg: nestedExtendedWithEmptyResponses,
          id: npc.id,
          name: npc.name,
          language,
        });

        const percent = Math.round((i + 1) * 100 / dlgs.length);
        reportProgress({
          value: percent,
          step: 'dlg_json2ghost',
          params: {
            version: dlg.header.version,
            resourceName: dlg.resourceName,
          },
        });

        return Promise.resolve({
          resourceName: dlg.resourceName,
          skeleton: ghostSkeleton,
          translations: new Map<GameLanguage, string>([[language, ghostSkeletonTranslation]]),
        });
      }
      default: throw new Error(`Out of range: '${dlg.header.version}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  },
);

const getNpcIdAndName = (creatureOrItem: 'narrator' | GhostItemV10 | (GhostCreatureV10 | GhostCreatureV11)): Readonly<{ id: WhoId; name: string }> => {
  if (creatureOrItem === 'narrator') return {
    id: 'narrator',
    name: '',
  };
  if (creatureOrItem.header.signature === 'cre') return {
    id: creatureOrItem.resourceName.replaceAll('.cre', '') as WhoId, // seems to work
    name: creatureOrItem.header.nameTlk,
  };
  return {
    id: creatureOrItem.resourceName.replaceAll('.itm', '') as WhoId, // seems to work
    name: creatureOrItem.header.identifiedNameTlk,
  };
};
