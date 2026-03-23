import { offsetMap } from '../v10.types/2.extendedHeader.js';
import { parseFeatureBlock } from './3.parseFeatureBlock.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { ExtendedHeaderV10 } from '../v10.types/2.extendedHeader.js';
import type { FeatureBlockV10 } from '../v10.types/3.featureBlock.js';

const parseExtendedHeadersFeatureBlocks = (reader: BufferReader, count: number, index: number): FeatureBlockV10[] => {
  const featureBlockSize = 48;
  const featureBlocks: FeatureBlockV10[] = [];
  for (let j = 0; j < count; j++) {
    const offset = index * featureBlockSize; // use index, not j // TODO [snow]: are they equal?
    const extendedHeaderFeatureBlock = parseFeatureBlock(reader.fork(offset));
    featureBlocks.push(extendedHeaderFeatureBlock);
  }

  return featureBlocks;
};

const parseExtendedHeader = (reader: BufferReader, offsetToFeatureBlocks: number): ExtendedHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.htm#Header_Proficiency

  const attackType = reader.map.byte(offsetMap.attackType.parse);
  const idRequired = reader.map.byte(offsetMap.idRequired.parseFlags);
  const location = reader.map.byte(offsetMap.location.parse, offsetMap.location[0]);
  const alternativeDiceSides = reader.byte();
  const useIcon = reader.string(8);
  const targetType = reader.map.byte(offsetMap.targetType.parse);
  const targetCount = reader.byte();
  const range = reader.short();
  const launcherRequired = reader.map.byte(offsetMap.launcherRequired.parse);
  const alternativeDiceThrown = reader.byte();
  const speedFactor = reader.byte();
  const alternativeDamageBonus = reader.byte();
  const thac0bonus = reader.short();
  const diceSides = reader.byte();
  const primaryType = reader.byte();
  const diceThrown = reader.byte();
  const secondaryType = reader.byte();
  const damageBonus = reader.short();
  const damageType = reader.map.short(offsetMap.damageType.parse, offsetMap.damageType[0]);
  const countOfFeatureBlocks = reader.short();
  const indexIntoFeatureBlocks = reader.short();
  const maxCharges = reader.short();
  const chargeDepletionBehaviour = reader.map.short(offsetMap.chargeDepletionBehaviour.parse);
  const flags = reader.map.uint(offsetMap.flags.parseFlags);
  const projectileAnimation = reader.short();
  const meleeAnimation1 = reader.short();
  const meleeAnimation2 = reader.short();
  const meleeAnimation3 = reader.short();
  const bowArrowQualifier = reader.boolean.short();
  const crossbowBoltQualifier = reader.boolean.short();
  const miscProjectileQualifier = reader.boolean.short();
  const featureBlocks = parseExtendedHeadersFeatureBlocks(reader.fork(offsetToFeatureBlocks), countOfFeatureBlocks, indexIntoFeatureBlocks);

  return {
    attackType,
    idRequired,
    location,
    alternativeDiceSides,
    useIcon,
    targetType,
    targetCount,
    range,
    launcherRequired,
    alternativeDiceThrown,
    speedFactor,
    alternativeDamageBonus,
    thac0bonus,
    diceSides,
    primaryType,
    diceThrown,
    secondaryType,
    damageBonus,
    damageType,
    countOfFeatureBlocks,
    indexIntoFeatureBlocks,
    maxCharges,
    chargeDepletionBehaviour,
    flags,
    projectileAnimation,
    meleeAnimation1,
    meleeAnimation2,
    meleeAnimation3,
    bowArrowQualifier,
    crossbowBoltQualifier,
    miscProjectileQualifier,
    featureBlocks,
  };
};

const parseExtendedHeaders = (reader: BufferReader, count: number, offsetToFeatureBlocks: number): ExtendedHeaderV10[] => {
  const extendedHeaderSize = 56;
  return Array.from<never, ExtendedHeaderV10>({ length: count }, (_, i) => parseExtendedHeader(reader.fork(reader.offset + i * extendedHeaderSize), offsetToFeatureBlocks));
};

export default parseExtendedHeaders;
