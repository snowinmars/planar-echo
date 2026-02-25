import { offsetMap } from './readFeatureBlockTypesV10.js';

import type { PartialWriteable } from '../../../shared/types.js';
import type { BufferReader } from '../../../pipes/readers.js';
import type { ItemMeta } from './readItemBufferTypes.js';
import type { ItemFeatureBlockV10 } from './readFeatureBlockTypesV10.js';

const readFeatureBlockV10 = (reader: BufferReader, meta: ItemMeta): ItemFeatureBlockV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.htm#Header_Proficiency

  const tmp: PartialWriteable<ItemFeatureBlockV10> = {};

  tmp.opcodeNumber = reader.short();
  tmp.targetType = reader.map.byte(offsetMap.targetType.parse);
  tmp.power = reader.byte();
  tmp.parameter1 = reader.uint();
  tmp.parameter2 = reader.uint();
  tmp.timingMode = reader.map.byte(offsetMap.timingMode.parse);
  tmp.dispelOrResistance = reader.map.byte(offsetMap.resistance.parse);
  tmp.duration = reader.uint();
  tmp.probability1 = reader.byte();
  tmp.probability2 = reader.byte();
  tmp.resource = reader.string(8);
  tmp.diceThrownOrMaximumLevel = reader.uint();
  tmp.diceSidesOrMinimumLevel = reader.uint();
  tmp.savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  tmp.savingThrowBonus = reader.uint();
  tmp.stackingId = reader.uint();

  return {
    opcodeNumber: tmp.opcodeNumber,
    targetType: tmp.targetType,
    power: tmp.power,
    parameter1: tmp.parameter1,
    parameter2: tmp.parameter2,
    timingMode: tmp.timingMode,
    dispelOrResistance: tmp.dispelOrResistance,
    duration: tmp.duration,
    probability1: tmp.probability1,
    probability2: tmp.probability2,
    resource: tmp.resource,
    diceThrownOrMaximumLevel: tmp.diceThrownOrMaximumLevel,
    diceSidesOrMinimumLevel: tmp.diceSidesOrMinimumLevel,
    savingThrowType: tmp.savingThrowType,
    savingThrowBonus: tmp.savingThrowBonus,
    stackingId: tmp.stackingId,
  };
};

export default readFeatureBlockV10;
