import { extend } from '@/shared/extendedMap.js';
import type { Maybe } from '@planar/shared';

/* createGenerator().register().flags("flagsV10", {
 *   byte1: ['unsellable (critical item)','two-handed','movable','displayable','cursed','cannot scribe to spellbook (scrolls)','magical',],
 *   byte2: ['silver','cold-iron','steel','conversable','pulsating',]
 * }).write();
 */
const flagsV10 = {
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
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

/* createGenerator().register().enum("categoryV10",
 *   ['books/misc','amulets and necklaces','armor','belts and girdles','boots','arrows','bracers and gauntlets','helms, hats, and other head-wear','keys// (not in icewind dale?)','potions','rings','scrolls','shields// (not in iwd)','food','bullets// (for a sling)','bows','daggers','maces// (in bg, this includes clubs)','slings','small swords','large swords// (in bg, this includes 2-handed and bastard swords)','hammers','morning stars','flails','darts','axes// (specifically, 1-handed axes -- halberds and 2-handed polearms not included)','quarterstaff','crossbow','hand-to-hand weapons// (fist, fist irons, punch daggers, etc)','spears','halberds// (2-handed polearms)','crossbow bolts','cloaks and robes','gold pieces// (not an inventory item, but can appear as "monster dropped" treasure)','gems','wands','containers/eye/broken armor','broken shields/bracelets','broken swords/earrings','tattoos// (pst)','lenses// (pst)','bucklers/teeth','candles','unknown','clubs// (iwd)','unknown','unknown','large shields// (iwd)','unknown','medium shields// (iwd)','notes','unknown','unknown','small shields// (iwd)','unknown','telescopes// (iwd)','drinks// (iwd)','great swords// (iwd)','container','fur/pelt','leather armor','studded leather armor','chain mail','splint mail','half plate','full plate','hide armor','robe','unknown','bastard sword','scarf','food// (iwd2)','hat','gauntlet','eyeballs','earrings','teeth [weapon 0 slot]','bracelets']
 * ).write();
 */
const categoryV10 = {
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
type CategoryV10 = typeof categoryV10[keyof typeof categoryV10];

/* createGenerator().register().flags("unusableByV10", {
 *   byte1: ['unusable by chaotic','unusable by evil','unusable by good','unusable by good-evil neutral','unusable by lawful','unusable by lawful-chaotic neutral','unusable by sensates','unusable by priest',],
 *   byte2: ['unusable by godsmen','unusable by anarchist','unusable by chaosmen','unusable by fighter','no faction','unusable by fighter mage','unusable by dustmen','unusable by mercykillers',],
 *   byte3: ['unusable by indeps','unusable by fighter thief','unusable by mage','unusable by mage thief','unusable by dak\'kon','unusable by fall-from-grace','unusable by thief','unusable by vhailor',],
 *   byte4: ['unusable by ignus','unusable by morte','unusable by nordom',null,'unusable by annah',null,'unusable by nameless one',],
 * }).write();
 */
const unusableByV10 = {
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
type UnusableByV10 = typeof unusableByV10[keyof typeof unusableByV10];

/* createGenerator().register().enum("weaponAnimationV10", {
 *   0x3153: ['long sword'],
 *   0x5841: ['axe'],
 *   0x4c43: ['club'],
 *   0x4444: ['dagger'],
 *   0x4857: ['warhammer'],
 *   0x2020: ['fist'],
 *   0x4243: ['crossbow'],
 * }).write();
 */
const equippedAppearanceV10 = {
  8224: 'fist',
  12627: 'long sword',
  16963: 'crossbow',
  17476: 'dagger',
  18519: 'warhammer',
  19523: 'club',
  22593: 'axe',
} as const;
type EquippedAppearanceV10 = typeof equippedAppearanceV10[keyof typeof equippedAppearanceV10];

/* createGenerator().register().flags('kitUsability1V10', {
 *   byte1: ['cleric of talos','cleric of helm','cleric of lathlander','totemic druid','shapeshifter druid','avenger druid','barbarian','wildmage',]
 * }).write();
 */
const kitUsability1V10 = {
  // byte1
  0x1: 'cleric of talos',
  0x2: 'cleric of helm',
  0x4: 'cleric of lathlander',
  0x8: 'totemic druid',
  0x10: 'shapeshifter druid',
  0x20: 'avenger druid',
  0x40: 'barbarian',
  0x80: 'wildmage',
} as const;
type KitUsability1V10 = typeof kitUsability1V10[keyof typeof kitUsability1V10];

/* createGenerator().register().flags('kitUsability2V10', {
 *   byte1: ['stalker ranger','beastmaster ranger','assassin thief','bounty hunter thief','swashbuckler thief','blade bard','jester bard','skald bard',]
 * }).write();
 */
const kitUsability2V10 = {
  // byte1
  0x1: 'stalker ranger',
  0x2: 'beastmaster ranger',
  0x4: 'assassin thief',
  0x8: 'bounty hunter thief',
  0x10: 'swashbuckler thief',
  0x20: 'blade bard',
  0x40: 'jester bard',
  0x80: 'skald bard',
} as const;
type KitUsability2V10 = typeof kitUsability2V10[keyof typeof kitUsability2V10];

/* createGenerator().register().flags('kitUsability3V10', {
 *   byte1: ['diviner','enchanter','illusionist','invoker','necromancer','transmuter','all (no kit)','ferlain',]
 * }).write();
 */
const kitUsability3V10 = {
  // byte1
  0x1: 'diviner',
  0x2: 'enchanter',
  0x4: 'illusionist',
  0x8: 'invoker',
  0x10: 'necromancer',
  0x20: 'transmuter',
  0x40: 'all (no kit)',
  0x80: 'ferlain',
} as const;
type KitUsability3V10 = typeof kitUsability3V10[keyof typeof kitUsability3V10];

/* createGenerator().register().flags('kitUsability4V10', {
 *   byte1: ['beserker fighter','wizardslayer fighter','kensai fighter','cavalier paladin','inquisiter paladin','undead hunter paladin','abjurer','conjurer',]
 * }).write();
 */
const kitUsability4V10 = {
  // byte1
  0x1: 'beserker fighter',
  0x2: 'wizardslayer fighter',
  0x4: 'kensai fighter',
  0x8: 'cavalier paladin',
  0x10: 'inquisiter paladin',
  0x20: 'undead hunter paladin',
  0x40: 'abjurer',
  0x80: 'conjurer',
} as const;
type KitUsability4V10 = typeof kitUsability4V10[keyof typeof kitUsability4V10];

/* createGenerator().register().enum('weaponProficiencyV10', {
 *   0: ['none'],
 *   89: ['bastard sword','long sword','short sword','axe','two-handed sword','katana','scimitar/wakizashi/ninja-to','dagger','war hammer','spear','halberd','flail/morningstar','mace','quarterstaff','crossbow','long bow','short bow','darts','sling','blackjack','gun','martial arts','two-handed weapon skill','sword and shield skill','single weapon skill','two weapon skill','club','extra proficiency 2','extra proficiency 3','extra proficiency 4','extra proficiency 5','extra proficiency 6','extra proficiency 7','extra proficiency 8','extra proficiency 9','extra proficiency 10','extra proficiency 11','extra proficiency 12','extra proficiency 13','extra proficiency 14','extra proficiency 15','extra proficiency 16','extra proficiency 17','extra proficiency 18','extra proficiency 19','extra proficiency 20',],
 * }).write();
 */
const weaponProficiencyV10 = {
  0: 'none',
  89: 'bastard sword',
  90: 'long sword',
  91: 'short sword',
  92: 'axe',
  93: 'two-handed sword',
  94: 'katana',
  95: 'scimitar/wakizashi/ninja-to',
  96: 'dagger',
  97: 'war hammer',
  98: 'spear',
  99: 'halberd',
  100: 'flail/morningstar',
  101: 'mace',
  102: 'quarterstaff',
  103: 'crossbow',
  104: 'long bow',
  105: 'short bow',
  106: 'darts',
  107: 'sling',
  108: 'blackjack',
  109: 'gun',
  110: 'martial arts',
  111: 'two-handed weapon skill',
  112: 'sword and shield skill',
  113: 'single weapon skill',
  114: 'two weapon skill',
  115: 'club',
  116: 'extra proficiency 2',
  117: 'extra proficiency 3',
  118: 'extra proficiency 4',
  119: 'extra proficiency 5',
  120: 'extra proficiency 6',
  121: 'extra proficiency 7',
  122: 'extra proficiency 8',
  123: 'extra proficiency 9',
  124: 'extra proficiency 10',
  125: 'extra proficiency 11',
  126: 'extra proficiency 12',
  127: 'extra proficiency 13',
  128: 'extra proficiency 14',
  129: 'extra proficiency 15',
  130: 'extra proficiency 16',
  131: 'extra proficiency 17',
  132: 'extra proficiency 18',
  133: 'extra proficiency 19',
  134: 'extra proficiency 20',
} as const;
type WeaponProficiencyV10 = typeof weaponProficiencyV10[keyof typeof weaponProficiencyV10];

export const extendMap = {
  flags: extend(flagsV10),
  category: extend(categoryV10),
  unusableBy: extend(unusableByV10),
  equippedAppearance: extend(equippedAppearanceV10),
  kitUsability1: extend(kitUsability1V10),
  kitUsability2: extend(kitUsability2V10),
  kitUsability3: extend(kitUsability3V10),
  kitUsability4: extend(kitUsability4V10),
  weaponProficiency: extend(weaponProficiencyV10),
};

export type HeaderV10 = Readonly<{
  signature: 'itm';
  version: 'v10';
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  dropSound: Maybe<string>;
  flags: FlagsV10[];
  category: CategoryV10;
  unusableBy: UnusableByV10[];
  equippedAppearance: EquippedAppearanceV10;
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
  maxInStack: number;
  inventoryIcon: string;
  loreToId: number;
  groundIcon: string;
  weight: number;
  unidentifiedDescriptionRef: number;
  identifiedDescriptionRef: number;
  pickupSound: string;
  enchantment: number;
  offsetToAbilities: number; // offsetToExtendedHeaders
  countOfAbilities: number; // countOfExtendedHeaders
  offsetToEffects: number; // offsetToFeatureBlocks
  firstEffectIndex: number; // indexIntoEquippingFeatureBlocks
  countOfGlobalEffects: number; // countOfEquippingFeatureBlocks
}>;
