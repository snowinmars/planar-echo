import { extendMap } from './1.parseHeader.types.js';
import { normalizeRef } from '@/shared/numbers.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { HeaderV10 } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader): HeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.1.htm

  const unidentifiedNameRef = normalizeRef(reader.uint());
  const identifiedNameRef = normalizeRef(reader.uint());

  const dropSound = reader.string(8);
  const flags = reader.map.uint(extendMap.flags.parseFlags);
  const category = reader.map.short(extendMap.category.parse);
  const unusableBy = reader.map.uint(extendMap.unusableBy.parseFlags);
  const equippedAppearance = reader.map.short(extendMap.equippedAppearance.parse);
  const minLevel = reader.short();
  const minStrength = reader.short();
  const minStrengthBonus = reader.byte();
  const kitUsability1 = reader.map.byte(extendMap.kitUsability1.parseFlags);
  const minIntelligence = reader.byte();
  const kitUsability2 = reader.map.byte(extendMap.kitUsability2.parseFlags);
  const minDexterity = reader.byte();
  const kitUsability3 = reader.map.byte(extendMap.kitUsability3.parseFlags);
  const minWisdom = reader.byte();
  const kitUsability4 = reader.map.byte(extendMap.kitUsability4.parseFlags);
  const minConstitution = reader.byte();
  const weaponProficiency = reader.map.byte(extendMap.weaponProficiency.parse);
  const minCharisma = reader.short();
  const price = reader.uint();
  const maxInStack = reader.short();
  const inventoryIcon = reader.string(8);
  const loreToId = reader.short();
  const groundIcon = reader.string(8);
  const weight = reader.uint();
  const unidentifiedDescriptionRef = normalizeRef(reader.uint());
  const identifiedDescriptionRef = normalizeRef(reader.uint());
  const pickupSound = reader.string(8);
  const enchantment = reader.uint();
  const offsetToAbilities = reader.uint();
  const countOfAbilities = reader.short();
  const offsetToEffects = reader.uint();
  const firstEffectIndex = reader.short();
  const countOfGlobalEffects = reader.short();

  return {
    signature: 'itm',
    version: 'v10',
    unidentifiedNameRef,
    identifiedNameRef,
    dropSound,
    flags,
    category,
    unusableBy,
    equippedAppearance,
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
    maxInStack,
    inventoryIcon,
    loreToId,
    groundIcon,
    weight,
    unidentifiedDescriptionRef,
    identifiedDescriptionRef,
    pickupSound,
    enchantment,
    offsetToAbilities,
    countOfAbilities,
    offsetToEffects,
    firstEffectIndex,
    countOfGlobalEffects,
  };
};
