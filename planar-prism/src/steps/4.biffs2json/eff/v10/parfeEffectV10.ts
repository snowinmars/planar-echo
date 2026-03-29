import { offsetMap } from '../v10.types/effectV10.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../types.js';
import type { Signature, Versions } from '../types.js';
import type { EffectV10 } from '../v10.types/effectV10.js';

const parseEffV10FromBuffer = (reader: BufferReader, meta: Meta<Signature, Versions>): EffectV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const effectType = reader.byte();
  const targetType = reader.map.byte(offsetMap.targetType.parse);
  const power = reader.byte();
  const parameter1 = reader.uint();
  const parameter2 = reader.uint();
  const timingMode = reader.map.byte(offsetMap.timingMode.parse);
  const dispelOrResistance = reader.map.byte(offsetMap.dispelOrResistance.parse);
  const duration = reader.uint();
  const probability1 = reader.byte();
  const probability2 = reader.byte();
  const resRef = reader.string(8);
  const diceThrownOrMaximumLevel = reader.uint();
  const diceSidesOrMinimumLevel = reader.uint();
  const savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  const savingThrowBonus = reader.uint();

  reader.skip.uint();

  return {
    resourceName: meta.resourceName,
    effectType,
    targetType,
    power,
    parameter1,
    parameter2,
    timingMode,
    dispelOrResistance,
    duration,
    probability1,
    probability2,
    resRef,
    diceThrownOrMaximumLevel,
    diceSidesOrMinimumLevel,
    savingThrowType,
    savingThrowBonus,
  };
};

export default parseEffV10FromBuffer;
