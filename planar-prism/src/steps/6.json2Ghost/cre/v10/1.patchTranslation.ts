import type { Tlk } from '@/steps/4.biffs2json/tlk/index.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from '@/steps/4.biffs2json/cre/index.js';
import type { GhostCreatureV10, GhostCreatureV12, GhostCreatureV22, GhostCreatureV90 } from '../../types.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
type GhostCreature = GhostCreatureV10 | GhostCreatureV12 | GhostCreatureV22 | GhostCreatureV90;

const patchWithTranslation = (creature: Creature, tlk: Tlk): GhostCreature => {
  return {
    ...creature,
    header: {
      ...creature.header,
      longNameTlk: tlk.getText(creature.header.longNameRef),
      shortNameTlk: tlk.getText(creature.header.shortNameRef),
    },
  };
};

export default patchWithTranslation;
