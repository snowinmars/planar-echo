import patchWithTranslation from './patchTranslation.js';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';

import type { Tlk } from '@/steps/4.biffs2json/tlk/index.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from '@/steps/4.biffs2json/cre/index.js';
import type { GhostCreatureV10, GhostCreatureV12, GhostCreatureV22, GhostCreatureV90 } from '../../types.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
type GhostCreature = GhostCreatureV10 | GhostCreatureV12 | GhostCreatureV22 | GhostCreatureV90;

const patchCres = (cres: Creature[], tlk: Tlk): AsyncIterableIterator<GhostCreature> => iterate<Creature, GhostCreature>(
  cres,
  (cre, i) => {
    switch (cre.header.version) {
      case 'v1.0': {
        const tlked = patchWithTranslation(cre, tlk);

        const percent = Math.round((i + 1) * 100 / cres.length);
        reportProgress({
          value: percent,
          step: 'cre_json2ghost',
          params: {
            version: cre.header.version,
            resourceName: cre.resourceName,
          },
        });

        return Promise.resolve(tlked);
      }
      case 'v1.1': throw new Error('Not implemented cre ghosting v1.1');
      case 'v1.2': throw new Error('Not implemented cre ghosting v1.2');
      case 'v2.2': throw new Error('Not implemented cre ghosting v2.2');
      case 'v9.0': throw new Error('Not implemented cre ghosting v9.0');
      default: throw new Error(`Out of range: '${cre.header.version}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  },
);

export default patchCres;
