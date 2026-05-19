import { extend } from '@/shared/extendedMap.js';
import type { Maybe } from '@planar/shared';

/* createGenerator().register().flags('flagsV10',{
 *   byte1:['show longname in tooltip','no corpse','keep corpse','original class was fighter','original class was mage','original class was cleric','original class was thief','original class was druid',],
 *   byte2:['original class was ranger','fallen paladin','fallen ranger','exportable','hide injury status in tooltip','quest critical/affected by alternative damage','moving between areas','been in party',],
 *   byte3:['restore item in hand','un-sets bit 16',null,null,'prevent exploding death (bgee)',null,'do not apply nightmare mode modifiers (bgee)','no tooltip (bgee)',],
 *   byte4:['related to random walk (ea)','related to random walk (general)','related to random walk (race)','related to random walk (class)','related to random walk (specific)','related to random walk (gender)','related to random walk (alignment)','un-interruptable (memory only)',]
 * }).write();
 */
const flagsV10 = {
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
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

/* createGenerator().register().flags('statusV10',{
 *   byte1:['sleeping','berserk','panic','stunned','invisible','helpless','frozen_death','stone_death',],
 *   byte2:['exploding_death','flame_death','acid_death','dead','silenced','charmed','poisoned','hasted',],
 *   byte3:['slowed','infravision','blind','diseased','feebleminded','nondetection','improvedinvisibility','bless',],
 *   byte4:['chant','drawuponholymight','luck','aid','chantbad','blur','mirrorimage','confused',]
 * }).write();
 */
const statusV10 = {
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
type StatusV10 = typeof statusV10[keyof typeof statusV10];

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

/* createGenerator().register().flags('attributesV10',{
 *   byte1:['auto-calculate marker rectangle','translucent',null,null,'increment death variable counter (deathvariable_dead)','increment character type death counter','character type death counter modifier','increment faction death counter (kill_faction)',],
 *   byte2:['increment team death counter (kill_team)','invulnerable','increment good variable','increment law variable','increment lady variable','increment murder variable','do not face target during dialogue','turn all nearby creatures party-hostile when calling help()',],
 *   byte3:null,
 *   byte4:[null,null,null,null,null,null,'do not increment globals','area supplemental',]
 * }).write();
 */
const attributesV10 = {
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
type AttributesV10 = typeof attributesV10[keyof typeof attributesV10];

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

// from https://github.com/NearInfinityBrowser/NearInfinity/blob/cc7df10c635df788c8043be9e2fd87e39b2a1426/src/org/infinity/resource/cre/CreResource.java MAGE_TYPE_MAP
// it uses when the game has no magespec.ids
/* createGenerator().register().flags('defaultMageTypesV10',{
 *   byte1:[null,null,null,null,null,null,'abjurer','conjurer'],
 *   byte2:['diviner','enchanter','illusionist','invoker','necromancer','transmuter','generalist'],
 * }).write();
 */
const defaultMageTypesV10 = {
  // byte1
  // 0x1: unused
  // 0x2: unused
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  0x40: 'abjurer',
  0x80: 'conjurer',

  // byte2
  0x100: 'diviner',
  0x200: 'enchanter',
  0x400: 'illusionist',
  0x800: 'invoker',
  0x1000: 'necromancer',
  0x2000: 'transmuter',
  0x4000: 'generalist',
  // 0x8000: unused
} as const;
type DefaultMageTypesV10 = typeof defaultMageTypesV10[keyof typeof defaultMageTypesV10];

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

// TODO [snow]: see parseHeaderV10.ts todo
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

export const extendMap = {
  flags: extend(flagsV10),
  status: extend(statusV10),
  shieldFlags: extend(shieldFlagsV10),
  attributes: extend(attributesV10),
  sex: extend(sexV10),
  defaultMageTypes: extend(defaultMageTypesV10),
  specific: extend(specificV10),
  gender: extend(genderV10),
  objectIdsReferences: extend(objectIdsReferencesV10),
  alignment: extend(alignmentV10),
};
export type CreatureHeaderV10 = Readonly<{
  signature: 'cre';
  version: 'v1.0';
  nameRef: number;
  tooltipRef: number;
  flags: FlagsV10[];
  xpGainedForKilling: number;
  powerLevelOrXp: number;
  goldCarried: number;
  status: StatusV10[];
  currentHp: number;
  maximumHp: number;
  animationId: number;
  metalColourIndex: number;
  minorColourIndex: number;
  majorColourIndex: number;
  skinColourIndex: number;
  leatherColourIndex: number;
  armorColourIndex: number;
  hairColourIndex: number;
  effectVersion: number;
  smallPortrait: string;
  largePortrait: string;
  reputation: number;
  hideInShadows: number;
  naturalAc: number;
  effectiveAc: number;
  crushingAcModifier: number;
  missileAcModifier: number;
  piercingAcModifier: number;
  slashingAcModifier: number;
  thac0: number;
  numberOfAttacksPerRound: number;
  saveVersusDeath: number;
  saveVersusWands: number;
  saveVersusPolymorph: number;
  saveVersusBreath: number;
  saveVersusSpells: number;
  fireResistance: number;
  coldResistance: number;
  electricityResistance: number;
  acidResistance: number;
  magicResistance: number;
  magicFireResistance: number;
  magicColdResistance: number;
  slashingResistance: number;
  crushingResistance: number;
  piercingResistance: number;
  missileResistance: number;
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
  largeSwordProficiency: number;
  smallSwordProficiency: number;
  bowProficiency: number;
  spearProficiency: number;
  bluntProficiency: number;
  spikedProficiency: number;
  axeProficiency: number;
  missileProficiency: number;
  unusedProficiency1: number;
  unusedProficiency2: number;
  unusedProficiency3: number;
  unusedProficiency4: number;
  unusedProficiency5: number;
  unspentProficiencies: number;
  availableInventorySlotsCount: number;
  nightmareModeModifiersApplied: number;
  translucency: number;
  murderIncrementBy: number;
  turnUndeadLevel: number;
  tracking: number;
  currentThiefClassXp: Maybe<number>;
  currentMageClassXp: Maybe<number>;
  goodIncrementBy: Maybe<number>;
  lawIncrementBy: Maybe<number>;
  ladyIncrementBy: Maybe<number>;
  faction: Maybe<number>;
  team: Maybe<number>;
  species: Maybe<string>;
  dialogueActivationRange: Maybe<number>;
  collisionRadius: Maybe<number>;
  shieldFlags: Maybe<ShieldFlagsV10[]>;
  fieldOfVision: Maybe<number>;
  attributes: Maybe<AttributesV10[]>;
  initialMeetingSoundRef: number;
  moraleSoundRef: number;
  happySoundRef: number;
  unhappyAnnoyedSoundRef: number;
  unhappySeriousSoundRef: number;
  unhappyBreakingPointSoundRef: number;
  leaderSoundRef: number;
  tiredSoundRef: number;
  boredSoundRef: number;
  battleCry1SoundRef: number;
  battleCry2SoundRef: number;
  battleCry3SoundRef: number;
  battleCry4SoundRef: number;
  battleCry5SoundRef: number;
  attack1SoundRef: number;
  attack2SoundRef: number;
  attack3SoundRef: number;
  attack4SoundRef: number;
  damageSoundRef: number;
  dyingSoundRef: number;
  hurtSoundRef: number;
  areaForestSoundRef: number;
  areaCitySoundRef: number;
  areaDungeonSoundRef: number;
  areaDaySoundRef: number;
  areaNightSoundRef: number;
  selectCommon1SoundRef: number;
  selectCommon2SoundRef: number;
  selectCommon3SoundRef: number;
  selectCommon4SoundRef: number;
  selectCommon5SoundRef: number;
  selectCommon6SoundRef: number;
  selectAction1SoundRef: number;
  selectAction2SoundRef: number;
  selectAction3SoundRef: number;
  selectAction4SoundRef: number;
  selectAction5SoundRef: number;
  selectAction6SoundRef: number;
  selectAction7SoundRef: number;
  interaction1SoundRef: number;
  interaction2SoundRef: number;
  interaction3SoundRef: number;
  interaction4SoundRef: number;
  interaction5SoundRef: number;
  insult1SoundRef: number;
  insult2SoundRef: number;
  insult3SoundRef: number;
  compliment1SoundRef: number;
  compliment2SoundRef: number;
  compliment3SoundRef: number;
  special1SoundRef: number;
  special2SoundRef: number;
  special3SoundRef: number;
  reactToDieGeneralSoundRef: number;
  reactToDieSpecificSoundRef: number;
  responseToCompliment1SoundRef: number;
  responseToCompliment2SoundRef: number;
  responseToCompliment3SoundRef: number;
  responseToInsult1SoundRef: number;
  responseToInsult2SoundRef: number;
  responseToInsult3SoundRef: number;
  dialogHostileSoundRef: number;
  dialogDefaultSoundRef: number;
  selectRare1SoundRef: number;
  selectRare2SoundRef: number;
  criticalHitSoundRef: number;
  criticalMissSoundRef: number;
  targetImmuneSoundRef: number;
  inventoryFullSoundRef: number;
  pickedPicketSoundRef: number;
  hiddenInShadowsSoundRef: number;
  spellDisruptedSoundRef: number;
  setTrapSoundRef: number;
  existance4SoundRef: number;
  bioSoundRef: number;
  sound1Ref: number;
  sound2Ref: number;
  sound3Ref: number;
  sound4Ref: number;
  sound5Ref: number;
  sound6Ref: number;
  sound7Ref: number;
  sound8Ref: number;
  sound9Ref: number;
  sound10Ref: number;
  sound11Ref: number;
  sound12Ref: number;
  sound13Ref: number;
  sound14Ref: number;
  sound15Ref: number;
  sound16Ref: number;
  sound17Ref: number;
  sound18Ref: number;
  sound19Ref: number;
  sound20Ref: number;
  sound21Ref: number;
  sound22Ref: number;
  sound23Ref: number;
  sound24Ref: number;
  sound25Ref: number;
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
  racialEnemy: string;
  moraleRecoveryTime: number;
  deity: Maybe<string>;
  mageType: DefaultMageTypesV10[];
  overrideScriptRef: string;
  classScriptRef: string;
  raceScriptRef: string;
  generalScriptRef: string;
  defaultScriptRef: string;
  allegiance: string;
  general: string;
  race: string;
  theClass: string;
  specific: SpecificV10;
  gender: GenderV10;
  objectSpec1: string;
  objectSpec2: string;
  objectSpec3: string;
  objectSpec4: string;
  objectSpec5: string;
  alignment: AlignmentV10;
  globalIdentifier: number;
  localIdentifier: number;
  scriptName: Maybe<string>;
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
  dialogueRef: string;
}>;
