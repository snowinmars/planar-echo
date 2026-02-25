import { offsetMap } from './readHeaderTypesV20.js';

import type { PartialWriteable } from '../../../shared/types.js';
import type { BufferReader } from '../../../pipes/readers.js';
import type { ItemMeta } from './readItemBufferTypes.js';
import type { ItemHeaderV20 } from './readHeaderTypesV20.js';

const readHeaderV20 = (reader: BufferReader, meta: ItemMeta): ItemHeaderV20 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v2.0.htm

  const tmp: PartialWriteable<ItemHeaderV20> = {};

  tmp.signature = meta.signature;
  tmp.version = meta.version;

  tmp.unidentifiedNameRef = reader.uint();
  tmp.identifiedNameRef = reader.uint();

  if (tmp.unidentifiedNameRef === meta.emptyInt) tmp.unidentifiedNameRef = -1;
  if (tmp.identifiedNameRef === meta.emptyInt) tmp.identifiedNameRef = -1;

  tmp.replacementItem = reader.string(8);
  tmp.flags = reader.map.uint(offsetMap.flags.parseFlags);
  tmp.itemType = reader.map.short(offsetMap.itemTypes.parse);
  tmp.unusableBy = reader.map.uint(offsetMap.unusableBy.parseFlags);
  tmp.weaponAnimation = reader.short();
  tmp.minLevel = reader.short();
  tmp.minStrength = reader.short();
  tmp.minStrengthBonus = reader.byte();
  reader.skip.byte(); // kitUsability1 unused
  tmp.minIntelligence = reader.byte();
  tmp.kitUsability2 = reader.map.byte(offsetMap.kitUsability2.parseFlags);
  tmp.minDexterity = reader.byte();
  tmp.kitUsability3 = reader.map.byte(offsetMap.kitUsability3.parseFlags);
  tmp.minWisdom = reader.byte();
  tmp.kitUsability4 = reader.map.byte(offsetMap.kitUsability4.parseFlags);
  tmp.minConstitution = reader.byte();
  tmp.weaponProficiency = reader.byte(); // reader.map.byte(offsetMap.weaponProficiency.parse);
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

  reader.skip.custom(16);

  return {
    signature: tmp.signature,
    version: tmp.version,
    unidentifiedNameRef: tmp.unidentifiedNameRef,
    identifiedNameRef: tmp.identifiedNameRef,
    replacementItem: tmp.replacementItem,
    flags: tmp.flags,
    itemType: tmp.itemType,
    unusableBy: tmp.unusableBy,
    weaponAnimation: tmp.weaponAnimation,
    minLevel: tmp.minLevel,
    minStrength: tmp.minStrength,
    minStrengthBonus: tmp.minStrengthBonus,
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

export default readHeaderV20;
