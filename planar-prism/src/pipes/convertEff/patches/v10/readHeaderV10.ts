import type { BufferReader } from '../../../../pipes/readers.js';
import type { EffectMeta } from '../readEffectBufferTypes.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import { offsetMap, type EffectHeaderV10 } from './readHeaderTypesV10.js';

const readHeaderV10 = (reader: BufferReader, meta: EffectMeta): EffectHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const tmp: PartialWriteable<EffectHeaderV10> = {};

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

export default readHeaderV10;
