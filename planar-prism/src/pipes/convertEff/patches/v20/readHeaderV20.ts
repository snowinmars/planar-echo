import type { BufferReader } from '../../../../pipes/readers.js';
import type { EffectMeta } from '../readEffectBufferTypes.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import { offsetMap, type EffectHeaderV20 } from './readHeaderTypesV20.js';

const readHeaderV20 = (reader: BufferReader, meta: EffectMeta): EffectHeaderV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

  const tmp: PartialWriteable<EffectHeaderV20> = {};

  tmp.signature = meta.signature;
  tmp.version = meta.version;

  tmp.externalEffectsSignature = reader.string(4);
  tmp.externalEffectsVersion = reader.string(4);

  tmp.type = reader.map.uint(offsetMap.type.parse);
  tmp.target = reader.uint(); // TODO [snow]: to enum
  tmp.power = reader.uint();
  tmp.parameter1 = reader.uint();
  tmp.parameter2 = reader.uint();
  tmp.timingMode = reader.map.uint(offsetMap.timingMode.parse);
  tmp.duration = reader.uint();
  tmp.probability1 = reader.short();
  tmp.probability2 = reader.short();
  tmp.resRef = reader.string(8);
  tmp.diceThrown = reader.uint();
  tmp.diceSides = reader.uint();
  tmp.savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  tmp.saveBonus = reader.uint();
  tmp.special = reader.uint();
  tmp.primaryTypeSchool = reader.uint(); // TODO [snow]: to enum
  reader.skip.uint();
  if (meta.isPstee) {
    tmp.minimumLevel = reader.uint();
    tmp.maximumLevel = reader.uint();
  }
  else {
    tmp.parentResourceLowestAffectedLevel = reader.uint();
    tmp.parentResourceHighestAffectedLevel = reader.uint();
  }
  tmp.dispelOrResistance = reader.map.uint(offsetMap.dispelOrResistance.parseFlags);
  tmp.parameter3 = reader.uint();
  tmp.parameter4 = reader.uint();
  if (meta.isPstee) {
    tmp.parameter5 = reader.uint();
  }
  tmp.timeApplied = reader.uint();
  tmp.resource2Ref = reader.string(8);
  tmp.resource3Ref = reader.string(8);
  tmp.casterXcoordinate = reader.uint();
  tmp.casterYcoordinate = reader.uint();
  tmp.targetXcoordinate = reader.uint();
  tmp.targetYcoordinate = reader.uint();
  tmp.parentResourceType = reader.map.uint(offsetMap.parentResourceType.parse);
  tmp.parentResourceRef = reader.string(8);
  tmp.parentResourceFlags = reader.map.uint(offsetMap.parentResourceFlags.parseFlags);
  tmp.projectile = reader.uint();
  tmp.parentResourceSlot = reader.uint();
  tmp.variableName = reader.string(32);
  tmp.casterLevel = reader.uint();
  tmp.firstApply = reader.uint();
  tmp.secondaryType = reader.uint();

  reader.skip.custom(15);
  reader.skip.custom(15);
  reader.skip.custom(15);
  reader.skip.custom(15);

  return {
    signature: tmp.signature,
    version: tmp.version,
    externalEffectsSignature: tmp.externalEffectsSignature,
    externalEffectsVersion: tmp.externalEffectsVersion,
    type: tmp.type,
    target: tmp.target,
    power: tmp.power,
    parameter1: tmp.parameter1,
    parameter2: tmp.parameter2,
    timingMode: tmp.timingMode,
    duration: tmp.duration,
    probability1: tmp.probability1,
    probability2: tmp.probability2,
    resRef: tmp.resRef,
    diceThrown: tmp.diceThrown,
    diceSides: tmp.diceSides,
    savingThrowType: tmp.savingThrowType,
    saveBonus: tmp.saveBonus,
    special: tmp.special,
    primaryTypeSchool: tmp.primaryTypeSchool,
    minimumLevel: tmp.minimumLevel,
    maximumLevel: tmp.maximumLevel,
    parentResourceLowestAffectedLevel: tmp.parentResourceLowestAffectedLevel,
    parentResourceHighestAffectedLevel: tmp.parentResourceHighestAffectedLevel,
    dispelOrResistance: tmp.dispelOrResistance,
    parameter3: tmp.parameter3,
    parameter4: tmp.parameter4,
    parameter5: tmp.parameter5,
    timeApplied: tmp.timeApplied,
    resource2Ref: tmp.resource2Ref,
    resource3Ref: tmp.resource3Ref,
    casterXcoordinate: tmp.casterXcoordinate,
    casterYcoordinate: tmp.casterYcoordinate,
    targetXcoordinate: tmp.targetXcoordinate,
    targetYcoordinate: tmp.targetYcoordinate,
    parentResourceType: tmp.parentResourceType,
    parentResourceRef: tmp.parentResourceRef,
    parentResourceFlags: tmp.parentResourceFlags,
    projectile: tmp.projectile,
    parentResourceSlot: tmp.parentResourceSlot,
    variableName: tmp.variableName,
    casterLevel: tmp.casterLevel,
    firstApply: tmp.firstApply,
    secondaryType: tmp.secondaryType,
  };
};

export default readHeaderV20;
