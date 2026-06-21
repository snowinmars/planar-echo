import iterate from '@/steps/iterate.js';
import attachWeights from './1.attachWeights.js';
import patchTranslation from './2.patchTranslation.js';
import splitTranslation from './3.splitTranslation.js';
import nestDialogue from './4.nestDialogue.js';
import buildDialogueSkeleton from './5.buildDialogueSkeleton.js';
import translateDialogue from './6.translateDialogue.js';
import { pickCreatureOrItemToTalk } from './pickCre.js';
import { reportProgress } from '@/shared/report.js';

import type {
  GhostCreatureV10,
  GhostCreatureV11,
  GhostItemV10,
} from '../../../types.js';
import type { GameLanguage } from '@planar/shared';
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

        const creatureOrItem = pickCreatureOrItemToTalk(cres, items, dlg.resourceName);
        const npcId = getNpcId(creatureOrItem);

        const ghostSkeleton = buildDialogueSkeleton(nested, discover);
        const ghostSkeletonTranslation = translateDialogue({
          dlg: nested,
          npcId,
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
const getNpcId = (creatureOrItem: 'narrator' | GhostItemV10 | (GhostCreatureV10 | GhostCreatureV11)): string => {
  if (creatureOrItem === 'narrator') return 'narrator';
  if (creatureOrItem.header.signature === 'cre') return creatureOrItem.header.nameTlk;
  return creatureOrItem.header.identifiedNameTlk;
};
