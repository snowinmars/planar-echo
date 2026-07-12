import patchWithTranslation from './1.patchTranslation.js';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import buildCreatureSkeleton from './2.buildCreatureSkeleton.js';
import translateCreature from './3.translateCreature.js';

import type { Tlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { CreatureV10, CreatureV11 } from '@/steps/4.biffs2json/pstee/cre/index.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { GameLanguage } from '@planar/shared';
import type { GhostCreature } from '../../../types.js';

type Creature = CreatureV10 | CreatureV11;

export const patchCres = (
  cres: Creature[],
  tlk: Tlk,
  language: GameLanguage,
  discover: DiscoverNext,
): AsyncIterableIterator<GhostCreature> => iterate<Creature, GhostCreature>(
  cres,
  (cre, i) => {
    const tlked = patchWithTranslation(cre, tlk);

    const ghostCreatureSkeleton = buildCreatureSkeleton(tlked, discover);
    const ghostCreatureTranslation = translateCreature(tlked);

    const percent = Math.round((i + 1) * 100 / cres.length);
    reportProgress({
      value: percent,
      step: 'cre_json2ghost',
      params: {
        version: cre.header.version,
        resourceName: cre.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: cre.resourceName,
      skeleton: ghostCreatureSkeleton,
      translations: new Map<GameLanguage, string>([[language, ghostCreatureTranslation]]),
      ghostCreature: tlked,
    });
  },
);
