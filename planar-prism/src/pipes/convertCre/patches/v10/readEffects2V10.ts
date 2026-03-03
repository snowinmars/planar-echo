import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import { offsetMap, type CreatureEffect2V10 } from './readEffects2TypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

const readCreatureEffect2V10 = (reader: BufferReader, meta: CreatureMeta): CreatureEffect2V10 => {
  const tmp: PartialWriteable<CreatureEffect2V10> = {};

  return {
  };
};

const readCreatureEffects1V10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): CreatureEffect2V10[] => {
  const creatureEffectSize = 84;
  const creatureEffects: CreatureEffect2V10[] = [];
  for (let i = 0; i < header.countOfEffects; i++) {
    const offset = header.offsetToEffects + i * creatureEffectSize;
    const creatureEffect = readCreatureEffect2V10(reader.fork(offset), meta);
    creatureEffects.push(creatureEffect);
  }

  return creatureEffects;
};

export default readCreatureEffects1V10;
