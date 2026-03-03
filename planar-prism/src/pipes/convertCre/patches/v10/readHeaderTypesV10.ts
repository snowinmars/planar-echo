import { extend } from '../../../../pipes/offsetMap.js';
import type { Maybe } from '../../../../shared/types.js';

/* createGenerator().register().flags('creatureFlagsV10',{
 *   byte1:['show longname in tooltip','no corpse','keep corpse','original class was fighter','original class was mage','original class was cleric','original class was thief','original class was druid',],
 *   byte2:['original class was ranger','fallen paladin','fallen ranger','exportable','hide injury status in tooltip','quest critical/affected by alternative damage','moving between areas','been in party',],
 *   byte3:['restore item in hand','un-sets bit 16',null,null,'prevent exploding death (bgee)',null,'do not apply nightmare mode modifiers (bgee)','no tooltip (bgee)',],
 *   byte4:['related to random walk (ea)','related to random walk (general)','related to random walk (race)','related to random walk (class)','related to random walk (specific)','related to random walk (gender)','related to random walk (alignment)','un-interruptable (memory only)',]
 * }).write();
 */
const creatureFlagsV10 = {
  // byte1
  0x1: 'show longname in tooltip',
  0x2: 'no corpse',
  0x4: 'keep corpse',
  0x8: 'original class was fighter',
  0x10: 'original class was mage',
  0x20: 'original class was cleric',
  0x40: 'original class was thief',
  0x80: 'original class was druid',

  // byte2
  0x100: 'original class was ranger',
  0x200: 'fallen paladin',
  0x400: 'fallen ranger',
  0x800: 'exportable',
  0x1000: 'hide injury status in tooltip',
  0x2000: 'quest critical/affected by alternative damage',
  0x4000: 'moving between areas',
  0x8000: 'been in party',

  // byte3
  0x10000: 'restore item in hand',
  0x20000: 'un-sets bit 16',
  // 0x40000: unused
  // 0x80000: unused
  0x100000: 'prevent exploding death (bgee)',
  // 0x200000: unused
  0x400000: 'do not apply nightmare mode modifiers (bgee)',
  0x800000: 'no tooltip (bgee)',

  // byte4
  0x1000000: 'related to random walk (ea)',
  0x2000000: 'related to random walk (general)',
  0x4000000: 'related to random walk (race)',
  0x8000000: 'related to random walk (class)',
  0x10000000: 'related to random walk (specific)',
  0x20000000: 'related to random walk (gender)',
  0x40000000: 'related to random walk (alignment)',
  0x80000000: 'un-interruptable (memory only)',
} as const;
type CreatureFlagsV10 = typeof creatureFlagsV10[keyof typeof creatureFlagsV10];

/* createGenerator().register().flags('permanentStatusFlagsV10',{
 *   byte1:['sleeping','berserk','panic','stunned','invisible','helpless','frozen_death','stone_death',],
 *   byte2:['exploding_death','flame_death','acid_death','dead','silenced','charmed','poisoned','hasted',],
 *   byte3:['slowed','infravision','blind','diseased','feebleminded','nondetection','improvedinvisibility','bless',],
 *   byte4:['chant','drawuponholymight','luck','aid','chantbad','blur','mirrorimage','confused',]
 * }).write();
 */
const permanentStatusFlagsV10 = {
  // byte1
  0x1: 'sleeping',
  0x2: 'berserk',
  0x4: 'panic',
  0x8: 'stunned',
  0x10: 'invisible',
  0x20: 'helpless',
  0x40: 'frozen_death',
  0x80: 'stone_death',

  // byte2
  0x100: 'exploding_death',
  0x200: 'flame_death',
  0x400: 'acid_death',
  0x800: 'dead',
  0x1000: 'silenced',
  0x2000: 'charmed',
  0x4000: 'poisoned',
  0x8000: 'hasted',

  // byte3
  0x10000: 'slowed',
  0x20000: 'infravision',
  0x40000: 'blind',
  0x80000: 'diseased',
  0x100000: 'feebleminded',
  0x200000: 'nondetection',
  0x400000: 'improvedinvisibility',
  0x800000: 'bless',

  // byte4
  0x1000000: 'chant',
  0x2000000: 'drawuponholymight',
  0x4000000: 'luck',
  0x8000000: 'aid',
  0x10000000: 'chantbad',
  0x20000000: 'blur',
  0x40000000: 'mirrorimage',
  0x80000000: 'confused',
} as const;
type PermanentStatusFlagsV10 = typeof permanentStatusFlagsV10[keyof typeof permanentStatusFlagsV10];

/* createGenerator().register().flags('shieldFlagsV10',{
 *   byte1:['normalShield','blackBarbedShield',],
 * }).write();
 */
const shieldFlagsV10 = {
  // byte1
  0x1: 'normalShield',
  0x2: 'blackBarbedShield',
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type ShieldFlagsV10 = typeof shieldFlagsV10[keyof typeof shieldFlagsV10];

/* createGenerator().register().flags('attributeFlagsV10',{
 *   byte1:['auto-calculate marker rectangle','translucent',null,null,'increment death variable counter (deathvariable_dead)','increment character type death counter','character type death counter modifier','increment faction death counter (kill_faction)',],
 *   byte2:['increment team death counter (kill_team)','invulnerable','increment good variable','increment law variable','increment lady variable','increment murder variable','do not face target during dialogue','turn all nearby creatures party-hostile when calling help()',],
 *   byte3:null,
 *   byte4:[null,null,null,null,null,null,'do not increment globals','area supplemental',]
 * }).write();
 */
const attributeFlagsV10 = {
  // byte1
  0x1: 'auto-calculate marker rectangle',
  0x2: 'translucent',
  // 0x4: unused
  // 0x8: unused
  0x10: 'increment death variable counter (deathvariable_dead)',
  0x20: 'increment character type death counter',
  0x40: 'character type death counter modifier',
  0x80: 'increment faction death counter (kill_faction)',

  // byte2
  0x100: 'increment team death counter (kill_team)',
  0x200: 'invulnerable',
  0x400: 'increment good variable',
  0x800: 'increment law variable',
  0x1000: 'increment lady variable',
  0x2000: 'increment murder variable',
  0x4000: 'do not face target during dialogue',
  0x8000: 'turn all nearby creatures party-hostile when calling help()',

  // byte3
  // unused

  // byte4
  // 0x1000000: unused
  // 0x2000000: unused
  // 0x4000000: unused
  // 0x8000000: unused
  // 0x10000000: unused
  // 0x20000000: unused
  0x40000000: 'do not increment globals',
  0x80000000: 'area supplemental',
} as const;
type AttributeFlagsV10 = typeof attributeFlagsV10[keyof typeof attributeFlagsV10];

/* createGenerator().register().shiftedEnum('sexV10', 1,
 *   ['male','female','other','niether','both','summoned','illusionary','extra','summoned_demon','extra2','extra3','extra4','extra5','extra6','extra7','extra8','extra9','extra10'],
 *   [66, 'imprisoned_summoned']
 * ).write();
 */
const sexV10 = {
  1: 'male',
  2: 'female',
  3: 'other',
  4: 'niether',
  5: 'both',
  6: 'summoned',
  7: 'illusionary',
  8: 'extra',
  9: 'summoned_demon',
  10: 'extra2',
  11: 'extra3',
  12: 'extra4',
  13: 'extra5',
  14: 'extra6',
  15: 'extra7',
  16: 'extra8',
  17: 'extra9',
  18: 'extra10',
  66: 'imprisoned_summoned',
} as const;
type SexV10 = typeof sexV10[keyof typeof sexV10];

/* createGenerator().register().enum('kitInformationV10',
 *   [],
 *   [0x00000000, 'none',],[0x00004000, 'kit_barbarian',],[0x40000000, 'kit_trueclass',],[0x40010000, 'kit_berserker',],[0x40020000, 'kit_wizardslayer',],[0x40030000, 'kit_kensai',],[0x40040000, 'kit_cavalier',],[0x40050000, 'kit_inquisitor',],[0x40060000, 'kit_undeadhunter',],[0x40070000, 'kit_archer',],[0x40080000, 'kit_stalker',],[0x40090000, 'kit_beastmaster',],[0x400A0000, 'kit_assassin',],[0x400B0000, 'kit_bountyhunter',],[0x400C0000, 'kit_swashbuckler',],[0x400D0000, 'kit_blade',],[0x400E0000, 'kit_jester',],[0x400F0000, 'kit_skald',],[0x40100000, 'kit_totemic',],[0x40110000, 'kit_shapeshifter',],[0x40120000, 'kit_avenger',],[0x40130000, 'kit_godtalos',],[0x40140000, 'kit_godhelm',],[0x40150000, 'kit_godlathander',],[0x00400000, 'abjurer',],[0x00800000, 'conjurer',],[0x01000000, 'diviner',],[0x02000000, 'enchanter',],[0x04000000, 'illusionist',],[0x08000000, 'invoker',],[0x10000000, 'necromancer',],[0x20000000, 'transmuter',],
 * ).write();
 */
const kitInformationV10 = {
  0: 'none',
  16384: 'kit_barbarian',
  4194304: 'abjurer',
  8388608: 'conjurer',
  16777216: 'diviner',
  33554432: 'enchanter',
  67108864: 'illusionist',
  134217728: 'invoker',
  268435456: 'necromancer',
  536870912: 'transmuter',
  1073741824: 'kit_trueclass',
  1073807360: 'kit_berserker',
  1073872896: 'kit_wizardslayer',
  1073938432: 'kit_kensai',
  1074003968: 'kit_cavalier',
  1074069504: 'kit_inquisitor',
  1074135040: 'kit_undeadhunter',
  1074200576: 'kit_archer',
  1074266112: 'kit_stalker',
  1074331648: 'kit_beastmaster',
  1074397184: 'kit_assassin',
  1074462720: 'kit_bountyhunter',
  1074528256: 'kit_swashbuckler',
  1074593792: 'kit_blade',
  1074659328: 'kit_jester',
  1074724864: 'kit_skald',
  1074790400: 'kit_totemic',
  1074855936: 'kit_shapeshifter',
  1074921472: 'kit_avenger',
  1074987008: 'kit_godtalos',
  1075052544: 'kit_godhelm',
  1075118080: 'kit_godlathander',
} as const;
type KitInformationV10 = typeof kitInformationV10[keyof typeof kitInformationV10];

/* createGenerator().register().enum('specificV10',{
 *   0: ['none'],
 *   1: ['normal'],
 *   2: ['nameless_one'],
 *   3: ['vhailor'],
 *   4: ['nordom'],
 *   5: ['ignus'],
 *   6: ['grace'],
 *   7: ['dakkon'],
 *   8: ['annah'],
 *   9: ['morte'],
 *   18: ['team_1_leader'],
 *   47: ['patron_6'],
 *   49: ['chatty_guard'],
 *   70: ['pack_leader'],
 *   71: ['sybil'],
 *   101: ['magic'],
 *   102: ['no_magic'],
 *   189: ['damsel_in_distress'],
 * }).write();
 */
const specificV10 = {
  0: 'none',
  1: 'normal',
  2: 'nameless_one',
  3: 'vhailor',
  4: 'nordom',
  5: 'ignus',
  6: 'grace',
  7: 'dakkon',
  8: 'annah',
  9: 'morte',
  18: 'team_1_leader',
  47: 'patron_6',
  49: 'chatty_guard',
  70: 'pack_leader',
  71: 'sybil',
  101: 'magic',
  102: 'no_magic',
  189: 'damsel_in_distress',
} as const;
type SpecificV10 = typeof specificV10[keyof typeof specificV10];

/* createGenerator().register().enum('genderV10', {
 *   1: ['male','female','other','niether','both','summoned','illusionary','extra','summoned_demon','extra2','extra3','extra4','extra5','extra6','extra7','extra8','extra9','extra10'],
 * }).write();
 */
const genderV10 = {
  1: 'male',
  2: 'female',
  3: 'other',
  4: 'niether',
  5: 'both',
  6: 'summoned',
  7: 'illusionary',
  8: 'extra',
  9: 'summoned_demon',
  10: 'extra2',
  11: 'extra3',
  12: 'extra4',
  13: 'extra5',
  14: 'extra6',
  15: 'extra7',
  16: 'extra8',
  17: 'extra9',
  18: 'extra10',
} as const;
type GenderV10 = typeof genderV10[keyof typeof genderV10];

/* createGenerator().register().enum('objectIdsReferencesV10',
 *   ['nothing','myself','leaderOf','groupOf','weakestOf','strongestOf','mostDamagedOf','leastDamagedOf','protectedBy','protectorOf','lastAttackerOf','lastTargetedBy','nearestEnemyOf','lastCommandedBy','nearest','lastHitter','lastHelp','lastTrigger','lastSeenBy','lastTalkedToBy','lastHeardBy','player1','player2','player3','player4','player5','player6','protagonist','strongestOfMale','secondNearestEnemyOf','thirdNearestEnemyOf','fourthNearestEnemyOf','fifthNearestEnemyOf','sixthNearestEnemyOf','seventhNearestEnemyOf','eigthNearestEnemyOf','ninthNearestEnemyOf','tenthNearestEnemyOf','secondNearest','thirdNearest','fourthNearest','fifthNearest','sixthNearest','seventhNearest','eighthNearest','ninthNearest','tenthNearest','worstAC','bestAC','lastSummonerOf','nearestEnemyOfType','secondNearestEnemyOfType','thirdNearestEnemyOfType','fourthNearestEnemyOfType','fifthNearestEnemyOfType','sixthNearestEnemyOfType','seventhNearestEnemyOfType','eigthNearestEnemyOfType','ninthNearestEnemyOfType','tenthNearestEnemyOfType','nearestMyGroupOfType','secondNearestMyGroupOfType','thirdNearestMyGroupOfType','fourthNearestMyGroupOfType','fifthNearestMyGroupOfType','sixthNearestMyGroupOfType','seventhNearestMyGroupOfType','eigthNearestMyGroupOfType','ninthNearestMyGroupOfType','tenthNearestMyGroupOfType','player1Fill','player2Fill','player3Fill','player4Fill','player5Fill','player6Fill','nearestDoor','secondNearestDoor','thirdNearestDoor','fourthNearestDoor','fifthNearestDoor','sixthNearestDoor','seventhNearestDoor','eighthNearestDoor','ninthNearestDoor','tenthNearestDoor'],
 * ).write();
 */
const objectIdsReferencesV10 = {
  0: 'nothing',
  1: 'myself',
  2: 'leaderOf',
  3: 'groupOf',
  4: 'weakestOf',
  5: 'strongestOf',
  6: 'mostDamagedOf',
  7: 'leastDamagedOf',
  8: 'protectedBy',
  9: 'protectorOf',
  10: 'lastAttackerOf',
  11: 'lastTargetedBy',
  12: 'nearestEnemyOf',
  13: 'lastCommandedBy',
  14: 'nearest',
  15: 'lastHitter',
  16: 'lastHelp',
  17: 'lastTrigger',
  18: 'lastSeenBy',
  19: 'lastTalkedToBy',
  20: 'lastHeardBy',
  21: 'player1',
  22: 'player2',
  23: 'player3',
  24: 'player4',
  25: 'player5',
  26: 'player6',
  27: 'protagonist',
  28: 'strongestOfMale',
  29: 'secondNearestEnemyOf',
  30: 'thirdNearestEnemyOf',
  31: 'fourthNearestEnemyOf',
  32: 'fifthNearestEnemyOf',
  33: 'sixthNearestEnemyOf',
  34: 'seventhNearestEnemyOf',
  35: 'eigthNearestEnemyOf',
  36: 'ninthNearestEnemyOf',
  37: 'tenthNearestEnemyOf',
  38: 'secondNearest',
  39: 'thirdNearest',
  40: 'fourthNearest',
  41: 'fifthNearest',
  42: 'sixthNearest',
  43: 'seventhNearest',
  44: 'eighthNearest',
  45: 'ninthNearest',
  46: 'tenthNearest',
  47: 'worstAC',
  48: 'bestAC',
  49: 'lastSummonerOf',
  50: 'nearestEnemyOfType',
  51: 'secondNearestEnemyOfType',
  52: 'thirdNearestEnemyOfType',
  53: 'fourthNearestEnemyOfType',
  54: 'fifthNearestEnemyOfType',
  55: 'sixthNearestEnemyOfType',
  56: 'seventhNearestEnemyOfType',
  57: 'eigthNearestEnemyOfType',
  58: 'ninthNearestEnemyOfType',
  59: 'tenthNearestEnemyOfType',
  60: 'nearestMyGroupOfType',
  61: 'secondNearestMyGroupOfType',
  62: 'thirdNearestMyGroupOfType',
  63: 'fourthNearestMyGroupOfType',
  64: 'fifthNearestMyGroupOfType',
  65: 'sixthNearestMyGroupOfType',
  66: 'seventhNearestMyGroupOfType',
  67: 'eigthNearestMyGroupOfType',
  68: 'ninthNearestMyGroupOfType',
  69: 'tenthNearestMyGroupOfType',
  70: 'player1Fill',
  71: 'player2Fill',
  72: 'player3Fill',
  73: 'player4Fill',
  74: 'player5Fill',
  75: 'player6Fill',
  76: 'nearestDoor',
  77: 'secondNearestDoor',
  78: 'thirdNearestDoor',
  79: 'fourthNearestDoor',
  80: 'fifthNearestDoor',
  81: 'sixthNearestDoor',
  82: 'seventhNearestDoor',
  83: 'eighthNearestDoor',
  84: 'ninthNearestDoor',
  85: 'tenthNearestDoor',
} as const;
type ObjectIdsReferencesV10 = typeof objectIdsReferencesV10[keyof typeof objectIdsReferencesV10];

/* createGenerator().register().enum('alignmentV10', {
 *   0x0:  ['none'          ,'mask_good'   ,'mask_geneutral' ,'mask_evil'   ],
 *   0x10: ['mask_lawful'   ,'lawful_good' ,'lawful_neutral' ,'lawful_evil' ],
 *   0x20: ['mask_lcneutral','neutral_good','neutral'        ,'neutral_evil'],
 *   0x30: ['mask_chaotic'  ,'chaotic_good','chaotic_neutral','chaotic_evil'],
 * }).write();
 */
const alignmentV10 = {
  0: 'none',
  1: 'mask_good',
  2: 'mask_geneutral',
  3: 'mask_evil',
  16: 'mask_lawful',
  17: 'lawful_good',
  18: 'lawful_neutral',
  19: 'lawful_evil',
  32: 'mask_lcneutral',
  33: 'neutral_good',
  34: 'neutral',
  35: 'neutral_evil',
  48: 'mask_chaotic',
  49: 'chaotic_good',
  50: 'chaotic_neutral',
  51: 'chaotic_evil',
} as const;
type AlignmentV10 = typeof alignmentV10[keyof typeof alignmentV10];

export const offsetMap = {
  creatureFlags: extend(creatureFlagsV10),
  permanentStatusFlags: extend(permanentStatusFlagsV10),
  shieldFlags: extend(shieldFlagsV10),
  attributeFlags: extend(attributeFlagsV10),
  sex: extend(sexV10),
  kitInformation: extend(kitInformationV10),
  specific: extend(specificV10),
  gender: extend(genderV10),
  objectIdsReferences: extend(objectIdsReferencesV10),
  alignment: extend(alignmentV10),
};

export type CreatureHeaderV10 = Readonly<{
  signature: string;
  version: string;
  longNameRef: number;
  shortNameRef: number;
  creatureFlags: CreatureFlagsV10[];
  xpGainedForKilling: number;
  creaturePowerLevelOrXpOfCreature: number;
  goldCarried: number;
  permanentStatusFlags: PermanentStatusFlagsV10[];
  currentHitPoints: number;
  maximumHitPoints: number;
  animationId: number;
  metalColourIndex: number;
  minorColourIndex: number;
  majorColourIndex: number;
  skinColourIndex: number;
  leatherColourIndex: number;
  armorColourIndex: number;
  hairColourIndex: number;
  effStructureVersion: number;
  smallPortrait: string;
  largePortrait: string;
  reputation: number;
  hideInShadows: number;
  armorClassNatural: number;
  armorClassEffective: number;
  armorClassCrushingAttacksModifier: number;
  armorClassMissileAttacksModifier: number;
  armorClassPiercingAttacksModifier: number;
  armorClassSlashingAttacksModifier: number;
  thac0: number;
  numberOfAttacks: number;
  saveVersusDeath: number;
  saveVersusWands: number;
  saveVersusPolymorph: number;
  saveVersusBreathAttacks: number;
  saveVersusSpells: number;
  resistFire: number;
  resistCold: number;
  resistElectricity: number;
  resistAcid: number;
  resistMagic: number;
  resistMagicFire: number;
  resistMagicCold: number;
  resistSlashing: number;
  resistCrushing: number;
  resistPiercing: number;
  resistMissile: number;
  detectIllusion: number;
  setTraps: number;
  lore: number;
  lockpicking: number;
  moveSilently: number;
  findOrDisarmTraps: number;
  pickPockets: number;
  fatigue: number;
  intoxication: number;
  luck: number;
  largeSwordsProficiencyBg1: number;
  smallSwordsProficiencyBg1: number;
  bowsProficiencyBg1: number;
  spearsProficiencyBg1: number;
  bluntProficiencyBg1: number;
  spikedProficiencyBg1: number;
  axeProficiencyBg1: number;
  missileProficiencyBg1: number;
  unusedProficiency1: number;
  unusedProficiency2: number;
  unusedProficiency3: number;
  unusedProficiency4: number;
  unusedProficiency5: number;
  unspentProficienciesPstee: number;
  numberOfAvailableInventorySlotsPstee: number;
  nightmareModeModifiersApplied: number;
  translucency: number;
  reputationGainOrLossWhenKilledInBg12_or_MurderVariableIncrementValueIsPstee: number;
  reputationGainOrLossWhenJoiningPartyBgee: number;
  reputationGainOrLossWhenLeavingPartyBgee: number;
  turnUndeadLevel: number;
  trackingSkill: number;
  trackingTarget: Maybe<string>;
  currentThiefClassExperience: Maybe<number>;
  currentMageClassExperience: Maybe<number>;
  goodVariableIncrementValue: Maybe<number>;
  lawVariableIncrementValue: Maybe<number>;
  ladyVariableIncrementValue: Maybe<number>;
  faction: Maybe<number>;
  team: Maybe<number>;
  species: Maybe<number>;
  dialogueActivationRange: Maybe<number>;
  selectionCircleSize: Maybe<number>;
  shieldFlags: Maybe<ShieldFlagsV10[]>;
  fieldOfVision: Maybe<number>;
  attributeFlags: Maybe<AttributeFlagsV10[]>;
  strRefsPertainingToCharacter: number[];
  levelFirstClass: number;
  levelSecondClass: number;
  levelThirdClass: number;
  sex: SexV10;
  strength: number;
  strengthPercentageBonus: number;
  intelligence: number;
  wisdom: number;
  dexterity: number;
  constitution: number;
  charisma: number;
  morale: number;
  moraleBreak: number;
  racialEnemy: number;
  moraleRecoveryTime: number;
  deity: Maybe<string>;
  diety: Maybe<string>;
  mageType: Maybe<number>;
  kitInformation: Maybe<KitInformationV10>;
  creatureScriptOverrideRef: string;
  creatureScriptClassRef: string;
  creatureScriptRaceRef: string;
  creatureScriptGeneralRef: string;
  creatureScriptDefaultRef: string;
  enemyAlly: string;
  general: string;
  race: string;
  theClass: string;
  specific: SpecificV10;
  gender: GenderV10;
  objectSpec1: Maybe<number>;
  objectSpec2: Maybe<number>;
  objectSpec3: Maybe<number>;
  objectSpec4: Maybe<number>;
  objectSpec5: Maybe<number>;
  objectIdsReferences: Maybe<ObjectIdsReferencesV10>;
  alignment: AlignmentV10;
  globalActorEnumerationValue: number;
  localAreaActorEnumerationValue: number;
  scriptName: Maybe<string>;
  deathVariable: Maybe<string>;
  knownSpellsOffset: number;
  knownSpellsCount: number;
  spellMemorizationInfoOffset: number;
  spellMemorizationInfoEntriesCount: number;
  memorizedSpellsOffset: number;
  memorizedSpellsCount: number;
  offsetToItemSlots: number;
  offsetToItems: number;
  countOfItems: number;
  offsetToEffects: number;
  countOfEffects: number;
  dialogFileRef: string;
}>;
