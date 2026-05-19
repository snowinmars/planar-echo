import { extendMap } from './5.parseEffectsV20.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { EffectV20 } from './5.parseEffectsV20.types.js';

const parse = (reader: BufferReader): EffectV20 => {
  reader.skip.custom(4); // signature
  reader.skip.custom(4); // version
  const type = reader.uint();
  const target = reader.map.uint(extendMap.target.parse);
  const power = reader.uint();
  const starsCount = reader.uint();
  const proficiency = reader.ushort();
  const behavior = reader.ushort();
  const timingMode = reader.map.uint(extendMap.timingMode.parse);
  const duration = reader.uint();
  const probability1 = reader.ushort();
  const probability2 = reader.ushort();
  reader.skip.custom(8);
  const dicesThrownCount = reader.uint();
  const diceSides = reader.uint();
  const saveType = reader.map.uint(extendMap.saveType.parseFlags);
  const saveBonus = reader.uint();
  const special = reader.uint();
  const primaryTypeSchool = reader.uint();
  reader.skip.uint();
  const minimumLevel = reader.uint();
  const maximumLevel = reader.uint();
  const dispelOrResistance = reader.map.uint(extendMap.dispelOrResistance.parseFlags);
  const parameter3 = reader.uint();
  const parameter4 = reader.uint();
  const parameter5 = reader.uint();
  const timeApplied = reader.uint();
  const resource2Ref = reader.string(8);
  const resource3Ref = reader.string(8);
  const casterX = reader.uint(true);
  const casterY = reader.uint(true);
  const targetX = reader.uint(true);
  const targetY = reader.uint(true);
  const parentResourceType = reader.map.uint(extendMap.parentResourceType.parse);
  const parentResource = reader.string(8);
  const parentResourceFlags = reader.map.uint(extendMap.parentResourceFlags.parseFlags);
  const impactProjectile = reader.uint();
  const parentResourceSlot = reader.uint(true);
  const variableName = reader.string(32);
  const casterLevel = reader.uint();
  const firstApply = reader.uint();
  const secondaryType = reader.uint();

  for (let i = 0; i < 15; i++) {
    reader.skip.uint();
  }

  return {
    signature: 'eff',
    version: 'v2.0',
    type,
    target,
    power,
    starsCount,
    proficiency,
    behavior,
    timingMode,
    duration,
    probability1,
    probability2,
    dicesThrownCount,
    diceSides,
    saveType,
    saveBonus,
    special,
    primaryTypeSchool,
    minimumLevel,
    maximumLevel,
    dispelOrResistance,
    parameter3,
    parameter4,
    parameter5,
    timeApplied,
    resource2Ref,
    resource3Ref,
    casterX,
    casterY,
    targetX,
    targetY,
    parentResourceType,
    parentResource,
    parentResourceFlags,
    impactProjectile,
    parentResourceSlot,
    variableName,
    casterLevel,
    firstApply,
    secondaryType,
  };
};

type ParseEffectsV20Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseEffectsV20 = ({
  reader,
  count,
}: ParseEffectsV20Props): EffectV20[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v2.htm

  const effectSize = 264;
  return Array.from<never, EffectV20>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * effectSize)));
};
