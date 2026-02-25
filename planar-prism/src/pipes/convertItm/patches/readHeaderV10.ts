import { offsetMap } from './readHeaderTypesV10.js';

import type { PartialWriteable } from '../../../shared/types.js';
import type { BufferReader } from '../../../pipes/readers.js';
import type { ItemMeta } from './readItemBufferTypes.js';
import type { ItemHeaderV10 } from './readHeaderTypesV10.js';

const readHeaderV10 = (reader: BufferReader, meta: ItemMeta): ItemHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.htm

  const tmp: PartialWriteable<ItemHeaderV10> = {};

  tmp.signature = meta.signature;
  tmp.version = meta.version;

  tmp.unidentifiedNameRef = reader.uint();
  tmp.identifiedNameRef = reader.uint();
  if (tmp.unidentifiedNameRef === meta.emptyInt) tmp.unidentifiedNameRef = -1;
  if (tmp.identifiedNameRef === meta.emptyInt) tmp.identifiedNameRef = -1;

  if (meta.isBg || meta.isBg2 || meta.isBgee) {
    tmp.replacementItem = reader.string(8);
  }
  else if (meta.isPstee) {
    tmp.dropSound = reader.string(8);
  }

  tmp.flags = reader.map.uint(offsetMap.flags.parseFlags);
  tmp.itemType = reader.map.short(offsetMap.itemTypes.parse);
  tmp.unusableBy = reader.map.uint(offsetMap.unusableBy.parseFlags);

  if (meta.isBg || meta.isIwd) {
    tmp.itemAnimation = reader.map.short(offsetMap.itemAnimationBgIwd.parse);
  }
  else if (meta.isBg2) {
    tmp.itemAnimation = reader.map.short(offsetMap.itemAnimationBg2.parse);
  }
  else if (meta.isEe) {
    tmp.itemAnimation = reader.map.short(offsetMap.itemAnimationEe.parse);
  }
  else {
    const unknownItemAnimationShort = reader.short();
    tmp.itemAnimation = offsetMap.itemAnimationEe.parse(unknownItemAnimationShort);
    console.warn(`Undocumented item animation ${unknownItemAnimationShort} for ${meta.resourceName} parsed as Enchanged Edition item animation`);
  }

  tmp.minLevel = reader.short();
  tmp.minStrength = reader.short();
  tmp.minStrengthBonus = reader.byte();
  tmp.kitUsability1 = reader.map.byte(offsetMap.kitUsability1.parseFlags);
  tmp.minIntelligence = reader.byte();
  tmp.kitUsability2 = reader.map.byte(offsetMap.kitUsability2.parseFlags);
  tmp.minDexterity = reader.byte();
  tmp.kitUsability3 = reader.map.byte(offsetMap.kitUsability3.parseFlags);
  tmp.minWisdom = reader.byte();
  tmp.kitUsability4 = reader.map.byte(offsetMap.kitUsability4.parseFlags);
  tmp.minConstitution = reader.byte();
  tmp.weaponProficiency = reader.map.byte(offsetMap.weaponProficiency.parse);
  tmp.minCharisma = reader.short();
  tmp.price = reader.uint();
  tmp.stackAmount = reader.short();
  tmp.inventoryIcon = reader.string(8);
  tmp.loreToId = reader.short();
  tmp.groundIcon = reader.string(8);
  tmp.weight = reader.uint();

  tmp.unidentifiedDescriptionRef = reader.uint();
  tmp.identifiedDescriptionRef = reader.uint();
  if (tmp.unidentifiedDescriptionRef === meta.emptyInt) tmp.unidentifiedDescriptionRef = -1;
  if (tmp.identifiedDescriptionRef === meta.emptyInt) tmp.identifiedDescriptionRef = -1;

  tmp.descriptionIcon = reader.string(8);
  tmp.enchantment = reader.uint();
  tmp.offsetToExtendedHeaders = reader.uint();
  tmp.countOfExtendedHeaders = reader.short();
  tmp.offsetToFeatureBlocks = reader.uint();
  tmp.indexIntoEquippingFeatureBlocks = reader.short();
  tmp.countOfEquippingFeatureBlocks = reader.short();

  return {
    signature: tmp.signature,
    version: tmp.version,
    unidentifiedNameRef: tmp.unidentifiedNameRef,
    identifiedNameRef: tmp.identifiedNameRef,
    replacementItem: tmp.replacementItem,
    dropSound: tmp.dropSound,
    flags: tmp.flags,
    itemType: tmp.itemType,
    unusableBy: tmp.unusableBy,
    itemAnimation: tmp.itemAnimation,
    minLevel: tmp.minLevel,
    minStrength: tmp.minStrength,
    minStrengthBonus: tmp.minStrengthBonus,
    kitUsability1: tmp.kitUsability1,
    minIntelligence: tmp.minIntelligence,
    kitUsability2: tmp.kitUsability2,
    minDexterity: tmp.minDexterity,
    kitUsability3: tmp.kitUsability3,
    minWisdom: tmp.minWisdom,
    kitUsability4: tmp.kitUsability4,
    minConstitution: tmp.minConstitution,
    weaponProficiency: tmp.weaponProficiency,
    minCharisma: tmp.minCharisma,
    price: tmp.price,
    stackAmount: tmp.stackAmount,
    inventoryIcon: tmp.inventoryIcon,
    loreToId: tmp.loreToId,
    groundIcon: tmp.groundIcon,
    weight: tmp.weight,
    unidentifiedDescriptionRef: tmp.unidentifiedDescriptionRef,
    identifiedDescriptionRef: tmp.identifiedDescriptionRef,
    descriptionIcon: tmp.descriptionIcon,
    enchantment: tmp.enchantment,
    offsetToExtendedHeaders: tmp.offsetToExtendedHeaders,
    countOfExtendedHeaders: tmp.countOfExtendedHeaders,
    offsetToFeatureBlocks: tmp.offsetToFeatureBlocks,
    indexIntoEquippingFeatureBlocks: tmp.indexIntoEquippingFeatureBlocks,
    countOfEquippingFeatureBlocks: tmp.countOfEquippingFeatureBlocks,
  };
};

export default readHeaderV10;
