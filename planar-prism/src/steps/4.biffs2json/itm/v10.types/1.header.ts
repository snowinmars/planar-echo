import { extend } from '@/pipes/offsetMap.js';

import type { Maybe } from '@planar/shared';

/* createGenerator().register().flags('flagsV10',{
 *   byte1:['unsellable (critical item)','two-handed','movable/droppable','displayable','cursed','cannot scribe to spellbook (scrolls)','magical','left-handed'],
 *   byte2:['silver','cold iron','stolen (unsellable)/off-handed','conversable/unsellable','fake two-handed (bgee)','forbid off-hand weapon (bgee)','usable in inventory (pstee)','adamantine (bgee)'],
 *   byte3:null,
 *   byte4:['undispellable','toggle critical hit aversion (bgee, tobex)']
 * }).write();
 */
const flagsV10 = {
// byte1
  0x1: 'unsellable (critical item)',
  0x2: 'two-handed',
  0x4: 'movable/droppable',
  0x8: 'displayable',
  0x10: 'cursed',
  0x20: 'cannot scribe to spellbook (scrolls)',
  0x40: 'magical',
  0x80: 'left-handed',

  // byte2
  0x100: 'silver',
  0x200: 'cold iron',
  0x400: 'stolen (unsellable)/off-handed',
  0x800: 'conversable/unsellable',
  0x1000: 'fake two-handed (bgee)',
  0x2000: 'forbid off-hand weapon (bgee)',
  0x4000: 'usable in inventory (pstee)',
  0x8000: 'adamantine (bgee)',

  // byte3
  // unused

  // byte4
  0x1000000: 'undispellable',
  0x2000000: 'toggle critical hit aversion (bgee, tobex)',
// 0x1000000: unused
// 0x2000000: unused
// 0x4000000: unused
// 0x8000000: unused
// 0x10000000: unused
// 0x20000000: unused
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

/* createGenerator().register().enum('itemTypeV10',
 *   ['books/misc','amulets and necklaces','armor','belts and girdles','boots','arrows','bracers and gauntlets','headgear','keys','potions','rings','scrolls','shields','food','bullets','bows','daggers','maces','slings','small swords','large swords','hammers','morning stars','flails','darts','axes','quarterstaff','crossbow','hand-to-hand weapons','spears','halberds','crossbow bolts','cloaks and robes','gold pieces','gems','wands','containers/eye/broken armor','books/broken shields/bracelets','familiars/broken swords/earrings','tattoos','lenses','bucklers/teeth','candles',null,'clubs',null,null,'large shields',null,'medium shields','notes',null,null,'small shields',null,'telescopes','drinks','great swords','container','fur/pelt','leather armor','studded leather armor','chain mail','splint mail','half plate','full plate','hide armor','robe',null,'bastard sword','scarf','food','hat','gauntlet',]
 * ).write()
 */
const itemTypeV10 = {
  0: 'books/misc',
  1: 'amulets and necklaces',
  2: 'armor',
  3: 'belts and girdles',
  4: 'boots',
  5: 'arrows',
  6: 'bracers and gauntlets',
  7: 'headgear', // (helms, hats, and other head-wear)
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
  25: 'axes', // (specifically, 1-handed axes -- halberds and 2-handed polearms not included)
  26: 'quarterstaff',
  27: 'crossbow',
  28: 'hand-to-hand weapons', // (fist, fist irons, punch daggers, etc)
  29: 'spears',
  30: 'halberds', // (2-handed polearms)
  31: 'crossbow bolts',
  32: 'cloaks and robes',
  33: 'gold pieces', // (not an inventory item, but can appear as 'monster dropped' treasure)
  34: 'gems',
  35: 'wands',
  36: 'containers/eye/broken armor',
  37: 'books/broken shields/bracelets',
  38: 'familiars/broken swords/earrings',
  39: 'tattoos', // (pst)
  40: 'lenses', // (pst)
  41: 'bucklers/teeth',
  42: 'candles',
  // 43: unused
  44: 'clubs', // (iwd)
  // 45: unused
  // 46: unused
  47: 'large shields', // (iwd)
  // 48: unused
  49: 'medium shields', // (iwd)
  50: 'notes',
  // 51: unused
  // 52: unused
  53: 'small shields', // (iwd)
  // 54: unused
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
  // 68: unused
  69: 'bastard sword',
  70: 'scarf',
  71: 'food', // (iwd2)
  72: 'hat',
  73: 'gauntlet',
} as const;
type ItemTypeV10 = typeof itemTypeV10[keyof typeof itemTypeV10];

/* createGenerator().register().flags('unusableByV10',{
 *   byte1:['chaotic x','x evil','x good','x neutral','lawful x','neutral x','bard','cleric'],
 *   byte2:['cleric/mage','cleric/thief','cleric/ranger','fighter','fighter/druid','fighter/mage','fighter/cleric','fighter/mage/cleric'],
 *   byte3:['fighter/mage/thief','fighter/thief','mage','mage/thief','paladin','ranger','thief','elf'],
 *   byte4:['dwarf','half-elf','halfling','human','gnome','monk','druid','half-orc']
 * }).write();
 */
const unusableByV10 = {
  // byte1
  0x1: 'chaotic x',
  0x2: 'x evil',
  0x4: 'x good',
  0x8: 'x neutral',
  0x10: 'lawful x',
  0x20: 'neutral x',
  0x40: 'bard',
  0x80: 'cleric',

  // byte2
  0x100: 'cleric/mage',
  0x200: 'cleric/thief',
  0x400: 'cleric/ranger',
  0x800: 'fighter',
  0x1000: 'fighter/druid',
  0x2000: 'fighter/mage',
  0x4000: 'fighter/cleric',
  0x8000: 'fighter/mage/cleric',

  // byte3
  0x10000: 'fighter/mage/thief',
  0x20000: 'fighter/thief',
  0x40000: 'mage',
  0x80000: 'mage/thief',
  0x100000: 'paladin',
  0x200000: 'ranger',
  0x400000: 'thief',
  0x800000: 'elf',

  // byte4
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

/* createGenerator().register().enum('itemAnimationBgIwdV10', {
 *   0x2020: ['no animation'],
 *   0x3048: ['helmet: small vertical horns'],
 *   0x3144: ['buckler'],
 *   0x3148: ['helmet: large horizontal horns'],
 *   0x3153: ['one-handed sword: bastard/broad/long/scimitar'],
 *   0x3244: ['shield (small)'],
 *   0x3248: ['helmet: feather wings'],
 *   0x3253: ['twp-handed sword'],
 *   0x3344: ['shield (medium)'],
 *   0x3348: ['helmet: top plume'],
 *   0x3444: ['shield (large)'],
 *   0x3448: ['helmet: dragon wings'],
 *   0x3548: ['helmet: feather sideburns'],
 *   0x3648: ['helmet: large curved horns (incorrect paperdoll, unused)'],
 *   0x4132: ['leather armor'],
 *   0x4133: ['chainmail'],
 *   0x4134: ['plate mail'],
 *   0x4243: ['crossbow'],
 *   0x4248: ['halberd'],
 *   0x434d: ['mace'],
 *   0x4444: ['dagger'],
 *   0x4857: ['war hammer'],
 *   0x4c43: ['club'],
 *   0x4c46: ['flail'],
 *   0x4c53: ['sling'],
 *   0x5053: ['spear'],
 *   0x5346: ['flame sword'],
 *   0x534d: ['morning star'],
 *   0x5351: ['quarterstaff'],
 *   0x5353: ['one-handed sword: short'],
 *   0x5732: ['robe'],
 *   0x5733: ['robe (alternate 1)'],
 *   0x5734: ['robe (alternate 2)'],
 *   0x5742: ['bow'],
 *   0x5841: ['axe'],
 * }).write();
 */
const itemAnimationBgIwdV10 = {
  8224: 'no animation',
  12360: 'helmet: small vertical horns',
  12612: 'buckler',
  12616: 'helmet: large horizontal horns',
  12627: 'one-handed sword: bastard/broad/long/scimitar',
  12868: 'shield (small)',
  12872: 'helmet: feather wings',
  12883: 'twp-handed sword',
  13124: 'shield (medium)',
  13128: 'helmet: top plume',
  13380: 'shield (large)',
  13384: 'helmet: dragon wings',
  13640: 'helmet: feather sideburns',
  13896: 'helmet: large curved horns (incorrect paperdoll, unused)',
  16690: 'leather armor',
  16691: 'chainmail',
  16692: 'plate mail',
  16963: 'crossbow',
  16968: 'halberd',
  17229: 'mace',
  17476: 'dagger',
  18519: 'war hammer',
  19523: 'club',
  19526: 'flail',
  19539: 'sling',
  20563: 'spear',
  21318: 'flame sword',
  21325: 'morning star',
  21329: 'quarterstaff',
  21331: 'one-handed sword: short',
  22322: 'robe',
  22323: 'robe (alternate 1)',
  22324: 'robe (alternate 2)',
  22338: 'bow',
  22593: 'axe',
} as const;
type ItemAnimationBgIwdV10 = typeof itemAnimationBgIwdV10[keyof typeof itemAnimationBgIwdV10];

/* createGenerator().register().enum('itemAnimationBg2V10', {
 *   0x2020: ['no animation'],
 *   0x3048: ['helmet: full'],
 *   0x3144: ['buckler'],
 *   0x3148: ['helmet: large horizontal horns, spiked crest'],
 *   0x3153: ['one-handed sword: bastard/broad/long'],
 *   0x3244: ['shield (small)'],
 *   0x3248: ['helmet: narrow wings'],
 *   0x3253: ['twp-handed sword'],
 *   0x3344: ['shield (medium)'],
 *   0x3348: ['helmet: curved horns'],
 *   0x3353: ['one-handed sword: katana'],
 *   0x3444: ['shield (large)'],
 *   0x3448: ['helmet: top plume'],
 *   0x3548: ['helmet: single crest'],
 *   0x3648: ['helmet: large curved horns (incorrect paperdoll, unused)'],
 *   0x4132: ['leather armor'],
 *   0x4133: ['chainmail'],
 *   0x4134: ['plate mail'],
 *   0x4243: ['crossbow'],
 *   0x4248: ['halberd'],
 *   0x434d: ['mace'],
 *   0x4353: ['one-handed sword: scimitar'],
 *   0x4444: ['dagger'],
 *   0x4857: ['war hammer'],
 *   0x4c43: ['club'],
 *   0x4c46: ['flail'],
 *   0x4c53: ['sling'],
 *   0x5053: ['spear'],
 *   0x5346: ['flame sword'],
 *   0x534d: ['morning star'],
 *   0x5351: ['quarterstaff'],
 *   0x5353: ['one-handed sword: short'],
 *   0x5732: ['robe'],
 *   0x5733: ['robe (alternate 1)'],
 *   0x5734: ['robe (alternate 2)'],
 *   0x5742: ['bow'],
 *   0x5841: ['axe'],
 * }).write();
 */
const itemAnimationBg2V10 = {
  8224: 'no animation',
  12360: 'helmet: full',
  12612: 'buckler',
  12616: 'helmet: large horizontal horns, spiked crest',
  12627: 'one-handed sword: bastard/broad/long',
  12868: 'shield (small)',
  12872: 'helmet: narrow wings',
  12883: 'twp-handed sword',
  13124: 'shield (medium)',
  13128: 'helmet: curved horns',
  13139: 'one-handed sword: katana',
  13380: 'shield (large)',
  13384: 'helmet: top plume',
  13640: 'helmet: single crest',
  13896: 'helmet: large curved horns (incorrect paperdoll, unused)',
  16690: 'leather armor',
  16691: 'chainmail',
  16692: 'plate mail',
  16963: 'crossbow',
  16968: 'halberd',
  17229: 'mace',
  17235: 'one-handed sword: scimitar',
  17476: 'dagger',
  18519: 'war hammer',
  19523: 'club',
  19526: 'flail',
  19539: 'sling',
  20563: 'spear',
  21318: 'flame sword',
  21325: 'morning star',
  21329: 'quarterstaff',
  21331: 'one-handed sword: short',
  22322: 'robe',
  22323: 'robe (alternate 1)',
  22324: 'robe (alternate 2)',
  22338: 'bow',
  22593: 'axe',
} as const;
type ItemAnimationBg2V10 = typeof itemAnimationBg2V10[keyof typeof itemAnimationBg2V10];

/* createGenerator().register().enum('itemAnimationEeV10', {
 *   0x2020: ['no animation'],
 *   0x3043: ['small shield (alternate 1)'],
 *   0x3046: ['flail (alternate 1)'],
 *   0x3048: ['helmet: smooth'],
 *   0x304a: ['helmet: smooth'],
 *   0x3053: ['one-handed sword: bastard'],
 *   0x3143: ['medium shield (alternate 1)'],
 *   0x3144: ['buckler'],
 *   0x3146: ['flail (alternate 2)'],
 *   0x3148: ['helmet: five horns'],
 *   0x314a: ['helmet: five horns'],
 *   0x3153: ['one-handed sword: broad/long'],
 *   0x3243: ['large shield (alternate 1)'],
 *   0x3244: ['shield (small)'],
 *   0x3246: ['flaming short sword'],
 *   0x3248: ['helmet: feather wings'],
 *   0x324a: ['helmet: feather wings with spike'],
 *   0x324d: ['mace (alternate)'],
 *   0x3251: ['quarterstaff (alternate 1)'],
 *   0x3253: ['twp-handed sword'],
 *   0x3343: ['medium shield (alternate 2)'],
 *   0x3344: ['shield (medium)'],
 *   0x3348: ['helmet: curved sidebars'],
 *   0x334a: ['helmet: curved sidebars'],
 *   0x3351: ['quarterstaff (alternate 2)'],
 *   0x3353: ['one-handed sword: katana'],
 *   0x3443: ['small shield (alternate 2)'],
 *   0x3444: ['shield (large)'],
 *   0x3446: ['flail (alternate 3)'],
 *   0x3448: ['helmet: horned, plume'],
 *   0x344a: ['helmet: small horns, plume'],
 *   0x3451: ['quarterstaff (alternate 3)'],
 *   0x3543: ['large shield (alternate 2)'],
 *   0x3548: ['helmet: center crest'],
 *   0x354a: ['helmet: center crest'],
 *   0x3643: ['large shield (alternate 3)'],
 *   0x3648: ['helmet: large curved horns (incorrect paperdoll, unused)'],
 *   0x364a: ['helmet: smooth, two small horns'],
 *   0x3743: ['medium shield (alternate 3)'],
 *   0x374a: ['helmet: large horizontal horns'],
 *   0x384a: ['helmet: feather wings without spike'],
 *   0x394a: ['helmet: full face, large horns, plume'],
 *   0x4132: ['leather armor'],
 *   0x4133: ['chainmail'],
 *   0x4134: ['plate mail'],
 *   0x414a: ['helmet: dragon wings, plume'],
 *   0x4243: ['crossbow'],
 *   0x4248: ['halberd'],
 *   0x424a: ['circlet'],
 *   0x434a: ['helmet: dragon wings'],
 *   0x434d: ['mace'],
 *   0x4353: ['one-handed sword: scimitar'],
 *   0x4444: ['dagger'],
 *   0x4857: ['war hammer'],
 *   0x4c43: ['club'],
 *   0x4c46: ['flail'],
 *   0x4c53: ['sling'],
 *   0x5053: ['spear'],
 *   0x5342: ['shortbow'],
 *   0x5346: ['flaming long sword'],
 *   0x5347: ['glowing staff'],
 *   0x534d: ['morning star'],
 *   0x5351: ['quarterstaff'],
 *   0x5353: ['one-handed sword: short'],
 *   0x5732: ['robe'],
 *   0x5733: ['robe (alternate 1)'],
 *   0x5734: ['robe (alternate 2)'],
 *   0x5742: ['longbow'],
 *   0x575a: ['wings (female)'],
 *   0x5841: ['axe'],
 * }).write();
 */
const itemAnimationEeV10 = {
  8224: 'no animation',
  12355: 'small shield (alternate 1)',
  12358: 'flail (alternate 1)',
  12360: 'helmet: smooth',
  12362: 'helmet: smooth',
  12371: 'one-handed sword: bastard',
  12611: 'medium shield (alternate 1)',
  12612: 'buckler',
  12614: 'flail (alternate 2)',
  12616: 'helmet: five horns',
  12618: 'helmet: five horns',
  12627: 'one-handed sword: broad/long',
  12867: 'large shield (alternate 1)',
  12868: 'shield (small)',
  12870: 'flaming short sword',
  12872: 'helmet: feather wings',
  12874: 'helmet: feather wings with spike',
  12877: 'mace (alternate)',
  12881: 'quarterstaff (alternate 1)',
  12883: 'twp-handed sword',
  13123: 'medium shield (alternate 2)',
  13124: 'shield (medium)',
  13128: 'helmet: curved sidebars',
  13130: 'helmet: curved sidebars',
  13137: 'quarterstaff (alternate 2)',
  13139: 'one-handed sword: katana',
  13379: 'small shield (alternate 2)',
  13380: 'shield (large)',
  13382: 'flail (alternate 3)',
  13384: 'helmet: horned, plume',
  13386: 'helmet: small horns, plume',
  13393: 'quarterstaff (alternate 3)',
  13635: 'large shield (alternate 2)',
  13640: 'helmet: center crest',
  13642: 'helmet: center crest',
  13891: 'large shield (alternate 3)',
  13896: 'helmet: large curved horns (incorrect paperdoll, unused)',
  13898: 'helmet: smooth, two small horns',
  14147: 'medium shield (alternate 3)',
  14154: 'helmet: large horizontal horns',
  14410: 'helmet: feather wings without spike',
  14666: 'helmet: full face, large horns, plume',
  16690: 'leather armor',
  16691: 'chainmail',
  16692: 'plate mail',
  16714: 'helmet: dragon wings, plume',
  16963: 'crossbow',
  16968: 'halberd',
  16970: 'circlet',
  17226: 'helmet: dragon wings',
  17229: 'mace',
  17235: 'one-handed sword: scimitar',
  17476: 'dagger',
  18519: 'war hammer',
  19523: 'club',
  19526: 'flail',
  19539: 'sling',
  20563: 'spear',
  21314: 'shortbow',
  21318: 'flaming long sword',
  21319: 'glowing staff',
  21325: 'morning star',
  21329: 'quarterstaff',
  21331: 'one-handed sword: short',
  22322: 'robe',
  22323: 'robe (alternate 1)',
  22324: 'robe (alternate 2)',
  22338: 'longbow',
  22362: 'wings (female)',
  22593: 'axe',
} as const;
type ItemAnimationEeV10 = typeof itemAnimationEeV10[keyof typeof itemAnimationEeV10];

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

export const offsetMap = {
  flags: extend(flagsV10),
  itemType: extend(itemTypeV10),
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

export type HeaderV10 = Readonly<{
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
