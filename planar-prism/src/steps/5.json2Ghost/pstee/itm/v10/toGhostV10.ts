import type { RawItmV10 } from '@/steps/4.biffs2json/pstee/itm/parseItms.types.js';
import type { GhostItm, GhostItmV10 } from '@planar/shared';

export const toGhostV10 = (raw: RawItmV10): GhostItmV10 => {
  const ghostItm: GhostItm = {
    version: raw.header.version,
    resourceName: raw.resourceName,
    unidentifiedNameRef: raw.header.unidentifiedNameRef,
    identifiedNameRef: raw.header.identifiedNameRef,
    unidentifiedDescriptionRef: raw.header.unidentifiedDescriptionRef,
    identifiedDescriptionRef: raw.header.identifiedDescriptionRef,
    dropSound: raw.header.dropSound,
    flags: raw.header.flags,
    category: raw.header.category,
    unusableBy: raw.header.unusableBy,
    equippedAppearance: raw.header.equippedAppearance,
    minLevel: raw.header.minLevel,
    minStrength: raw.header.minStrength,
    minStrengthBonus: raw.header.minStrengthBonus,
    kitUsability1: raw.header.kitUsability1,
    minIntelligence: raw.header.minIntelligence,
    kitUsability2: raw.header.kitUsability2,
    minDexterity: raw.header.minDexterity,
    kitUsability3: raw.header.kitUsability3,
    minWisdom: raw.header.minWisdom,
    kitUsability4: raw.header.kitUsability4,
    minConstitution: raw.header.minConstitution,
    weaponProficiency: raw.header.weaponProficiency,
    minCharisma: raw.header.minCharisma,
    price: raw.header.price,
    maxInStack: raw.header.maxInStack,
    inventoryIcon: raw.header.inventoryIcon,
    loreToId: raw.header.loreToId,
    groundIcon: raw.header.groundIcon,
    weight: raw.header.weight,
    pickupSound: raw.header.pickupSound,
    enchantment: raw.header.enchantment,
    abilities: raw.abilities,
    effects: raw.effects,
  };

  return ghostItm;
};
