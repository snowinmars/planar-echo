import { offsetMap } from './readFeatureBlockTypesV20.js';
import type { BufferReader } from '../../../../pipes/readers.js';
import type { ItemFeatureBlockV20 } from './readFeatureBlockTypesV20.js';
import type { ItemMeta } from '../readItemBufferTypes.js';
import type { PartialWriteable } from '../../../../shared/types.js';

const readFeatureBlockV20 = (reader: BufferReader, meta: ItemMeta): ItemFeatureBlockV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v2.0.htm

  const tmp: PartialWriteable<ItemFeatureBlockV20> = {};

  tmp.opcodeNumber = reader.short();
  tmp.targetType = reader.map.byte(offsetMap.targetType.parse);
  tmp.power = reader.byte();
  tmp.parameter1 = reader.uint();
  tmp.parameter2 = reader.uint();
  tmp.timingMode = reader.map.byte(offsetMap.timingMode.parse);
  tmp.resistance = reader.map.byte(offsetMap.resistance.parse);
  tmp.duration = reader.uint();
  tmp.probability1 = reader.byte();
  tmp.probability2 = reader.byte();
  tmp.resource = reader.string(8);
  tmp.diceThrown = reader.uint();
  tmp.diceSides = reader.uint();
  tmp.savingThrowType = reader.map.uint(offsetMap.savingThrowType.parse);
  tmp.savingThrowBonus = reader.uint();
  tmp.special = reader.uint();

  return {
    opcodeNumber: tmp.opcodeNumber,
    targetType: tmp.targetType,
    power: tmp.power,
    parameter1: tmp.parameter1,
    parameter2: tmp.parameter2,
    timingMode: tmp.timingMode,
    resistance: tmp.resistance,
    duration: tmp.duration,
    probability1: tmp.probability1,
    probability2: tmp.probability2,
    resource: tmp.resource,
    diceThrown: tmp.diceThrown,
    diceSides: tmp.diceSides,
    savingThrowType: tmp.savingThrowType,
    savingThrowBonus: tmp.savingThrowBonus,
    special: tmp.special,
  };
};

export default readFeatureBlockV20;
