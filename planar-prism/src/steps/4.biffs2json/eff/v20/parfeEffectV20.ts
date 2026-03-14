import { nothing } from '../../../../shared/maybe.js';
import { offsetMap } from '../v20.types/effectV20.js';

import type { BufferReader } from '../../../../pipes/readers.js';
import type { Meta } from '../../types.js';
import type { Signature, Versions } from '../types.js';
import type { EffectV20 } from '../v20.types/effectV20.js';

const parseEffV20FromBuffer = (reader: BufferReader, meta: Meta<Signature, Versions>): EffectV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const signature = meta.signature;
  const version = meta.version;

  const externalEffectsSignature = reader.string(4);
  const externalEffectsVersion = reader.string(4);

  const type = reader.map.uint(offsetMap.type.parse);
  const target = reader.uint(); // TODO [snow]: to enum
  const power = reader.uint();
  const parameter1 = reader.uint();
  const parameter2 = reader.uint();
  const timingMode = reader.map.uint(offsetMap.timingMode.parse);
  const duration = reader.uint();
  const probability1 = reader.short();
  const probability2 = reader.short();
  const resRef = reader.string(8);
  const diceThrown = reader.uint();
  const diceSides = reader.uint();
  const savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  const saveBonus = reader.uint();
  const special = reader.uint();
  const primaryTypeSchool = reader.uint(); // TODO [snow]: to enum

  reader.skip.uint();

  let minimumLevel: EffectV20['minimumLevel'] = nothing();
  let maximumLevel: EffectV20['maximumLevel'] = nothing();
  let parentResourceLowestAffectedLevel: EffectV20['parentResourceLowestAffectedLevel'] = nothing();
  let parentResourceHighestAffectedLevel: EffectV20['parentResourceHighestAffectedLevel'] = nothing();
  if (meta.isPstee) {
    minimumLevel = reader.uint();
    maximumLevel = reader.uint();
  }
  else {
    parentResourceLowestAffectedLevel = reader.uint();
    parentResourceHighestAffectedLevel = reader.uint();
  }

  const dispelOrResistance = reader.map.uint(offsetMap.dispelOrResistance.parseFlags);
  const parameter3 = reader.uint();
  const parameter4 = reader.uint();

  let parameter5: EffectV20['parameter5'] = nothing();
  if (meta.isPstee) {
    parameter5 = reader.uint();
  }

  const timeApplied = reader.uint();
  const resource2Ref = reader.string(8);
  const resource3Ref = reader.string(8);
  const casterXcoordinate = reader.uint();
  const casterYcoordinate = reader.uint();
  const targetXcoordinate = reader.uint();
  const targetYcoordinate = reader.uint();
  const parentResourceType = reader.map.uint(offsetMap.parentResourceType.parse);
  const parentResourceRef = reader.string(8);
  const parentResourceFlags = reader.map.uint(offsetMap.parentResourceFlags.parseFlags);
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
    resourceName: meta.resourceName,
    signature,
    version,
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
    parentResourceLowestAffectedLevel,
    parentResourceHighestAffectedLevel,
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

export default parseEffV20FromBuffer;
