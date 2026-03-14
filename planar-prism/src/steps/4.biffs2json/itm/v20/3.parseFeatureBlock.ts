import { offsetMap } from '../v20.types/3.featureBlock.js';

import type { BufferReader } from '../../../../pipes/readers.js';
import type { FeatureBlockV20 } from '../v20.types/3.featureBlock.js';

const parseFeatureBlock = (reader: BufferReader): FeatureBlockV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v2.0.htm

  const opcodeNumber = reader.short();
  const targetType = reader.map.byte(offsetMap.targetType.parse);
  const power = reader.byte();
  const parameter1 = reader.uint();
  const parameter2 = reader.uint();
  const timingMode = reader.map.byte(offsetMap.timingMode.parse);
  const resistance = reader.map.byte(offsetMap.resistance.parse);
  const duration = reader.uint();
  const probability1 = reader.byte();
  const probability2 = reader.byte();
  const resource = reader.string(8);
  const diceThrown = reader.uint();
  const diceSides = reader.uint();
  const savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  const savingThrowBonus = reader.uint();
  const special = reader.uint();

  return {
    opcodeNumber,
    targetType,
    power,
    parameter1,
    parameter2,
    timingMode,
    resistance,
    duration,
    probability1,
    probability2,
    resource,
    diceThrown,
    diceSides,
    savingThrowType,
    savingThrowBonus,
    special,
  };
};

const parseFeatureBlocks = (reader: BufferReader, count: number): FeatureBlockV20[] => {
  const featureBlockSize = 48;
  return Array.from<never, FeatureBlockV20>({ length: count }, (_, i) => parseFeatureBlock(reader.fork(reader.offset + i * featureBlockSize)));
};

export { parseFeatureBlock };

export default parseFeatureBlocks;
