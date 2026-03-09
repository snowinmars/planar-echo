import type { TlkEntry } from '../../convertTlk/types.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from '../patches/readCreatureBufferTypes.js';
type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;

const patchTranslation = (creature: Creature, tlk: TlkEntry): Creature => {
  if (!creature) return creature;
  const longNameTlkItem = tlk.itemsMap.get(creature.header.longNameRef);
  if (!longNameTlkItem) throw new Error(`Unable to find tlk translation for creature.longNameRef '${creature.header.longNameRef}'`);
  const shortNameTlkItem = tlk.itemsMap.get(creature.header.shortNameRef);
  if (!shortNameTlkItem) throw new Error(`Unable to find tlk translation for creature.shortNameRef '${creature.header.shortNameRef}'`);
  return {
    ...creature,
    header: {
      ...creature.header,
      longName: longNameTlkItem.text,
      shortName: shortNameTlkItem.text,
    },
  };
};

export default patchTranslation;
