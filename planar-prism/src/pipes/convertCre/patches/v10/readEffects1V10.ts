import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import { offsetMap, type CreatureEffect1V10 } from './readEffects1TypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

const readCreatureEffect1V10 = (reader: BufferReader, meta: CreatureMeta): CreatureEffect1V10 => {
  const tmp: PartialWriteable<CreatureEffect1V10> = {};

  tmp.effectType = reader.byte();
  tmp.targetType = reader.map.byte(offsetMap.targetType.parse);
  tmp.power = reader.byte();
  tmp.parameter1 = reader.uint();
  tmp.parameter2 = reader.uint();
  tmp.timingMode = reader.map.byte(offsetMap.timingMode.parse);
  tmp.dispelOrResistance = reader.map.byte(offsetMap.dispelOrResistance.parse);
  tmp.duration = reader.uint();
  tmp.probability1 = reader.byte();
  tmp.probability2 = reader.byte();
  tmp.resRef = reader.string(8);
  tmp.diceThrownOrMaximumLevel = reader.uint();
  tmp.diceSidesOrMinimumLevel = reader.uint();
  tmp.savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  tmp.savingThrowBonus = reader.uint();
  reader.skip.uint();

  return {
    effectType: tmp.effectType,
    targetType: tmp.targetType,
    power: tmp.power,
    parameter1: tmp.parameter1,
    parameter2: tmp.parameter2,
    timingMode: tmp.timingMode,
    dispelOrResistance: tmp.dispelOrResistance,
    duration: tmp.duration,
    probability1: tmp.probability1,
    probability2: tmp.probability2,
    resRef: tmp.resRef,
    diceThrownOrMaximumLevel: tmp.diceThrownOrMaximumLevel,
    diceSidesOrMinimumLevel: tmp.diceSidesOrMinimumLevel,
    savingThrowType: tmp.savingThrowType,
    savingThrowBonus: tmp.savingThrowBonus,
  };
};

const readCreatureEffects1V10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): CreatureEffect1V10[] => {
  const creatureEffectSize = 84;
  const creatureEffects: CreatureEffect1V10[] = [];
  for (let i = 0; i < header.countOfEffects; i++) {
    const offset = header.offsetToEffects + i * creatureEffectSize;
    const creatureEffect = readCreatureEffect1V10(reader.fork(offset), meta);
    creatureEffects.push(creatureEffect);
  }

  return creatureEffects;
};

export default readCreatureEffects1V10;
