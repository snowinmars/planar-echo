import { offsetMap } from '../v20.types/2.extendedHeader.js';
import { parseFeatureBlock } from './3.parseFeatureBlock.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { ExtendedHeaderV20 } from '../v20.types/2.extendedHeader.js';
import type { FeatureBlockV20 } from '../v20.types/3.featureBlock.js';

const parseExtendedHeadersFeatureBlocks = (reader: BufferReader, count: number, index: number): FeatureBlockV20[] => {
  const featureBlockSize = 48;
  const featureBlocks: FeatureBlockV20[] = [];
  for (let j = 0; j < count; j++) {
    const offset = index * featureBlockSize; // use index, not j // TODO [snow]: are they equal?
    const extendedHeaderFeatureBlock = parseFeatureBlock(reader.fork(offset));
    featureBlocks.push(extendedHeaderFeatureBlock);
  }

  return featureBlocks;
};

const parseExtendedHeader = (reader: BufferReader, offsetToFeatureBlocks: number): ExtendedHeaderV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v2.0.htm

  const attackType = reader.map.byte(offsetMap.attackType.parse);
  const idRequired = reader.map.byte(offsetMap.idRequired.parseFlags);
  const location = reader.map.byte(offsetMap.location.parse);
  const alternativeDiceSides = reader.byte();
  const useIcon = reader.string(8);
  const targetType = reader.map.byte(offsetMap.targetType.parse);
  const targetCount = reader.byte();
  const range = reader.short();
  const projectileType = reader.map.byte(offsetMap.projectileType.parse);
  const alternativeDiceThrown = reader.byte();
  const speed = reader.byte();
  const alternativeDamageBonus = reader.byte();
  const thac0bonus = reader.short();
  const diceSides = reader.byte();
  const primaryType = reader.byte();
  const diceThrown = reader.byte();
  const secondaryType = reader.byte();
  const damageBonus = reader.short();
  const damageType = reader.map.short(offsetMap.damageType.parse);
  const countOfFeatureBlocks = reader.short();
  const indexIntoFeatureBlocks = reader.short();
  const charges = reader.short();
  const chargeDepletionBehaviour = reader.map.short(offsetMap.chargeDepletionBehaviour.parse);
  const flags = reader.map.short(offsetMap.flags.parseFlags);
  const anotherAttackType = reader.map.short(offsetMap.anotherAttackType.parse);
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
    projectileType,
    alternativeDiceThrown,
    speed,
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
    charges,
    chargeDepletionBehaviour,
    flags,
    anotherAttackType,
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

const parseExtendedHeaders = (reader: BufferReader, count: number, offsetToFeatureBlocks: number): ExtendedHeaderV20[] => {
  const extendedHeaderSize = 56;
  return Array.from<never, ExtendedHeaderV20>({ length: count }, (_, i) => parseExtendedHeader(reader.fork(reader.offset + i * extendedHeaderSize), offsetToFeatureBlocks));
};

export default parseExtendedHeaders;
