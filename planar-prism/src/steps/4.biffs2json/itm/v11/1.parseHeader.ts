import { offsetMap } from '../v11.types/1.header.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../types.js';
import type { HeaderV11 } from '../v11.types/1.header.js';
import type { Signature, Versions } from '../types.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

const parseHeader = (reader: BufferReader, meta: Meta<Signature, Versions>): HeaderV11 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.1.htm

  const signature = meta.signature;
  const version = meta.version;

  const unidentifiedNameRef = normalizeRef(reader.uint(), meta.emptyInt);
  const identifiedNameRef = normalizeRef(reader.uint(), meta.emptyInt);

  const dropSound = reader.string(8);
  const flags = reader.map.uint(offsetMap.flags.parseFlags);
  const itemType = reader.map.short(offsetMap.itemType.parse);
  const unusableBy = reader.map.uint(offsetMap.unusableBy.parseFlags);
  const weaponAnimation = reader.map.short(offsetMap.weaponAnimation.parse);
  const minLevel = reader.short();

  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();

  const price = reader.uint();
  const stackAmount = reader.short();
  const inventoryIcon = reader.string(8);
  const loreToId = reader.short();
  const groundIcon = reader.string(8);
  const weight = reader.uint();
  const unidentifiedDescriptionRef = normalizeRef(reader.uint(), meta.emptyInt);
  const identifiedDescriptionRef = normalizeRef(reader.uint(), meta.emptyInt);
  const pickupSound = reader.string(8);
  const enchantment = reader.uint();
  const offsetToExtendedHeaders = reader.uint();
  const countOfExtendedHeaders = reader.short();
  const offsetToFeatureBlocks = reader.uint();
  const indexIntoEquippingFeatureBlocks = reader.short();
  const countOfEquippingFeatureBlocks = reader.short();
  const dialog = reader.string(8);
  const conversableLabelRef = reader.uint();
  const paperdollAnimationColour = reader.short();

  reader.skip.short();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();

  return {
    signature,
    version,
    unidentifiedNameRef,
    identifiedNameRef,
    dropSound,
    flags,
    itemType,
    unusableBy,
    weaponAnimation,
    minLevel,
    price,
    stackAmount,
    inventoryIcon,
    loreToId,
    groundIcon,
    weight,
    unidentifiedDescriptionRef,
    identifiedDescriptionRef,
    pickupSound,
    enchantment,
    offsetToExtendedHeaders,
    countOfExtendedHeaders,
    offsetToFeatureBlocks,
    indexIntoEquippingFeatureBlocks,
    countOfEquippingFeatureBlocks,
    dialog,
    conversableLabelRef,
    paperdollAnimationColour,
  };
};

export default parseHeader;
