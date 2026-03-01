import { extend } from '../../../../pipes/offsetMap.js';
import type { Maybe } from '../../../../shared/types.js';

const flagsV10 = {
  // byte 1
  0x1: 'unsellable (critical item)',
  0x2: 'two-handed',
  0x4: 'movable/droppable',
  0x8: 'displayable',
  0x10: 'cursed',
  0x20: 'cannot scribe to spellbook (scrolls)',
  0x40: 'magical',
  0x80: 'left-handed',

  // byte 2
  0x100: 'silver',
  0x200: 'cold iron',
  0x400: 'stolen (unsellable)/off-handed',
  0x800: 'conversable/unsellable',
  0x1000: 'fake two-handed (bgee)',
  0x2000: 'forbid off-hand weapon (bgee)',
  0x4000: 'usable in inventory (pstee)',
  0x8000: 'adamantine (bgee)',

  // byte 3
  // unused

  // byte 4
  0x1000000: 'undispellable',
  0x2000000: 'toggle critical hit aversion (bgee, tobex)',
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

const itemTypesV10 = {
  0x00: 'books/misc',
  0x01: 'amulets and necklaces',
  0x02: 'armor',
  0x03: 'belts and girdles',
  0x04: 'boots',
  0x05: 'arrows',
  0x06: 'bracers and gauntlets',
  0x07: 'headgear', // (helms, hats, and other head-wear)
  0x08: 'keys', // (not in icewind dale?)
  0x09: 'potions',
  0x0a: 'rings',
  0x0b: 'scrolls',
  0x0c: 'shields', // (not in iwd)
  0x0d: 'food',
  0x0e: 'bullets', // (for a sling)
  0x0f: 'bows',
  0x10: 'daggers',
  0x11: 'maces', // (in bg, this includes clubs)
  0x12: 'slings',
  0x13: 'small swords',
  0x14: 'large swords',
  0x15: 'hammers',
  0x16: 'morning stars',
  0x17: 'flails',
  0x18: 'darts',
  0x19: 'axes', // (specifically, 1-handed axes -- halberds and 2-handed polearms not included)
  0x1a: 'quarterstaff',
  0x1b: 'crossbow',
  0x1c: 'hand-to-hand weapons', // (fist, fist irons, punch daggers, etc)
  0x1d: 'spears',
  0x1e: 'halberds', // (2-handed polearms)
  0x1f: 'crossbow bolts',
  0x20: 'cloaks and robes',
  0x21: 'gold pieces', // (not an inventory item, but can appear as "monster dropped" treasure)
  0x22: 'gems',
  0x23: 'wands',
  0x24: 'containers/eye/broken armor',
  0x25: 'books/broken shields/bracelets',
  0x26: 'familiars/broken swords/earrings',
  0x27: 'tattoos', // (pst)
  0x28: 'lenses', // (pst)
  0x29: 'bucklers/teeth',
  0x2a: 'candles',
  // 0x2b: 'unknown',
  0x2c: 'clubs', // (iwd)
  // 0x2d: 'unknown',
  // 0x2e: 'unknown',
  0x2f: 'large shields', // (iwd)
  // 0x30: 'unknown',
  0x31: 'medium shields', // (iwd)
  0x32: 'notes',
  // 0x33: 'unknown',
  // 0x34: 'unknown',
  0x35: 'small shields', // (iwd)
  // 0x36: 'unknown',
  0x37: 'telescopes', // (iwd)
  0x38: 'drinks', // (iwd)
  0x39: 'great swords', // (iwd)
  0x3a: 'container',
  0x3b: 'fur/pelt',
  0x3c: 'leather armor',
  0x3d: 'studded leather armor',
  0x3e: 'chain mail',
  0x3f: 'splint mail',
  0x40: 'half plate',
  0x41: 'full plate',
  0x42: 'hide armor',
  0x43: 'robe',
  // 0x44: 'unknown',
  0x45: 'bastard sword',
  0x46: 'scarf',
  0x47: 'food', // (iwd2)
  0x48: 'hat',
  0x49: 'gauntlet',
} as const;
type ItemTypeV10 = typeof itemTypesV10[keyof typeof itemTypesV10];

const unusableByV10 = {
  // byte 1
  0x1: 'chaotic x',
  0x2: 'x evil',
  0x4: 'x good',
  0x8: 'x neutral',
  0x10: 'lawful x',
  0x20: 'neutral x',
  0x40: 'bard',
  0x80: 'cleric',

  // byte 2
  0x100: 'cleric/mage',
  0x200: 'cleric/thief',
  0x400: 'cleric/ranger',
  0x800: 'fighter',
  0x1000: 'fighter/druid',
  0x2000: 'fighter/mage',
  0x4000: 'fighter/cleric',
  0x8000: 'fighter/mage/cleric',

  // byte 3
  0x10000: 'fighter/mage/thief',
  0x20000: 'fighter/thief',
  0x40000: 'mage',
  0x80000: 'mage/thief',
  0x100000: 'paladin',
  0x200000: 'ranger',
  0x400000: 'thief',
  0x800000: 'elf',

  // byte 4
  0x1000000: 'dwarf',
  0x2000000: 'half-elf',
  0x4000000: 'halfling',
  0x8000000: 'human',
  0x10000000: 'gnome',
  0x20000000: 'monk',
  0x40000000: 'druid',
  0x80000000: 'half-orc',
} as const;
type UnusableByV10 = typeof unusableByV10[keyof typeof unusableByV10];

const itemAnimationBgIwdV10 = {
  0x2020: 'no animation',
  0x4132: 'leather armor',
  0x5732: 'robe',
  0x4133: 'chainmail',
  0x5733: 'robe (alternate 1)',
  0x4134: 'plate mail',
  0x5734: 'robe (alternate 2)',
  0x5841: 'axe',
  // 0x5342: 'n/a',
  0x5742: 'bow',
  // 0x3043: 'n/a',
  // 0x3143: 'n/a',
  // 0x3243: 'n/a',
  // 0x3343: 'n/a',
  // 0x3443: 'n/a',
  // 0x3543: 'n/a',
  // 0x3643: 'n/a',
  // 0x3743: 'n/a',
  0x4243: 'crossbow',
  0x4c43: 'club',
  0x3144: 'buckler',
  0x3244: 'shield (small)',
  0x3344: 'shield (medium)',
  0x3444: 'shield (large)',
  0x4444: 'dagger',
  // 0x3046: 'n/a',
  // 0x3146: 'n/a',
  // 0x3246: 'n/a',
  // 0x3446: 'n/a',
  0x4c46: 'flail',
  0x5346: 'flame sword',
  // 0x5347: 'n/a',
  0x3048: 'helmet: small vertical horns',
  0x3148: 'helmet: large horizontal horns',
  0x3248: 'helmet: feather wings',
  0x3348: 'helmet: top plume',
  0x3448: 'helmet: dragon wings',
  0x3548: 'helmet: feather sideburns',
  0x3648: 'helmet: large curved horns (incorrect paperdoll, unused)',
  // 0x304a: 'n/a',
  // 0x314a: 'n/a',
  // 0x324a: 'n/a',
  // 0x334a: 'n/a',
  // 0x344a: 'n/a',
  // 0x354a: 'n/a',
  // 0x364a: 'n/a',
  // 0x374a: 'n/a',
  // 0x384a: 'n/a',
  // 0x394a: 'n/a',
  // 0x414a: 'n/a',
  // 0x424a: 'n/a',
  // 0x434a: 'n/a',
  0x4248: 'halberd',
  // 0x324d: 'n/a',
  0x434d: 'mace',
  0x534d: 'morning star',
  // 0x3251: 'n/a',
  // 0x3351: 'n/a',
  // 0x3451: 'n/a',
  0x5351: 'quarterstaff',
  // 0x3053: 'n/a',
  0x3153: 'one-handed sword: bastard/broad/long/scimitar',
  0x3253: 'twp-handed sword',
  // 0x3353: 'n/a',
  // 0x4353: 'n/a',
  0x4c53: 'sling',
  0x5053: 'spear',
  0x5353: 'one-handed sword: short',
  0x4857: 'war hammer',
  // 0x575a: 'n/a',
} as const;
type ItemAnimationBgIwdV10 = typeof itemAnimationBgIwdV10[keyof typeof itemAnimationBgIwdV10];

const itemAnimationBg2V10 = {
  0x2020: 'no animation',
  0x4132: 'leather armor',
  0x5732: 'robe',
  0x4133: 'chainmail',
  0x5733: 'robe (alternate 1)',
  0x4134: 'plate mail',
  0x5734: 'robe (alternate 2)',
  0x5841: 'axe',
  // 0x5342: 'n/a',
  0x5742: 'bow',
  // 0x3043: 'n/a',
  // 0x3143: 'n/a',
  // 0x3243: 'n/a',
  // 0x3343: 'n/a',
  // 0x3443: 'n/a',
  // 0x3543: 'n/a',
  // 0x3643: 'n/a',
  // 0x3743: 'n/a',
  0x4243: 'crossbow',
  0x4c43: 'club',
  0x3144: 'buckler',
  0x3244: 'shield (small)',
  0x3344: 'shield (medium)',
  0x3444: 'shield (large)',
  0x4444: 'dagger',
  // 0x3046: 'n/a',
  // 0x3146: 'n/a',
  // 0x3246: 'n/a',
  // 0x3446: 'n/a',
  0x4c46: 'flail',
  0x5346: 'flame sword',
  // 0x5347: 'n/a',
  0x3048: 'helmet: full',
  0x3148: 'helmet: large horizontal horns, spiked crest',
  0x3248: 'helmet: narrow wings',
  0x3348: 'helmet: curved horns',
  0x3448: 'helmet: top plume',
  0x3548: 'helmet: single crest',
  0x3648: 'helmet: large curved horns (incorrect paperdoll, unused)',
  // 0x304a: 'n/a',
  // 0x314a: 'n/a',
  // 0x324a: 'n/a',
  // 0x334a: 'n/a',
  // 0x344a: 'n/a',
  // 0x354a: 'n/a',
  // 0x364a: 'n/a',
  // 0x374a: 'n/a',
  // 0x384a: 'n/a',
  // 0x394a: 'n/a',
  // 0x414a: 'n/a',
  // 0x424a: 'n/a',
  // 0x434a: 'n/a',
  0x4248: 'halberd',
  // 0x324d: 'n/a',
  0x434d: 'mace',
  0x534d: 'morning star',
  // 0x3251: 'n/a',
  // 0x3351: 'n/a',
  // 0x3451: 'n/a',
  0x5351: 'quarterstaff',
  // 0x3053: 'n/a',
  0x3153: 'one-handed sword: bastard/broad/long',
  0x3253: 'twp-handed sword',
  0x3353: 'one-handed sword: katana',
  0x4353: 'one-handed sword: scimitar',
  0x4c53: 'sling',
  0x5053: 'spear',
  0x5353: 'one-handed sword: short',
  0x4857: 'war hammer',
  // 0x575a: 'n/a',
} as const;
type ItemAnimationBg2V10 = typeof itemAnimationBg2V10[keyof typeof itemAnimationBg2V10];

const itemAnimationEeV10 = {
  0x2020: 'no animation',
  0x4132: 'leather armor',
  0x5732: 'robe',
  0x4133: 'chainmail',
  0x5733: 'robe (alternate 1)',
  0x4134: 'plate mail',
  0x5734: 'robe (alternate 2)',
  0x5841: 'axe',
  0x5342: 'shortbow',
  0x5742: 'longbow',
  0x3043: 'small shield (alternate 1)',
  0x3143: 'medium shield (alternate 1)',
  0x3243: 'large shield (alternate 1)',
  0x3343: 'medium shield (alternate 2)',
  0x3443: 'small shield (alternate 2)',
  0x3543: 'large shield (alternate 2)',
  0x3643: 'large shield (alternate 3)',
  0x3743: 'medium shield (alternate 3)',
  0x4243: 'crossbow',
  0x4c43: 'club',
  0x3144: 'buckler',
  0x3244: 'shield (small)',
  0x3344: 'shield (medium)',
  0x3444: 'shield (large)',
  0x4444: 'dagger',
  0x3046: 'flail (alternate 1)',
  0x3146: 'flail (alternate 2)',
  0x3246: 'flaming short sword',
  0x3446: 'flail (alternate 3)',
  0x4c46: 'flail',
  0x5346: 'flaming long sword',
  0x5347: 'glowing staff',
  0x3048: 'helmet: smooth',
  0x3148: 'helmet: five horns',
  0x3248: 'helmet: feather wings',
  0x3348: 'helmet: curved sidebars',
  0x3448: 'helmet: horned, plume',
  0x3548: 'helmet: center crest',
  0x3648: 'helmet: large curved horns (incorrect paperdoll, unused)',
  0x304a: 'helmet: smooth',
  0x314a: 'helmet: five horns',
  0x324a: 'helmet: feather wings with spike',
  0x334a: 'helmet: curved sidebars',
  0x344a: 'helmet: small horns, plume',
  0x354a: 'helmet: center crest',
  0x364a: 'helmet: smooth, two small horns',
  0x374a: 'helmet: large horizontal horns',
  0x384a: 'helmet: feather wings without spike',
  0x394a: 'helmet: full face, large horns, plume',
  0x414a: 'helmet: dragon wings, plume',
  0x424a: 'circlet',
  0x434a: 'helmet: dragon wings',
  0x4248: 'halberd',
  0x324d: 'mace (alternate)',
  0x434d: 'mace',
  0x534d: 'morning star',
  0x3251: 'quarterstaff (alternate 1)',
  0x3351: 'quarterstaff (alternate 2)',
  0x3451: 'quarterstaff (alternate 3)',
  0x5351: 'quarterstaff',
  0x3053: 'one-handed sword: bastard',
  0x3153: 'one-handed sword: broad/long',
  0x3253: 'twp-handed sword',
  0x3353: 'one-handed sword: katana',
  0x4353: 'one-handed sword: scimitar',
  0x4c53: 'sling',
  0x5053: 'spear',
  0x5353: 'one-handed sword: short',
  0x4857: 'war hammer',
  0x575a: 'wings (female)',
} as const;
type ItemAnimationEeV10 = typeof itemAnimationEeV10[keyof typeof itemAnimationEeV10];

const kitUsability1V10 = {
  0: 'cleric of talos',
  1: 'cleric of helm',
  2: 'cleric of lathlander',
  3: 'totemic druid',
  4: 'shapeshifter druid',
  5: 'avenger druid',
  6: 'barbarian',
  7: 'wildmage',
} as const;
type KitUsability1V10 = typeof kitUsability1V10[keyof typeof kitUsability1V10];

const kitUsability2V10 = {
  0: 'stalker ranger',
  1: 'beastmaster ranger',
  2: 'assassin thief',
  3: 'bounty hunter thief',
  4: 'swashbuckler thief',
  5: 'blade bard',
  6: 'jester bard',
  7: 'skald bard',
} as const;
type KitUsability2V10 = typeof kitUsability2V10[keyof typeof kitUsability2V10];

const kitUsability3V10 = {
  0: 'diviner',
  1: 'enchanter',
  2: 'illusionist',
  3: 'invoker',
  4: 'necromancer',
  5: 'transmuter',
  6: 'all (no kit)',
  7: 'ferlain',
} as const;
type KitUsability3V10 = typeof kitUsability3V10[keyof typeof kitUsability3V10];

const kitUsability4V10 = {
  0: 'beserker fighter',
  1: 'wizardslayer fighter',
  2: 'kensai fighter',
  3: 'cavalier paladin',
  4: 'inquisiter paladin',
  5: 'undead hunter paladin',
  6: 'abjurer',
  7: 'conjurer',
} as const;
type KitUsability4V10 = typeof kitUsability4V10[keyof typeof kitUsability4V10];

const weaponProficiencyV10 = {
  0x00: 'none',
  0x59: 'bastard sword',
  0x5a: 'long sword',
  0x5b: 'short sword',
  0x5c: 'axe',
  0x5d: 'two-handed sword',
  0x5e: 'katana',
  0x5f: 'scimitar/wakizashi/ninja-to',
  0x60: 'dagger',
  0x61: 'war hammer',
  0x62: 'spear',
  0x63: 'halberd',
  0x64: 'flail/morningstar',
  0x65: 'mace',
  0x66: 'quarterstaff',
  0x67: 'crossbow',
  0x68: 'long bow',
  0x69: 'short bow',
  0x6a: 'darts',
  0x6b: 'sling',
  0x6c: 'blackjack',
  0x6d: 'gun',
  0x6e: 'martial arts',
  0x6f: 'two-handed weapon skill',
  0x70: 'sword and shield skill',
  0x71: 'single weapon skill',
  0x72: 'two weapon skill',
  0x73: 'club',
  0x74: 'extra proficiency 2',
  0x75: 'extra proficiency 3',
  0x76: 'extra proficiency 4',
  0x77: 'extra proficiency 5',
  0x78: 'extra proficiency 6',
  0x79: 'extra proficiency 7',
  0x7a: 'extra proficiency 8',
  0x7b: 'extra proficiency 9',
  0x7c: 'extra proficiency 10',
  0x7d: 'extra proficiency 11',
  0x7e: 'extra proficiency 12',
  0x7f: 'extra proficiency 13',
  0x80: 'extra proficiency 14',
  0x81: 'extra proficiency 15',
  0x82: 'extra proficiency 16',
  0x83: 'extra proficiency 17',
  0x84: 'extra proficiency 18',
  0x85: 'extra proficiency 19',
  0x86: 'extra proficiency 20',
} as const;
type WeaponProficiencyV10 = typeof weaponProficiencyV10[keyof typeof weaponProficiencyV10];

export const offsetMap = {
  flags: extend(flagsV10),
  itemTypes: extend(itemTypesV10),
  unusableBy: extend(unusableByV10),
  itemAnimationBgIwd: extend(itemAnimationBgIwdV10),
  itemAnimationBg2: extend(itemAnimationBg2V10),
  itemAnimationEe: extend(itemAnimationEeV10),
  kitUsability1: extend(kitUsability1V10),
  kitUsability2: extend(kitUsability2V10),
  kitUsability3: extend(kitUsability3V10),
  kitUsability4: extend(kitUsability4V10),
  weaponProficiency: extend(weaponProficiencyV10),
};

export type ItemHeaderV10 = Readonly<{
  signature: string;
  version: string;
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  replacementItem: Maybe<string>;
  dropSound: Maybe<string>;
  flags: FlagsV10[];
  itemType: ItemTypeV10;
  unusableBy: UnusableByV10[];
  itemAnimation: ItemAnimationBgIwdV10 | ItemAnimationBg2V10 | ItemAnimationEeV10;
  minLevel: number;
  minStrength: number;
  minStrengthBonus: number;
  kitUsability1: KitUsability1V10[];
  minIntelligence: number;
  kitUsability2: KitUsability2V10[];
  minDexterity: number;
  kitUsability3: KitUsability3V10[];
  minWisdom: number;
  kitUsability4: KitUsability4V10[];
  minConstitution: number;
  weaponProficiency: WeaponProficiencyV10;
  minCharisma: number;
  price: number;
  stackAmount: number;
  inventoryIcon: string;
  loreToId: number;
  groundIcon: string;
  weight: number;
  unidentifiedDescriptionRef: number;
  identifiedDescriptionRef: number;
  descriptionIcon: string;
  enchantment: number;
  offsetToExtendedHeaders: number;
  countOfExtendedHeaders: number;
  offsetToFeatureBlocks: number;
  indexIntoEquippingFeatureBlocks: number;
  countOfEquippingFeatureBlocks: number;
}>;
