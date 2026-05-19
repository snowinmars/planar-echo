import { extendMap } from './parseEffectV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { EffectV10 } from './parseEffectV10.types.js';

type ParseEffV10Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;

export const parseEffectV10 = ({
  reader,
  resourceName,
}: ParseEffV10Props): EffectV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const effectType = reader.byte();
  const targetType = reader.map.byte(extendMap.targetType.parse);
  const power = reader.byte();
  const parameter1 = reader.uint();
  const parameter2 = reader.uint();
  const timingMode = reader.map.byte(extendMap.timingMode.parse);
  const dispelOrResistance = reader.map.byte(extendMap.dispelOrResistance.parse);
  const duration = reader.uint();
  const probability1 = reader.byte();
  const probability2 = reader.byte();
  const resRef = reader.string(8);
  const diceThrownOrMaximumLevel = reader.uint();
  const diceSidesOrMinimumLevel = reader.uint();
  const savingThrowType = reader.map.uint(extendMap.savingThrowType.parseFlags);
  const savingThrowBonus = reader.uint();
  reader.skip.uint();

  return {
    resourceName,
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
