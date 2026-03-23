import { extend } from '@/pipes/offsetMap.js';

/* createGenerator().register().flags("flagsV20", {
 *   byte1: ['unsellable (critical item, kept on ground)','two-handed','movable','displayable','cursed',null,'magical','bow',],
 *   byte2: ['silver','cold-iron','stolen (unsellable)','cannot place in carryable container','pulsating',]
 * }).write();
 */
const flagsV20 = {
  // byte1
  0x1: 'unsellable (critical item, kept on ground)',
  0x2: 'two-handed',
  0x4: 'movable',
  0x8: 'displayable',
  0x10: 'cursed',
  // 0x20: unused
  0x40: 'magical',
  0x80: 'bow',

  // byte2
  0x100: 'silver',
  0x200: 'cold-iron',
  0x400: 'stolen (unsellable)',
  0x800: 'cannot place in carryable container',
  0x1000: 'pulsating',
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type FlagsV20 = typeof flagsV20[keyof typeof flagsV20];

/* createGenerator().register().enum("itemTypeV20",
 *   ['books/misc','amulets and necklaces','armor','belts and girdles','boots','arrows','bracers and gauntlets','helms, hats, and other head-wear','keys// (not in icewind dale?)','potions','rings','scrolls','shields// (not in iwd)','food','bullets// (for a sling)','bows','daggers','maces// (in bg, this includes clubs)','slings','small swords','large swords','hammers','morning stars','flails','darts','axes// (specifically, 1-handed axes -- halberds and 2-handed polearms ot included)','quarterstaff','crossbow','hand-to-hand weapons// (fist, fist irons, punch daggers, etc)','spears','halberds// (2-handed polearms)','crossbow bolts','cloaks and robes','gold pieces// (not an inventory item, but can appear as "monster ropped" treasure)','gems','wands','containers','books','familiars','tattoos// (pst)','lenses// (pst)','bucklers/teeth','candles','child body','clubs','female body','key','large shields','male body','medium shields','notes','rods','skulls','small shields','spider body','telescopes','drinks','great swords','container','fur/pelt','leather armor','studded leather armor','chain mail','splint mail','half plate','full plate','hide armor','robe','scale mail','bastard sword','scarf','food','hat','gauntlet',]
 * ).write();
 */
const itemTypeV20 = {
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
  20: 'large swords',
  21: 'hammers',
  22: 'morning stars',
  23: 'flails',
  24: 'darts',
  25: 'axes', // (specifically, 1-handed axes -- halberds and 2-handed polearms ot included)
  26: 'quarterstaff',
  27: 'crossbow',
  28: 'hand-to-hand weapons', // (fist, fist irons, punch daggers, etc)
  29: 'spears',
  30: 'halberds', // (2-handed polearms)
  31: 'crossbow bolts',
  32: 'cloaks and robes',
  33: 'gold pieces', // (not an inventory item, but can appear as "monster ropped" treasure)
  34: 'gems',
  35: 'wands',
  36: 'containers',
  37: 'books',
  38: 'familiars',
  39: 'tattoos', // (pst)
  40: 'lenses', // (pst)
  41: 'bucklers/teeth',
  42: 'candles',
  43: 'child body',
  44: 'clubs',
  45: 'female body',
  46: 'key',
  47: 'large shields',
  48: 'male body',
  49: 'medium shields',
  50: 'notes',
  51: 'rods',
  52: 'skulls',
  53: 'small shields',
  54: 'spider body',
  55: 'telescopes',
  56: 'drinks',
  57: 'great swords',
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
  68: 'scale mail',
  69: 'bastard sword',
  70: 'scarf',
  71: 'food',
  72: 'hat',
  73: 'gauntlet',
} as const;
type ItemTypeV20 = typeof itemTypeV20[keyof typeof itemTypeV20];

/* createGenerator().register().flags("unusableByV20", {
 *   byte1: ['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger',],
 *   byte2: ['rogue','sorcerer','wizard',null,'chaotic','evil','good','x neutral',],
 *   byte3: ['lawful','neutral',null,null,null,null,null,'elf',],
 *   byte4: ['dwarf','half-elf','halfling','human','gnome','half-orc',],
 * }).write();
 */
const unusableByV20 = {
  // byte1
  0x1: 'barbarian',
  0x2: 'bard',
  0x4: 'cleric',
  0x8: 'druid',
  0x10: 'fighter',
  0x20: 'monk',
  0x40: 'paladin',
  0x80: 'ranger',

  // byte2
  0x100: 'rogue',
  0x200: 'sorcerer',
  0x400: 'wizard',
  // 0x800: unused
  0x1000: 'chaotic',
  0x2000: 'evil',
  0x4000: 'good',
  0x8000: 'x neutral',

  // byte3
  0x10000: 'lawful',
  0x20000: 'neutral',
  // 0x40000: unused
  // 0x80000: unused
  // 0x100000: unused
  // 0x200000: unused
  // 0x400000: unused
  0x800000: 'elf',

  // byte4
  0x1000000: 'dwarf',
  0x2000000: 'half-elf',
  0x4000000: 'halfling',
  0x8000000: 'human',
  0x10000000: 'gnome',
  0x20000000: 'half-orc',
  // 0x40000000: unused
  // 0x80000000: unused
} as const;
type UnusableByV20 = typeof unusableByV20[keyof typeof unusableByV20];

/* createGenerator().register().flags('kitUsability2V20', {
 *   byte1: ['cleric of lathander','cleric of selune','cleric of helm','cleric of oghma','cleric of tempus','cleric of bane','cleric of mask','cleric of talos',]
 * }).write();
 */
const kitUsability2V20 = {
  // byte1
  0x1: 'cleric of lathander',
  0x2: 'cleric of selune',
  0x4: 'cleric of helm',
  0x8: 'cleric of oghma',
  0x10: 'cleric of tempus',
  0x20: 'cleric of bane',
  0x40: 'cleric of mask',
  0x80: 'cleric of talos',
} as const;
type KitUsability2V20 = typeof kitUsability2V20[keyof typeof kitUsability2V20];

/* createGenerator().register().flags('kitUsability3V20', {
 *   byte1: ['diviner','enchanter','illusionist','evoker','necromancer','transmuter','generalist mage','cleric of ilmater',]
 * }).write();
 */
const kitUsability3V20 = {
  // byte1
  0x1: 'diviner',
  0x2: 'enchanter',
  0x4: 'illusionist',
  0x8: 'evoker',
  0x10: 'necromancer',
  0x20: 'transmuter',
  0x40: 'generalist mage',
  0x80: 'cleric of ilmater',
} as const;
type KitUsability3V20 = typeof kitUsability3V20[keyof typeof kitUsability3V20];

/* createGenerator().register().flags('kitUsability4V20', {
 *   byte1: ['paladin of ilmater','paladin of helm','paladin of mystra','monk of the old order','monk of the broken ones','monk of the dark moon','abjurer','conjurer',]
 * }).write();
 */
const kitUsability4V20 = {
  // byte1
  0x1: 'paladin of ilmater',
  0x2: 'paladin of helm',
  0x4: 'paladin of mystra',
  0x8: 'monk of the old order',
  0x10: 'monk of the broken ones',
  0x20: 'monk of the dark moon',
  0x40: 'abjurer',
  0x80: 'conjurer',
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
  itemType: extend(itemTypeV20),
  unusableBy: extend(unusableByV20),
  kitUsability2: extend(kitUsability2V20),
  kitUsability3: extend(kitUsability3V20),
  kitUsability4: extend(kitUsability4V20),
  // weaponProficiency: extend(weaponProficiencyV20),
};

export type HeaderV20 = Readonly<{
  signature: string;
  version: string;
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  replacementItem: string;
  flags: FlagsV20[];
  itemType: ItemTypeV20;
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
