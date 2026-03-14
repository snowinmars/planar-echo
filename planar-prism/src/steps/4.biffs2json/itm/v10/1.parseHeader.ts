import { nothing } from '../../../../shared/maybe.js';
import { offsetMap } from '../v10.types/1.header.js';

import type { BufferReader } from '../../../../pipes/readers.js';
import type { Meta } from '../../types.js';
import type { HeaderV10 } from '../v10.types/1.header.js';
import type { Signature, Versions } from '../types.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

const parseHeader = (reader: BufferReader, meta: Meta<Signature, Versions>): HeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.htm

  // const headerSize = 114;
  const signature = meta.signature;
  const version = meta.version;

  const unidentifiedNameRef = normalizeRef(reader.uint(), meta.emptyInt);
  const identifiedNameRef = normalizeRef(reader.uint(), meta.emptyInt);

  let replacementItem: HeaderV10['replacementItem'] = nothing();
  let dropSound: HeaderV10['dropSound'] = nothing();
  if (meta.isBg1 || meta.isBg2 || meta.isBg1ee) {
    replacementItem = reader.string(8);
  }
  else if (meta.isPstee) {
    dropSound = reader.string(8);
  }

  const flags = reader.map.uint(offsetMap.flags.parseFlags);
  const itemType = reader.map.short(offsetMap.itemType.parse);
  const unusableBy = reader.map.uint(offsetMap.unusableBy.parseFlags);

  let itemAnimation: HeaderV10['itemAnimation'];
  if (meta.isBg1 || meta.isIwd1) {
    itemAnimation = reader.map.short(offsetMap.itemAnimationBgIwd.parse);
  }
  else if (meta.isBg2) {
    itemAnimation = reader.map.short(offsetMap.itemAnimationBg2.parse);
  }
  else if (meta.isEe) {
    itemAnimation = reader.map.short(offsetMap.itemAnimationEe.parse);
  }
  else {
    const unknownItemAnimationShort = reader.short();
    itemAnimation = offsetMap.itemAnimationEe.parse(unknownItemAnimationShort);
    console.warn(`Undocumented item animation ${unknownItemAnimationShort} for ${meta.resourceName} parsed as Enchanged Edition item animation`);
  }

  const minLevel = reader.short();
  const minStrength = reader.short();
  const minStrengthBonus = reader.byte();
  const kitUsability1 = reader.map.byte(offsetMap.kitUsability1.parseFlags);
  const minIntelligence = reader.byte();
  const kitUsability2 = reader.map.byte(offsetMap.kitUsability2.parseFlags);
  const minDexterity = reader.byte();
  const kitUsability3 = reader.map.byte(offsetMap.kitUsability3.parseFlags);
  const minWisdom = reader.byte();
  const kitUsability4 = reader.map.byte(offsetMap.kitUsability4.parseFlags);
  const minConstitution = reader.byte();
  const weaponProficiency = reader.map.byte(offsetMap.weaponProficiency.parse);
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

  return {
    signature,
    version,
    unidentifiedNameRef,
    identifiedNameRef,
    replacementItem,
    dropSound,
    flags,
    itemType,
    unusableBy,
    itemAnimation,
    minLevel,
    minStrength,
    minStrengthBonus,
    kitUsability1,
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
