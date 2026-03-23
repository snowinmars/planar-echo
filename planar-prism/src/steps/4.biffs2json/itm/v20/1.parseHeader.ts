import { offsetMap } from '../v20.types/1.header.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../types.js';
import type { HeaderV20 } from '../v20.types/1.header.js';
import type { Signature, Versions } from '../types.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

const parseHeader = (reader: BufferReader, meta: Meta<Signature, Versions>): HeaderV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v2.0.htm

  const signature = meta.signature;
  const version = meta.version;

  const unidentifiedNameRef = normalizeRef(reader.uint(), meta.emptyInt);
  const identifiedNameRef = normalizeRef(reader.uint(), meta.emptyInt);

  const replacementItem = reader.string(8);
  const flags = reader.map.uint(offsetMap.flags.parseFlags);
  const itemType = reader.map.short(offsetMap.itemType.parse);
  const unusableBy = reader.map.uint(offsetMap.unusableBy.parseFlags);
  const weaponAnimation = reader.short();
  const minLevel = reader.short();
  const minStrength = reader.short();
  const minStrengthBonus = reader.byte();

  reader.skip.byte(); // kitUsability1 unused

  const minIntelligence = reader.byte();
  const kitUsability2 = reader.map.byte(offsetMap.kitUsability2.parseFlags);
  const minDexterity = reader.byte();
  const kitUsability3 = reader.map.byte(offsetMap.kitUsability3.parseFlags);
  const minWisdom = reader.byte();
  const kitUsability4 = reader.map.byte(offsetMap.kitUsability4.parseFlags);
  const minConstitution = reader.byte();
  const weaponProficiency = reader.byte(); // reader.map.byte(offsetMap.weaponProficiency.parse);
  const minCharisma = reader.short();
  const price = reader.uint();
  const stackAmount = reader.short();
  const inventoryIcon = reader.string(8);
  const loreToId = reader.short();
  const groundIcon = reader.string(8);
  const weight = reader.uint();

  const unidentifiedDescriptionRef = normalizeRef(reader.uint(), meta.emptyInt);
  const identifiedDescriptionRef = normalizeRef(reader.uint(), meta.emptyInt);

  const descriptionIcon = reader.string(8);
  const enchantment = reader.uint();
  const offsetToExtendedHeaders = reader.uint();
  const countOfExtendedHeaders = reader.short();
  const offsetToFeatureBlocks = reader.uint();
  const indexIntoEquippingFeatureBlocks = reader.short();
  const countOfEquippingFeatureBlocks = reader.short();

  reader.skip.custom(16);

  return {
    signature,
    version,
    unidentifiedNameRef,
    identifiedNameRef,
    replacementItem,
    flags,
    itemType,
    unusableBy,
    weaponAnimation,
    minLevel,
    minStrength,
    minStrengthBonus,
    minIntelligence,
    kitUsability2,
    minDexterity,
    kitUsability3,
    minWisdom,
    kitUsability4,
    minConstitution,
    weaponProficiency,
    minCharisma,
    price,
    stackAmount,
    inventoryIcon,
    loreToId,
    groundIcon,
    weight,
    unidentifiedDescriptionRef,
    identifiedDescriptionRef,
    descriptionIcon,
    enchantment,
    offsetToExtendedHeaders,
    countOfExtendedHeaders,
    offsetToFeatureBlocks,
    indexIntoEquippingFeatureBlocks,
    countOfEquippingFeatureBlocks,
  };
};

export default parseHeader;
