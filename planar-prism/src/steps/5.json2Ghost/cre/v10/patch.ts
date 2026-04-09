import type { Tlk } from '@/steps/4.biffs2json/tlk/index.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from '@/steps/4.biffs2json/cre/index.js';
import type { GhostCreatureV10, GhostCreatureV12, GhostCreatureV22, GhostCreatureV90 } from '../../types.js';
import patchWithTranslation from './patchTranslation.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
type GhostCreature = GhostCreatureV10 | GhostCreatureV12 | GhostCreatureV22 | GhostCreatureV90;

const patchCres = (cres: Creature[], tlk: Tlk): GhostCreature[] => {
  return cres
    .map((cre) => {
      switch (cre.header.version) {
        case 'v1.0': return patchWithTranslation(cre, tlk);
        case 'v1.1': throw new Error('Not implemented cre ghosting v1.1');
        case 'v1.2': throw new Error('Not implemented cre ghosting v1.2');
        case 'v2.2': throw new Error('Not implemented cre ghosting v2.2');
        case 'v9.0': throw new Error('Not implemented cre ghosting v9.0');
        default: throw new Error(`Out of range: '${cre.header.version}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
      }
    });
};

export default patchCres;
