import iterate from '@/steps/iterate.js';
import attachWeights from './1.attachWeights.js';
import nestDialogue from './4.nestDialogue.js';
import extendWithEmptyResponses from './5.extendWithEmptyResponses.js';
import buildDialogueSkeleton from './6.buildDialogueSkeleton.js';
import { pickCreatureOrItemToTalk } from './pickCre.js';
import { reportProgress } from '@/shared/report.js';

import type {
  GhostCreatureV10,
  GhostCreatureV11,
  GhostItemV10,
} from '../../../types.js';
import type { WhoId } from '@planar/shared';
import type { RawDlg } from '@/steps/4.biffs2json/pstee/dlg/index.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { GhostDlg } from '../../../types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV11;

export const patchDlgs = (
  dlgs: RawDlg[],
  cres: Map<string, GhostCreature>,
  items: Map<string, GhostItemV10>,
  discover: DiscoverNext,
): AsyncIterableIterator<GhostDlg> => iterate<RawDlg, GhostDlg>(
  dlgs,
  (dlg, i) => {
    switch (dlg.header.version) {
      case 'v1.0': {
        const weighted = attachWeights(dlg);
        const nested = nestDialogue(weighted);
        const nestedExtendedWithEmptyResponses = extendWithEmptyResponses(nested);

        const creatureOrItem = pickCreatureOrItemToTalk(cres, items, dlg.resourceName);
        const npc = getNpcIdAndName(creatureOrItem);

        const ghostSkeleton = buildDialogueSkeleton({
          dlg: nestedExtendedWithEmptyResponses,
          npcId: npc.id,
          npcNameRef: npc.name,
          discover,
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
        });
      }
      default: throw new Error(`Out of range: '${dlg.header.version}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  },
);

type NpcId = Readonly<{ id: WhoId; name: number }>;
const getNpcIdAndName = (creatureOrItem: 'narrator' | GhostItemV10 | (GhostCreatureV10 | GhostCreatureV11)): NpcId => {
  if (creatureOrItem === 'narrator') return {
    id: 'narrator',
    name: 0,
  };
  if (creatureOrItem.header.signature === 'cre') return {
    id: creatureOrItem.resourceName.replaceAll('.cre', '') as WhoId, // seems to work
    name: creatureOrItem.header.nameRef,
  };
  return {
    id: creatureOrItem.resourceName.replaceAll('.itm', '') as WhoId, // seems to work
    name: creatureOrItem.header.identifiedNameRef,
  };
};
