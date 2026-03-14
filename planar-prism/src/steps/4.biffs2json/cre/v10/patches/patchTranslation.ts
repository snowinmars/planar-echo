import type { Tlk } from '../../../../../steps/4.biffs2json/tlk/index.js';
import type { CreatureV10 } from '../../types.js';

const patchWithTranslation = (creature: CreatureV10, tlk: Tlk): CreatureV10 => {
  return {
    ...creature,
    header: {
      ...creature.header,
      longNameTlk: tlk.get(creature.header.longNameRef),
      shortNameTlk: tlk.get(creature.header.shortNameRef),
    },
  };
};

export default patchWithTranslation;
