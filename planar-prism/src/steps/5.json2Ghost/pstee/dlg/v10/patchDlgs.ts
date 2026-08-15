import iterate from '@/steps/iterate.js';
import attachWeights from './1.attachWeights.js';
import nestDlg from './4.nestDlg.js';
import extendWithEmptyResponses from './5.extendWithEmptyResponses.js';
import buildDlgSkeleton from './6.buildDlgSkeleton.js';
import { pickCreOrItm } from './pickCre.js';
import { reportProgress } from '@/shared/report.js';

import type { CreWithTlk } from '../../cre/v10/patchCres.types.js';
import type { ItmWithTlk } from '../../itm/v11/patchItms.types.js';
import type { WhoId } from '@planar/shared';
import type { RawDlg } from '@/steps/4.biffs2json/pstee/dlg/index.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { DlgOut } from './patchDlgs.types.js';

export const patchDlgs = (
  dlgs: RawDlg[],
  cres: Map<string, CreWithTlk>,
  itms: Map<string, ItmWithTlk>,
  discover: DiscoverNext,
): AsyncIterableIterator<DlgOut> => iterate<RawDlg, DlgOut>(
  dlgs,
  (dlg, i) => {
    switch (dlg.header.version) {
      case 'v1.0': {
        const weighted = attachWeights(dlg);
        const nested = nestDlg(weighted);
        const nestedExtendedWithEmptyResponses = extendWithEmptyResponses(nested);

        const creOrItm = pickCreOrItm(cres, itms, dlg.resourceName);
        const npc = getNpcIdAndName(creOrItm);

        const ghostSkeleton = buildDlgSkeleton({
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
      default: throw new Error(`Dlg header version is out of range: '${dlg.header.version}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  },
);

// TODO [snow]: it is so bad
type NpcId = Readonly<{ id: WhoId; name: number }>;
const getNpcIdAndName = (creOrItm: 'narrator' | ItmWithTlk | CreWithTlk): NpcId => {
  if (creOrItm === 'narrator') return {
    id: 'narrator',
    name: 0,
  };
  if (creOrItm.header.signature === 'cre') return {
    id: creOrItm.resourceName.replaceAll('.cre', '') as WhoId, // seems to work
    name: creOrItm.header.nameRef,
  };
  return {
    id: creOrItm.resourceName.replaceAll('.itm', '') as WhoId, // seems to work
    name: creOrItm.header.identifiedNameRef,
  };
};
