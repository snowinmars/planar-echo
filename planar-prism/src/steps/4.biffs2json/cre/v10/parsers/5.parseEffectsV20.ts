import { offsetMap } from './../../v10.types/5.effectV20.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type { EffectV20 } from '../../v10.types/5.effectV20.js';

const parse = (reader: BufferReader): EffectV20 => {
  const signature = reader.string(4);
  const version = reader.string(4);
  const opCode = reader.uint();
  const targetType = reader.map.uint(offsetMap.targetType.parse);
  const power = reader.uint();
  const parameter1 = reader.uint();
  const parameter2 = reader.uint();
  const timingMode = reader.map.uint(offsetMap.timingMode.parse);
  const duration = reader.uint();
  const probability1 = reader.ushort();
  const probability2 = reader.ushort();
  const resourceRef = reader.string(8);
  const diceThrown = reader.uint();
  const diceSides = reader.uint();
  const savingThrowType = reader.map.uint(offsetMap.savingThrowType.parseFlags);
  const saveBonus = reader.uint();
  const specialEeGames = reader.uint();
  const primaryTypeSchool = reader.uint();
  reader.skip.uint();
  const parentResourceLowestAffectedLevel = reader.uint();
  const parentResourceHighestAffectedLevel = reader.uint();
  const dispelOrResistance = reader.map.uint(offsetMap.dispelOrResistance.parseFlags);
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
  const parentResourceType = reader.map.uint(offsetMap.parentResourceType.parse);
  const parentResource = reader.string(8);
  const parentResourceFlags = reader.map.uint(offsetMap.parentResourceFlags.parseFlags);
  const projectile = reader.uint();
  const parentResourceSlot = reader.uint(true);
  const variableName = reader.string(32);
  const casterLevel = reader.uint();
  const firstApply = reader.uint();
  const secondaryType = reader.uint();

  for (let i = 0; i < 15; i++) {
    reader.skip.uint();
  }

  return {
    signature,
    version,
    opCode,
    targetType,
    power,
    parameter1,
    parameter2,
    timingMode,
    duration,
    probability1,
    probability2,
    resourceRef,
    diceThrown,
    diceSides,
    savingThrowType,
    saveBonus,
    specialEeGames,
    primaryTypeSchool,
    parentResourceLowestAffectedLevel,
    parentResourceHighestAffectedLevel,
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
    projectile,
    parentResourceSlot,
    variableName,
    casterLevel,
    firstApply,
    secondaryType,
  };
};

const parseEffectsV20 = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): EffectV20[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v2.htm

  const effectSize = 264;
  return Array.from<never, EffectV20>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * effectSize)));
};

export default parseEffectsV20;
