import { offsetMap } from './readHeaderTypesV11.js';

import type { PartialWriteable } from '../../../shared/types.js';
import type { BufferReader } from '../../../pipes/readers.js';
import type { ItemMeta } from './readItemBufferTypes.js';
import type { ItemHeaderV11 } from './readHeaderTypesV11.js';

const readHeaderV11 = (reader: BufferReader, meta: ItemMeta): ItemHeaderV11 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.1.htm

  const tmp: PartialWriteable<ItemHeaderV11> = {};

  tmp.signature = meta.signature;
  tmp.version = meta.version;

  tmp.unidentifiedNameRef = reader.uint();
  tmp.identifiedNameRef = reader.uint();

  if (tmp.unidentifiedNameRef === meta.emptyInt) tmp.unidentifiedNameRef = -1;
  if (tmp.identifiedNameRef === meta.emptyInt) tmp.identifiedNameRef = -1;

  tmp.dropSound = reader.string(8);
  tmp.flags = reader.map.uint(offsetMap.flags.parseFlags);
  tmp.itemType = reader.map.short(offsetMap.itemType.parse);
  tmp.unusableBy = reader.map.uint(offsetMap.unusableBy.parseFlags);
  tmp.weaponAnimation = reader.map.short(offsetMap.weaponAnimation.parse);
  tmp.minLevel = reader.short();

  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();
  reader.skip.short();

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

  tmp.pickupSound = reader.string(8);
  tmp.enchantment = reader.uint();
  tmp.offsetToExtendedHeaders = reader.uint();
  tmp.countOfExtendedHeaders = reader.short();
  tmp.offsetToFeatureBlocks = reader.uint();
  tmp.indexIntoEquippingFeatureBlocks = reader.short();
  tmp.countOfEquippingFeatureBlocks = reader.short();
  tmp.dialog = reader.string(8);
  tmp.conversableLabelRef = reader.uint();
  tmp.paperdollAnimationColour = reader.short();

  reader.skip.short();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();
  reader.skip.uint();

  return {
    signature: tmp.signature,
    version: tmp.version,
    unidentifiedNameRef: tmp.unidentifiedNameRef,
    identifiedNameRef: tmp.identifiedNameRef,
    dropSound: tmp.dropSound,
    flags: tmp.flags,
    itemType: tmp.itemType,
    unusableBy: tmp.unusableBy,
    weaponAnimation: tmp.weaponAnimation,
    minLevel: tmp.minLevel,
    price: tmp.price,
    stackAmount: tmp.stackAmount,
    inventoryIcon: tmp.inventoryIcon,
    loreToId: tmp.loreToId,
    groundIcon: tmp.groundIcon,
    weight: tmp.weight,
    unidentifiedDescriptionRef: tmp.unidentifiedDescriptionRef,
    identifiedDescriptionRef: tmp.identifiedDescriptionRef,
    pickupSound: tmp.pickupSound,
    enchantment: tmp.enchantment,
    offsetToExtendedHeaders: tmp.offsetToExtendedHeaders,
    countOfExtendedHeaders: tmp.countOfExtendedHeaders,
    offsetToFeatureBlocks: tmp.offsetToFeatureBlocks,
    indexIntoEquippingFeatureBlocks: tmp.indexIntoEquippingFeatureBlocks,
    countOfEquippingFeatureBlocks: tmp.countOfEquippingFeatureBlocks,
    dialog: tmp.dialog,
    conversableLabelRef: tmp.conversableLabelRef,
    paperdollAnimationColour: tmp.paperdollAnimationColour,
  };
};

export default readHeaderV11;
