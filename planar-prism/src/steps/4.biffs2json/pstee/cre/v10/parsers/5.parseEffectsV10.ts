import { extendMap } from './5.parseEffectsV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { EffectV10 } from './5.parseEffectsV10.types.js';

const parse = (reader: BufferReader): EffectV10 => {
  const type = reader.ushort();
  const target = reader.map.byte(extendMap.target.parse);
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
    type,
    target,
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

type ParseEffectsV10Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseEffectsV10 = ({
  reader,
  count,
}: ParseEffectsV10Props): EffectV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const effectSize = 48;
  return Array.from<never, EffectV10>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * effectSize)));
};
