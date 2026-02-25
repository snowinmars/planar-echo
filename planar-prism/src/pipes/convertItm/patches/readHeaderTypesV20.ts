import { extend } from '../../../pipes/offsetMap.js';

const flagsV20 = {
// byte 1
  0x1: 'unsellable (critical item, kept on ground)',
  0x2: 'two-handed',
  0x4: 'movable',
  0x8: 'displayable',
  0x10: 'cursed',
  // 0x20: unused,
  0x40: 'magical',
  0x80: 'bow',

  // byte 2
  0x100: 'silver',
  0x200: 'cold-iron',
  0x400: 'stolen (unsellable)',
  0x800: 'cannot place in carryable container',
  0x1000: 'pulsating',
} as const;
type FlagsV20 = typeof flagsV20[keyof typeof flagsV20];

const itemTypesV20 = {
  0x00: 'books/misc',
  0x01: 'amulets and necklaces',
  0x02: 'armor',
  0x03: 'belts and girdles',
  0x04: 'boots',
  0x05: 'arrows',
  0x06: 'bracers and gauntlets',
  0x07: 'helms, hats, and other head-wear',
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
  0x24: 'containers',
  0x25: 'books',
  0x26: 'familiars',
  0x27: 'tattoos', // (pst)
  0x28: 'lenses', // (pst)
  0x29: 'bucklers/teeth',
  0x2a: 'candles',
  0x2b: 'child body',
  0x2c: 'clubs',
  0x2d: 'female body',
  0x2e: 'key',
  0x2f: 'large shields',
  0x30: 'male body',
  0x31: 'medium shields',
  0x32: 'notes',
  0x33: 'rods',
  0x34: 'skulls',
  0x35: 'small shields',
  0x36: 'spider body',
  0x37: 'telescopes',
  0x38: 'drinks',
  0x39: 'great swords',
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
  0x44: 'scale mail',
  0x45: 'bastard sword',
  0x46: 'scarf',
  0x47: 'food',
  0x48: 'hat',
  0x49: 'gauntlet',
} as const;
type ItemTypesV20 = typeof itemTypesV20[keyof typeof itemTypesV20];

const unusableByV20 = {
  // byte 1
  0x1: 'barbarian',
  0x2: 'bard',
  0x4: 'cleric',
  0x8: 'druid',
  0x10: 'fighter',
  0x20: 'monk',
  0x40: 'paladin',
  0x80: 'ranger',

  // byte 2
  0x100: 'rogue',
  0x200: 'sorcerer',
  0x400: 'wizard',
  0x800: 'unknown',
  0x1000: 'chaotic',
  0x2000: 'evil',
  0x4000: 'good',
  0x8000: 'x neutral',

  // byte 3
  0x10000: 'lawful',
  0x20000: 'neutral',
  // 0x40000: unknown,
  // 0x80000: unknown,
  // 0x100000: unknown,
  // 0x200000: unknown,
  // 0x400000: unknown,
  0x800000: 'elf',

  // byte 4
  0x1000000: 'dwarf',
  0x2000000: 'half-elf',
  0x4000000: 'halfling',
  0x8000000: 'human',
  0x10000000: 'gnome',
  0x20000000: 'half-orc',
} as const;
type UnusableByV20 = typeof unusableByV20[keyof typeof unusableByV20];

const kitUsability2V20 = {
  0: 'cleric of lathander',
  1: 'cleric of selune',
  2: 'cleric of helm',
  3: 'cleric of oghma',
  4: 'cleric of tempus',
  5: 'cleric of bane',
  6: 'cleric of mask',
  7: 'cleric of talos',
} as const;
type KitUsability2V20 = typeof kitUsability2V20[keyof typeof kitUsability2V20];

const kitUsability3V20 = {
  0: 'diviner',
  1: 'enchanter',
  2: 'illusionist',
  3: 'evoker',
  4: 'necromancer',
  5: 'transmuter',
  6: 'generalist mage',
  7: 'cleric of ilmater',
} as const;
type KitUsability3V20 = typeof kitUsability3V20[keyof typeof kitUsability3V20];

const kitUsability4V20 = {
  0: 'paladin of ilmater',
  1: 'paladin of helm',
  2: 'paladin of mystra',
  3: 'monk of the old order',
  4: 'monk of the broken ones',
  5: 'monk of the dark moon',
  6: 'abjurer',
  7: 'conjurer',
} as const;
type KitUsability4V20 = typeof kitUsability4V20[keyof typeof kitUsability4V20];

// weaponProficiency exists, but the docs does not specificate it
// const weaponProficiencyV20 = {
//   0x00: 'none',
//   0x59: 'bastard sword',
//   0x5a: 'long sword',
//   0x5b: 'short sword',
//   0x5c: 'axe',
//   0x5d: 'two-handed sword',
//   0x5e: 'katana',
//   0x5f: 'scimitar/wakizashi/ninja-to',
//   0x60: 'dagger',
//   0x61: 'war hammer',
//   0x62: 'spear',
//   0x63: 'halberd',
//   0x64: 'flail/morningstar',
//   0x65: 'mace',
//   0x66: 'quarterstaff',
//   0x67: 'crossbow',
//   0x68: 'long bow',
//   0x69: 'short bow',
//   0x6a: 'darts',
//   0x6b: 'sling',
//   0x6c: 'blackjack',
//   0x6d: 'gun',
//   0x6e: 'martial arts',
//   0x6f: 'two-handed weapon skill',
//   0x70: 'sword and shield skill',
//   0x71: 'single weapon skill',
//   0x72: 'two weapon skill',
//   0x73: 'club',
//   0x74: 'extra proficiency 2',
//   0x75: 'extra proficiency 3',
//   0x76: 'extra proficiency 4',
//   0x77: 'extra proficiency 5',
//   0x78: 'extra proficiency 6',
//   0x79: 'extra proficiency 7',
//   0x7a: 'extra proficiency 8',
//   0x7b: 'extra proficiency 9',
//   0x7c: 'extra proficiency 10',
//   0x7d: 'extra proficiency 11',
//   0x7e: 'extra proficiency 12',
//   0x7f: 'extra proficiency 13',
//   0x80: 'extra proficiency 14',
//   0x81: 'extra proficiency 15',
//   0x82: 'extra proficiency 16',
//   0x83: 'extra proficiency 17',
//   0x84: 'extra proficiency 18',
//   0x85: 'extra proficiency 19',
//   0x86: 'extra proficiency 20',
// } as const;
// type WeaponProficiencyV20 = typeof weaponProficiencyV20[keyof typeof weaponProficiencyV20];

export const offsetMap = {
  flags: extend(flagsV20),
  itemTypes: extend(itemTypesV20),
  unusableBy: extend(unusableByV20),
  kitUsability2: extend(kitUsability2V20),
  kitUsability3: extend(kitUsability3V20),
  kitUsability4: extend(kitUsability4V20),
  // weaponProficiency: extend(weaponProficiencyV20),
};

export type ItemHeaderV20 = Readonly<{
  signature: string;
  version: string;
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  replacementItem: string;
  flags: FlagsV20[];
  itemType: ItemTypesV20;
  unusableBy: UnusableByV20[];
  weaponAnimation: number;
  minLevel: number;
  minStrength: number;
  minStrengthBonus: number;
  minIntelligence: number;
  kitUsability2: KitUsability2V20[];
  minDexterity: number;
  kitUsability3: KitUsability3V20[];
  minWisdom: number;
  kitUsability4: KitUsability4V20[];
  minConstitution: number;
  weaponProficiency: number; // WeaponProficiencyV20
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
