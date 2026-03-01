import { extend } from '../../../../pipes/offsetMap.js';
import type { Maybe } from '../../../../shared/types.js';

const flagsV11 = {
// byte 1
  0x1: 'unsellable (critical item)',
  0x2: 'two-handed',
  0x4: 'movable',
  0x8: 'displayable',
  0x10: 'cursed',
  0x20: 'cannot scribe to spellbook (scrolls)',
  0x40: 'magical',
  // 0x80: unused

  // byte 2
  0x100: 'silver',
  0x200: 'cold-iron',
  0x400: 'steel',
  0x800: 'conversable',
  0x1000: 'pulsating',
} as const;
type FlagsV11 = typeof flagsV11[keyof typeof flagsV11];

const itemTypeV11 = {
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
  0x14: 'large swords', // (in bg, this includes 2-handed and bastard swords)
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
  0x25: 'broken shields/bracelets',
  0x26: 'broken swords/earrings',
  0x27: 'tattoos', // (pst)
  0x28: 'lenses', // (pst)
  0x29: 'bucklers/teeth',
  0x2a: 'candles',
  0x2b: 'unknown',
  0x2c: 'clubs', // (iwd)
  0x2d: 'unknown',
  0x2e: 'unknown',
  0x2f: 'large shields', // (iwd)
  0x30: 'unknown',
  0x31: 'medium shields', // (iwd)
  0x32: 'notes',
  0x33: 'unknown',
  0x34: 'unknown',
  0x35: 'small shields', // (iwd)
  0x36: 'unknown',
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
  0x44: 'unknown',
  0x45: 'bastard sword',
  0x46: 'scarf',
  0x47: 'food', // (iwd2)
  0x48: 'hat',
  0x49: 'gauntlet',

  0x4a: 'eyeballs', // pstee eyeglas1.itm
  0x4b: 'earrings', // pstee anear1.itm
  0x4c: 'teeth [weapon 0 slot]', // pstee fdteeth.itm
  0x4d: 'bracelets', // pstee bell.itm
} as const;
type ItemTypeV11 = typeof itemTypeV11[keyof typeof itemTypeV11];

const unusableByV11 = {
  // byte 1
  0x1: 'unusable by chaotic',
  0x2: 'unusable by evil',
  0x4: 'unusable by good',
  0x8: 'unusable by good-evil neutral',
  0x10: 'unusable by lawful',
  0x20: 'unusable by lawful-chaotic neutral',
  0x40: 'unusable by sensates',
  0x80: 'unusable by priest',

  // byte 2
  0x100: 'unusable by godsmen',
  0x200: 'unusable by anarchist',
  0x400: 'unusable by chaosmen',
  0x800: 'unusable by fighter',
  0x1000: 'no faction',
  0x2000: 'unusable by fighter mage',
  0x4000: 'unusable by dustmen',
  0x8000: 'unusable by mercykillers',

  // byte 3
  0x10000: 'unusable by indeps',
  0x20000: 'unusable by fighter thief',
  0x40000: 'unusable by mage',
  0x80000: 'unusable by mage thief',
  0x100000: 'unusable by dak\'kon',
  0x200000: 'unusable by fall-from-grace',
  0x400000: 'unusable by thief',
  0x800000: 'unusable by vhailor',

  // byte 4
  0x1000000: 'unusable by ignus',
  0x2000000: 'unusable by morte',
  0x4000000: 'unusable by nordom',
  //   0x8000000: 'unknown',
  0x10000000: 'unusable by annah',
  //   0x20000000: 'unknown',
  0x40000000: 'unusable by nameless one',
//   0x80000000: 'unknown',
} as const;
type UnusableByV11 = typeof unusableByV11[keyof typeof unusableByV11];

const weaponAnimationV11 = {
  0x3153: 'long sword',
  0x5841: 'axe',
  0x4c43: 'club',
  0x4444: 'dagger',
  0x4857: 'warhammer',
  0x2020: 'fist',

  0x4243: 'crossbow', // pstee nordxbow.itm
} as const;
type WeaponAnimationV11 = typeof weaponAnimationV11[keyof typeof weaponAnimationV11];

export const offsetMap = {
  flags: extend(flagsV11),
  itemType: extend(itemTypeV11),
  unusableBy: extend(unusableByV11),
  weaponAnimation: extend(weaponAnimationV11),
};

export type ItemHeaderV11 = Readonly<{
  signature: string;
  version: string;
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  dropSound: Maybe<string>;
  flags: FlagsV11[];
  itemType: ItemTypeV11;
  unusableBy: UnusableByV11[];
  weaponAnimation: WeaponAnimationV11;
  minLevel: number;
  price: number;
  stackAmount: number;
  inventoryIcon: string;
  loreToId: number;
  groundIcon: string;
  weight: number;
  unidentifiedDescriptionRef: number;
  identifiedDescriptionRef: number;
  pickupSound: string;
  enchantment: number;
  offsetToExtendedHeaders: number;
  countOfExtendedHeaders: number;
  offsetToFeatureBlocks: number;
  indexIntoEquippingFeatureBlocks: number;
  countOfEquippingFeatureBlocks: number;
  dialog: string;
  conversableLabelRef: number;
  paperdollAnimationColour: number;
}>;
