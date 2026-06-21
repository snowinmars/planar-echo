import { patchWithTranslation } from './1.patchTranslation.js';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildItemSkeleton } from './2.buildItemSkeleton.js';
import { translateItem } from './3.translateItem.js';

import type { Tlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { ItmV10 } from '@/steps/4.biffs2json/pstee/itm/types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { GameLanguage } from '@planar/shared';
import type { GhostItem } from '../../../types.js';

export const patchItms = (
  cres: ItmV10[],
  tlk: Tlk,
  language: GameLanguage,
  discover: DiscoverNext,
): AsyncIterableIterator<GhostItem> => iterate<ItmV10, GhostItem>(
  cres,
  (cre, i) => {
    const tlked = patchWithTranslation(cre, tlk);

    const ghostItemSkeleton = buildItemSkeleton(tlked, discover);
    const ghostItemTranslation = translateItem(tlked);

    const percent = Math.round((i + 1) * 100 / cres.length);
    reportProgress({
      value: percent,
      step: 'itm_json2ghost',
      params: {
        version: cre.header.version,
        resourceName: cre.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: cre.resourceName,
      skeleton: ghostItemSkeleton,
      translations: new Map<GameLanguage, string>([['ru_RU', ghostItemTranslation]]),
      ghostItem: tlked,
    });
  },
);
