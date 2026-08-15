import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().enum("opcodeV10",
 * 0: ['acBonus'],
 * 1: ['modifyAttacksPerRound'],
 * 3: ['berserk'],
 * 6: ['charismaBonus'],
 * 7: ['setColor'],
 * 9: ['setColorGlowPulse'],
 * 10: ['consitutionBonus'],
 * 11: ['curePoison'],
 * 12: ['damage'],
 * 15: ['dexterityBonus'],
 * 16: ['haste'],
 * 17: ['currentHpBonus'],
 * 18: ['maximumHpBonus'],
 * 19: ['intelligenceBonus'],
 * 20: ['invisibility'],
 * 21: ['loreBonus'],
 * 22: ['luckBonus'],
 * 23: ['moraleBonus'],
 * 24: ['panic'],
 * 25: ['poison'],
 * 27: ['acidResistanceBonus'],
 * 28: ['coldResistanceBonus'],
 * 29: ['electricityResistanceBonus'],
 * 30: ['fireResistanceBonus'],
 * 33: ['saveVsDeathBonus'],
 * 34: ['saveVsWandBonus'],
 * 35: ['saveVsPolymorphBonus'],
 * 36: ['saveVsBreathBonus'],
 * 37: ['saveVsSpellBonus'],
 * 38: ['silence'],
 * 41: ['sparkle'],
 * 42: ['bonusWizardSpell'],
 * 44: ['strengthBonus'],
 * 45: ['stun'],
 * 49: ['wisdomBonus'],
 * 54: ['baseThac0Bonus'],
 * 59: ['moveSilentlyBonus'],
 * 62: ['bonusPriestSpell'],
 * 65: ['blur'],
 * 66: ['translucency'],
 * 73: ['attackDamageBonus'],
 * 74: ['blindness'],
 * 83: ['immunityToProjectile'],
 * 84: ['magicalFireResistanceBonus'],
 * 85: ['magicalColdResistanceBonus'],
 * 86: ['slashingResistanceBonus'],
 * 87: ['crushingResistanceBonus'],
 * 88: ['piercingResistanceBonus'],
 * 89: ['missileResistanceBonus'],
 * 90: ['openLockBonus'],
 * 91: ['findTrapBonus'],
 * 92: ['pickPocketBonus'],
 * 93: ['fatigueBonus'],
 * 94: ['intoxicationBonus'],
 * 97: ['exceptionalStrengthBonus'],
 * 98: ['regeneration'],
 * 101: ['immunityToEffect'],
 * 104: ['xpBonus'],
 * 105: ['removeGold'],
 * 106: ['moraleBreak'],
 * 109: ['paralyze'],
 * 120: ['immunityToWeapons'],
 * 128: ['confusion'],
 * 138: ['setAnimationSequence'],
 * 146: ['castSpell'],
 * 147: ['learnSpell'],
 * 148: ['castSpellAtPoint'],
 * 159: ['mirrorImageEffect'],
 * 161: ['removeFear'],
 * 166: ['magicResistanceBonus'],
 * 169: ['preventPortraitIcon'],
 * 173: ['poisonResistanceBonus'],
 * 174: ['playSound'],
 * 206: ['protectionmFromSpell'],
 * 208: ['minimumHp'],
 * 215: ['playVisualEffect'],
 * 267: ['disableDisplayString'],
 * 269: ['shakeScreen'],
 * 278: ['thac0Bonus'],
 * 296: ['immunityToSpecificAnimation'],
 * 297: ['immunityToTurnUndead'],
 * 301: ['criticalHitBonus'],
 * 319: ['restrictItem'],
 * 354: ['flashScreen'],
 * 355: ['soulExodus'],
 * 369: ['playBamFile'],
 * 380: ['embalm'],
 * 383: ['hitPointTransfer'],
 * ).write();
 */
const opcodeV10 = {
  0: 'acBonus',
  1: 'modifyAttacksPerRound',
  3: 'berserk',
  6: 'charismaBonus',
  7: 'setColor',
  9: 'setColorGlowPulse',
  10: 'consitutionBonus',
  11: 'curePoison',
  12: 'damage',
  15: 'dexterityBonus',
  16: 'haste',
  17: 'currentHpBonus',
  18: 'maximumHpBonus',
  19: 'intelligenceBonus',
  20: 'invisibility',
  21: 'loreBonus',
  22: 'luckBonus',
  23: 'moraleBonus',
  24: 'panic',
  25: 'poison',
  27: 'acidResistanceBonus',
  28: 'coldResistanceBonus',
  29: 'electricityResistanceBonus',
  30: 'fireResistanceBonus',
  33: 'saveVsDeathBonus',
  34: 'saveVsWandBonus',
  35: 'saveVsPolymorphBonus',
  36: 'saveVsBreathBonus',
  37: 'saveVsSpellBonus',
  38: 'silence',
  41: 'sparkle',
  42: 'bonusWizardSpell',
  44: 'strengthBonus',
  45: 'stun',
  49: 'wisdomBonus',
  54: 'baseThac0Bonus',
  59: 'moveSilentlyBonus',
  62: 'bonusPriestSpell',
  65: 'blur',
  66: 'translucency',
  73: 'attackDamageBonus',
  74: 'blindness',
  83: 'immunityToProjectile',
  84: 'magicalFireResistanceBonus',
  85: 'magicalColdResistanceBonus',
  86: 'slashingResistanceBonus',
  87: 'crushingResistanceBonus',
  88: 'piercingResistanceBonus',
  89: 'missileResistanceBonus',
  90: 'openLockBonus',
  91: 'findTrapBonus',
  92: 'pickPocketBonus',
  93: 'fatigueBonus',
  94: 'intoxicationBonus',
  97: 'exceptionalStrengthBonus',
  98: 'regeneration',
  101: 'immunityToEffect',
  104: 'xpBonus',
  105: 'removeGold',
  106: 'moraleBreak',
  109: 'paralyze',
  120: 'immunityToWeapons',
  128: 'confusion',
  138: 'setAnimationSequence',
  146: 'castSpell',
  147: 'learnSpell',
  148: 'castSpellAtPoint',
  159: 'mirrorImageEffect',
  161: 'removeFear',
  166: 'magicResistanceBonus',
  169: 'preventPortraitIcon',
  173: 'poisonResistanceBonus',
  174: 'playSound',
  206: 'protectionmFromSpell',
  208: 'minimumHp',
  215: 'playVisualEffect',
  267: 'disableDisplayString',
  269: 'shakeScreen',
  278: 'thac0Bonus',
  296: 'immunityToSpecificAnimation',
  297: 'immunityToTurnUndead',
  301: 'criticalHitBonus',
  319: 'restrictItem',
  354: 'flashScreen',
  355: 'soulExodus',
  369: 'playBamFile',
  380: 'embalm',
  383: 'hitPointTransfer',
} as const;
type OpcodeV10 = typeof opcodeV10[keyof typeof opcodeV10];

/* createGenerator().register().enum("targetTypeV10",
 *   ['none','self (pre-projectile)','pre-target','party','everyone (inc. party)','everyone (excl. party)',]
 * ).write();
 */
const targetV10 = {
  0: 'none',
  1: 'self (pre-projectile)',
  2: 'pre-target',
  3: 'party',
  4: 'everyone (inc. party)',
  5: 'everyone (excl. party)',
} as const;
type TargetV10 = typeof targetV10[keyof typeof targetV10];

/* createGenerator().register().enum("timingModeV10", {
 *   0: ['duration','permanent','while equipped','delayed duration','delayed','delayed (transforms to 8)','duration?','permanent?','permanent (unsaved)','permanent (after death)','trigger'],
 *   4096: ['absolute duration']
 * }).write();
 */
const timingModeV10 = {
  0: 'duration',
  1: 'permanent',
  2: 'while equipped',
  3: 'delayed duration',
  4: 'delayed',
  5: 'delayed (transforms to 8)',
  6: 'duration?',
  7: 'permanent?',
  8: 'permanent (unsaved)',
  9: 'permanent (after death)',
  10: 'trigger',
  4096: 'absolute duration',
} as const;
type TimingModeV10 = typeof timingModeV10[keyof typeof timingModeV10];

/* createGenerator().register().enum("resistanceV10",
 *   ['nonmagical','can be dispelled/affected by resistance','cannot be dispelled/ignores resistance','can be dispelled/ignores resistance',]
 * ).write();
 */
const dispelOrResistanceV10 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type DispelOrResistanceV10 = typeof dispelOrResistanceV10[keyof typeof dispelOrResistanceV10];

/* createGenerator().register().flags("savingThrowTypeV10", {
 *   byte1: ['spells','breathe','death','wands','polymorph',]
 * }).write();
 */
const savingThrowTypeV10 = {
  // byte1
  0x1: 'spells',
  0x2: 'breathe',
  0x4: 'death',
  0x8: 'wands',
  0x10: 'polymorph',
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type SavingThrowTypeV10 = typeof savingThrowTypeV10[keyof typeof savingThrowTypeV10];

export const extendMap = {
  opcode: extend(opcodeV10),
  target: extend(targetV10),
  timingMode: extend(timingModeV10),
  dispelOrResistance: extend(dispelOrResistanceV10),
  savingThrowType: extend(savingThrowTypeV10),
};

export type RawItmAbstractEffectV10 = Readonly<{
  target: TargetV10;
  power: number;
  // custom1
  // custom2
  timingMode: TimingModeV10;
  dispelOrResistance: DispelOrResistanceV10;
  duration: number;
  probability1: number;
  probability2: number;
  // resource
  diceThrownCountOrMaximumLevel: number;
  diceSidesOrMinimumLevel: number;
  savingThrowType: SavingThrowTypeV10[];
  savingThrowBonus: number;
  // custom3
}>;

export type RawItmEffectOpCode0V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'acBonus'; acvalue: number; bonusTo: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode1V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'modifyAttacksPerRound'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode3V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'berserk'; /* unused4; */ berserkType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode6V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'charismaBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode7V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'setColor'; color: number; location: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode9V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'setColorGlowPulse'; color: number; location: number; cycleSpeed: number; /* unused8; */
  spe: number;
}>;
export type RawItmEffectOpCode10V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'consitutionBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode11V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'curePoison'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode12V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'damage'; amount: number; mode: number; damageType: number; /* unused8; */ flags: number;
}>;
export type RawItmEffectOpCode15V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'dexterityBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode16V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'haste'; /* unused4 */ hasteType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode17V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'currentHpBonus'; value: number; modifierType: number; healFlags: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode18V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'maximumHpBonus'; value: number; modifierType: number; /* unused8; */ mode: number;
}>;
export type RawItmEffectOpCode19V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'intelligenceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode20V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'invisibility'; /* unused4 */ invisibilityType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode21V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'loreBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode22V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'luckBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode23V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'moraleBonus'; /* unused4; */ /* unused4; */ /* unused8; */ mode: number;
}>;
export type RawItmEffectOpCode24V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'panic'; /* unused4; */ panicType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode25V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'poison'; amount: number; poisonType: number; /* unused8; */ icon: number;
}>;
export type RawItmEffectOpCode27V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'acidResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode28V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'coldResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode29V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'electricityResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode30V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'fireResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode33V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'saveVsDeathBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode34V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'saveVsWandBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode35V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'saveVsPolymorphBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode36V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'saveVsBreathBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode37V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'saveVsSpellBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode38V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'silence'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode41V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'sparkle'; amount: number; particleEffect: number; resource: string; spe: number;
}>;
export type RawItmEffectOpCode42V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'bonusWizardSpell'; amountSpellsToAdd: number; spellLevels: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode44V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'strengthBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode45V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'stun'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode49V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'wisdomBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode54V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'baseThac0Bonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode59V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'moveSilentlyBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode62V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'bonusPriestSpell'; amountSpellsToAdd: number; spellLevels: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode65V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'blur'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode66V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'translucency'; fadeAmount: number; visualEffect: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode73V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'attackDamageBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode74V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'blindness'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode83V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'immunityToProjectile'; /* unused4; */ projectile: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode84V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'magicalFireResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode85V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'magicalColdResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode86V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'slashingResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode87V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'crushingResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode88V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'piercingResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode89V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'missileResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode90V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'openLockBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode91V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'findTrapBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode92V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'pickPocketBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode93V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'fatigueBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode94V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'intoxicationBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode97V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'exceptionalStrengthBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode98V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'regeneration'; value: number; regenerationType: number; /* unused8; */ icon: number;
}>;
export type RawItmEffectOpCode101V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'immunityToEffect'; /* unused4; */ effect: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode104V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'xpBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode105V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'removeGold'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode106V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'moraleBreak'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode109V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'paralyze'; idsValue: number; idsTarget: number; /* unused8; */ effect: number;
}>;
export type RawItmEffectOpCode120V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'immunityToWeapons'; maximumEnchantment: number; weaponType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode128V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'confusion'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode138V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'setAnimationSequence'; /* unused4; */ sequence: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode146V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'castSpell'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type RawItmEffectOpCode147V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'learnSpell'; /* unused4; */ /* unused4; */ resource: string; spe: number;
}>;
export type RawItmEffectOpCode148V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'castSpellAtPoint'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type RawItmEffectOpCode159V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'mirrorImageEffect'; imagesCount: number; /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode161V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'removeFear'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode166V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'magicResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode169V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'preventPortraitIcon'; /* unused4; */ icon: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode173V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'poisonResistanceBonus'; value: number; /* unused4; */ /* unused8; */ spe: number; }>;
export type RawItmEffectOpCode174V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'playSound'; /* unused4; */ /* unused4; */ resource: string; spe: number;
}>;
export type RawItmEffectOpCode206V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'protectionmFromSpell'; stringRef: number; stringTlk: string; /* unused4; */ resource: string; spe: number;
}>;
export type RawItmEffectOpCode208V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'minimumHp'; hpAmount: number; /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode215V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'playVisualEffect'; /* unused4; */ playwhere: number; resource: string; spe: number;
}>;
export type RawItmEffectOpCode267V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'disableDisplayString'; stringRef: number; stringTlk: string; /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode269V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'shakeScreen'; strength: number; /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode278V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'thac0Bonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode296V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'immunityToSpecificAnimation'; /* unused4; */ /* unused4; */ resource: string; spe: number;
}>;
export type RawItmEffectOpCode297V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'immunityToTurnUndead'; /* unused4; */ statValue: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode301V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'criticalHitBonus'; value: number; condition: number; /* unused8; */ attackType: number;
}>;
export type RawItmEffectOpCode319V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'restrictItem'; /* unused4; */ idsTarget: number; /* unused8; */ descriptionNoteRef: number; descriptionNoteTlk: string;
}>;
export type RawItmEffectOpCode354V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'flashScreen'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode355V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'soulExodus'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode369V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'playBamFile'; color: number; method: number; resource: string; spe: number;
}>;
export type RawItmEffectOpCode380V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'embalm'; /* unused4; */ embalmingType: number; /* unused8; */ spe: number;
}>;
export type RawItmEffectOpCode383V10 = RawItmAbstractEffectV10 & Readonly<{
  opcode: 'hitPointTransfer'; amount: number; direction: number; damageType: number; /* unused8; */
  spe: number;
}>;

export type RawItmEffectV10
  = | RawItmEffectOpCode0V10
    | RawItmEffectOpCode1V10
    | RawItmEffectOpCode3V10
    | RawItmEffectOpCode6V10
    | RawItmEffectOpCode7V10
    | RawItmEffectOpCode9V10
    | RawItmEffectOpCode10V10
    | RawItmEffectOpCode11V10
    | RawItmEffectOpCode12V10
    | RawItmEffectOpCode15V10
    | RawItmEffectOpCode16V10
    | RawItmEffectOpCode17V10
    | RawItmEffectOpCode18V10
    | RawItmEffectOpCode19V10
    | RawItmEffectOpCode20V10
    | RawItmEffectOpCode21V10
    | RawItmEffectOpCode22V10
    | RawItmEffectOpCode23V10
    | RawItmEffectOpCode24V10
    | RawItmEffectOpCode25V10
    | RawItmEffectOpCode27V10
    | RawItmEffectOpCode28V10
    | RawItmEffectOpCode29V10
    | RawItmEffectOpCode30V10
    | RawItmEffectOpCode33V10
    | RawItmEffectOpCode34V10
    | RawItmEffectOpCode35V10
    | RawItmEffectOpCode36V10
    | RawItmEffectOpCode37V10
    | RawItmEffectOpCode38V10
    | RawItmEffectOpCode41V10
    | RawItmEffectOpCode42V10
    | RawItmEffectOpCode44V10
    | RawItmEffectOpCode45V10
    | RawItmEffectOpCode49V10
    | RawItmEffectOpCode54V10
    | RawItmEffectOpCode59V10
    | RawItmEffectOpCode62V10
    | RawItmEffectOpCode65V10
    | RawItmEffectOpCode66V10
    | RawItmEffectOpCode73V10
    | RawItmEffectOpCode74V10
    | RawItmEffectOpCode83V10
    | RawItmEffectOpCode84V10
    | RawItmEffectOpCode85V10
    | RawItmEffectOpCode86V10
    | RawItmEffectOpCode87V10
    | RawItmEffectOpCode88V10
    | RawItmEffectOpCode89V10
    | RawItmEffectOpCode90V10
    | RawItmEffectOpCode91V10
    | RawItmEffectOpCode92V10
    | RawItmEffectOpCode93V10
    | RawItmEffectOpCode94V10
    | RawItmEffectOpCode97V10
    | RawItmEffectOpCode98V10
    | RawItmEffectOpCode101V10
    | RawItmEffectOpCode104V10
    | RawItmEffectOpCode105V10
    | RawItmEffectOpCode106V10
    | RawItmEffectOpCode109V10
    | RawItmEffectOpCode120V10
    | RawItmEffectOpCode128V10
    | RawItmEffectOpCode138V10
    | RawItmEffectOpCode146V10
    | RawItmEffectOpCode147V10
    | RawItmEffectOpCode148V10
    | RawItmEffectOpCode159V10
    | RawItmEffectOpCode161V10
    | RawItmEffectOpCode166V10
    | RawItmEffectOpCode169V10
    | RawItmEffectOpCode173V10
    | RawItmEffectOpCode174V10
    | RawItmEffectOpCode206V10
    | RawItmEffectOpCode208V10
    | RawItmEffectOpCode215V10
    | RawItmEffectOpCode267V10
    | RawItmEffectOpCode269V10
    | RawItmEffectOpCode278V10
    | RawItmEffectOpCode296V10
    | RawItmEffectOpCode297V10
    | RawItmEffectOpCode301V10
    | RawItmEffectOpCode319V10
    | RawItmEffectOpCode354V10
    | RawItmEffectOpCode355V10
    | RawItmEffectOpCode369V10
    | RawItmEffectOpCode380V10
    | RawItmEffectOpCode383V10
;
