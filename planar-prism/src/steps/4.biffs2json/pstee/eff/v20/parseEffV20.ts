import { nothing } from '@planar/shared';

import { extendMap } from './parseEffV20.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawEffV20 } from './parseEffV20.types.js';

type ParseEffV20Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseEffV20 = ({
  reader,
  resourceName,
}: ParseEffV20Props): RawEffV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const externalEffectsSignature = reader.string(4);
  const externalEffectsVersion = reader.string(4);

  const type = reader.map.uint(extendMap.type.parse);
  const targetType = reader.map.uint(extendMap.targetType.parse);
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
  const _primaryTypeSchool = reader.uint(); // On the one hand, this is defaultMageTypesV10; on the other hand, this is magespec.ids; on the third hand, it is always 0 in pstee. M... Meh.
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
    targetType,
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
    primaryTypeSchool: _primaryTypeSchool === 0 ? nothing() : _primaryTypeSchool,
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
