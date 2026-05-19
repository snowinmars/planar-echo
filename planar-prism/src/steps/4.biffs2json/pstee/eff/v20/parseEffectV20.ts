import { extendMap } from './parseEffectV20.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { EffectV20 } from './parseEffectV20.types.js';

type ParseEffectV20Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseEffectV20 = ({
  reader,
  resourceName,
}: ParseEffectV20Props): EffectV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const externalEffectsSignature = reader.string(4);
  const externalEffectsVersion = reader.string(4);

  const type = reader.map.uint(extendMap.type.parse);
  const target = reader.uint(); // TODO [snow]: to enum
  const power = reader.uint();
  const parameter1 = reader.uint();
  const parameter2 = reader.uint();
  const timingMode = reader.map.uint(extendMap.timingMode.parse);
  const duration = reader.uint();
  const probability1 = reader.short();
  const probability2 = reader.short();
  const resRef = reader.string(8);
  const diceThrown = reader.uint();
  const diceSides = reader.uint();
  const savingThrowType = reader.map.uint(extendMap.savingThrowType.parseFlags);
  const saveBonus = reader.uint();
  const special = reader.uint();
  const primaryTypeSchool = reader.uint(); // TODO [snow]: to enum
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
  const casterXcoordinate = reader.uint();
  const casterYcoordinate = reader.uint();
  const targetXcoordinate = reader.uint();
  const targetYcoordinate = reader.uint();
  const parentResourceType = reader.map.uint(extendMap.parentResourceType.parse);
  const parentResourceRef = reader.string(8);
  const parentResourceFlags = reader.map.uint(extendMap.parentResourceFlags.parseFlags);
  const projectile = reader.uint();
  const parentResourceSlot = reader.uint();
  const variableName = reader.string(32);
  const casterLevel = reader.uint();
  const firstApply = reader.uint();
  const secondaryType = reader.uint();

  reader.skip.custom(15);
  reader.skip.custom(15);
  reader.skip.custom(15);
  reader.skip.custom(15);

  return {
    resourceName,
    signature: 'eff',
    version: 'v2.0',
    externalEffectsSignature,
    externalEffectsVersion,
    type,
    target,
    power,
    parameter1,
    parameter2,
    timingMode,
    duration,
    probability1,
    probability2,
    resRef,
    diceThrown,
    diceSides,
    savingThrowType,
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
    casterXcoordinate,
    casterYcoordinate,
    targetXcoordinate,
    targetYcoordinate,
    parentResourceType,
    parentResourceRef,
    parentResourceFlags,
    projectile,
    parentResourceSlot,
    variableName,
    casterLevel,
    firstApply,
    secondaryType,
  };
};
