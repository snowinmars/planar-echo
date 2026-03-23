import { extend } from '@/pipes/offsetMap.js';
import type { Maybe } from '@planar/shared';

/* createGenerator().register().flags("flagsV11", {
 *   byte1: ['unsellable (critical item)','two-handed','movable','displayable','cursed','cannot scribe to spellbook (scrolls)','magical',],
 *   byte2: ['silver','cold-iron','steel','conversable','pulsating',]
 * }).write();
 */
const flagsV11 = {
  // byte1
  0x1: 'unsellable (critical item)',
  0x2: 'two-handed',
  0x4: 'movable',
  0x8: 'displayable',
  0x10: 'cursed',
  0x20: 'cannot scribe to spellbook (scrolls)',
  0x40: 'magical',
  // 0x80: unused

  // byte2
  0x100: 'silver',
  0x200: 'cold-iron',
  0x400: 'steel',
  0x800: 'conversable',
  0x1000: 'pulsating',
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type FlagsV11 = typeof flagsV11[keyof typeof flagsV11];

/* createGenerator().register().enum("itemTypeV11",
 *   ['books/misc','amulets and necklaces','armor','belts and girdles','boots','arrows','bracers and gauntlets','helms, hats, and other head-wear','keys// (not in icewind dale?)','potions','rings','scrolls','shields// (not in iwd)','food','bullets// (for a sling)','bows','daggers','maces// (in bg, this includes clubs)','slings','small swords','large swords// (in bg, this includes 2-handed and bastard swords)','hammers','morning stars','flails','darts','axes// (specifically, 1-handed axes -- halberds and 2-handed polearms not included)','quarterstaff','crossbow','hand-to-hand weapons// (fist, fist irons, punch daggers, etc)','spears','halberds// (2-handed polearms)','crossbow bolts','cloaks and robes','gold pieces// (not an inventory item, but can appear as "monster dropped" treasure)','gems','wands','containers/eye/broken armor','broken shields/bracelets','broken swords/earrings','tattoos// (pst)','lenses// (pst)','bucklers/teeth','candles','unknown','clubs// (iwd)','unknown','unknown','large shields// (iwd)','unknown','medium shields// (iwd)','notes','unknown','unknown','small shields// (iwd)','unknown','telescopes// (iwd)','drinks// (iwd)','great swords// (iwd)','container','fur/pelt','leather armor','studded leather armor','chain mail','splint mail','half plate','full plate','hide armor','robe','unknown','bastard sword','scarf','food// (iwd2)','hat','gauntlet','eyeballs','earrings','teeth [weapon 0 slot]','bracelets']
 * ).write();
 */
const itemTypeV11 = {
  0: 'books/misc',
  1: 'amulets and necklaces',
  2: 'armor',
  3: 'belts and girdles',
  4: 'boots',
  5: 'arrows',
  6: 'bracers and gauntlets',
  7: 'helms, hats, and other head-wear',
  8: 'keys', // (not in icewind dale?)
  9: 'potions',
  10: 'rings',
  11: 'scrolls',
  12: 'shields', // (not in iwd)
  13: 'food',
  14: 'bullets', // (for a sling)
  15: 'bows',
  16: 'daggers',
  17: 'maces', // (in bg, this includes clubs)
  18: 'slings',
  19: 'small swords',
  20: 'large swords', // (in bg, this includes 2-handed and bastard swords)
  21: 'hammers',
  22: 'morning stars',
  23: 'flails',
  24: 'darts',
  25: 'axes', // (specifically, 1-handed axes -- halberds and 2-handed polearms not included)
  26: 'quarterstaff',
  27: 'crossbow',
  28: 'hand-to-hand weapons', // (fist, fist irons, punch daggers, etc)
  29: 'spears',
  30: 'halberds', // (2-handed polearms)
  31: 'crossbow bolts',
  32: 'cloaks and robes',
  33: 'gold pieces', // (not an inventory item, but can appear as "monster dropped" treasure)
  34: 'gems',
  35: 'wands',
  36: 'containers/eye/broken armor',
  37: 'broken shields/bracelets',
  38: 'broken swords/earrings',
  39: 'tattoos', // (pst)
  40: 'lenses', // (pst)
  41: 'bucklers/teeth',
  42: 'candles',
  43: 'unknown',
  44: 'clubs', // (iwd)
  45: 'unknown',
  46: 'unknown',
  47: 'large shields', // (iwd)
  48: 'unknown',
  49: 'medium shields', // (iwd)
  50: 'notes',
  51: 'unknown',
  52: 'unknown',
  53: 'small shields', // (iwd)
  54: 'unknown',
  55: 'telescopes', // (iwd)
  56: 'drinks', // (iwd)
  57: 'great swords', // (iwd)
  58: 'container',
  59: 'fur/pelt',
  60: 'leather armor',
  61: 'studded leather armor',
  62: 'chain mail',
  63: 'splint mail',
  64: 'half plate',
  65: 'full plate',
  66: 'hide armor',
  67: 'robe',
  68: 'unknown',
  69: 'bastard sword',
  70: 'scarf',
  71: 'food', // (iwd2)
  72: 'hat',
  73: 'gauntlet',
  74: 'eyeballs',
  75: 'earrings',
  76: 'teeth [weapon 0 slot]',
  77: 'bracelets',
} as const;
type ItemTypeV11 = typeof itemTypeV11[keyof typeof itemTypeV11];

/* createGenerator().register().flags("unusableByV11", {
 *   byte1: ['unusable by chaotic','unusable by evil','unusable by good','unusable by good-evil neutral','unusable by lawful','unusable by lawful-chaotic neutral','unusable by sensates','unusable by priest',],
 *   byte2: ['unusable by godsmen','unusable by anarchist','unusable by chaosmen','unusable by fighter','no faction','unusable by fighter mage','unusable by dustmen','unusable by mercykillers',],
 *   byte3: ['unusable by indeps','unusable by fighter thief','unusable by mage','unusable by mage thief','unusable by dak\'kon','unusable by fall-from-grace','unusable by thief','unusable by vhailor',],
 *   byte4: ['unusable by ignus','unusable by morte','unusable by nordom',null,'unusable by annah',null,'unusable by nameless one',],
 * }).write();
 */
const unusableByV11 = {
  // byte1
  0x1: 'unusable by chaotic',
  0x2: 'unusable by evil',
  0x4: 'unusable by good',
  0x8: 'unusable by good-evil neutral',
  0x10: 'unusable by lawful',
  0x20: 'unusable by lawful-chaotic neutral',
  0x40: 'unusable by sensates',
  0x80: 'unusable by priest',

  // byte2
  0x100: 'unusable by godsmen',
  0x200: 'unusable by anarchist',
  0x400: 'unusable by chaosmen',
  0x800: 'unusable by fighter',
  0x1000: 'no faction',
  0x2000: 'unusable by fighter mage',
  0x4000: 'unusable by dustmen',
  0x8000: 'unusable by mercykillers',

  // byte3
  0x10000: 'unusable by indeps',
  0x20000: 'unusable by fighter thief',
  0x40000: 'unusable by mage',
  0x80000: 'unusable by mage thief',
  0x100000: 'unusable by dak\'kon',
  0x200000: 'unusable by fall-from-grace',
  0x400000: 'unusable by thief',
  0x800000: 'unusable by vhailor',

  // byte4
  0x1000000: 'unusable by ignus',
  0x2000000: 'unusable by morte',
  0x4000000: 'unusable by nordom',
  // 0x8000000: unused
  0x10000000: 'unusable by annah',
  // 0x20000000: unused
  0x40000000: 'unusable by nameless one',
  // 0x80000000: unused
} as const;
type UnusableByV11 = typeof unusableByV11[keyof typeof unusableByV11];

/* createGenerator().register().enum("weaponAnimationV11", {
 *   0x3153: ['long sword'],
 *   0x5841: ['axe'],
 *   0x4c43: ['club'],
 *   0x4444: ['dagger'],
 *   0x4857: ['warhammer'],
 *   0x2020: ['fist'],
 *   0x4243: ['crossbow'],
 * }).write();
 */
const weaponAnimationV11 = {
  8224: 'fist',
  12627: 'long sword',
  16963: 'crossbow',
  17476: 'dagger',
  18519: 'warhammer',
  19523: 'club',
  22593: 'axe',
} as const;
type WeaponAnimationV11 = typeof weaponAnimationV11[keyof typeof weaponAnimationV11];

export const offsetMap = {
  flags: extend(flagsV11),
  itemType: extend(itemTypeV11),
  unusableBy: extend(unusableByV11),
  weaponAnimation: extend(weaponAnimationV11),
};

export type HeaderV11 = Readonly<{
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
