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

export type AbstractEffectV10 = Readonly<{
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

export type EffectOpCode0V10 = AbstractEffectV10 & Readonly<{
  opcode: 'acBonus'; acvalue: number; bonusTo: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode1V10 = AbstractEffectV10 & Readonly<{
  opcode: 'modifyAttacksPerRound'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode3V10 = AbstractEffectV10 & Readonly<{
  opcode: 'berserk'; /* unused4; */ berserkType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode6V10 = AbstractEffectV10 & Readonly<{
  opcode: 'charismaBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode7V10 = AbstractEffectV10 & Readonly<{
  opcode: 'setColor'; color: number; location: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode9V10 = AbstractEffectV10 & Readonly<{
  opcode: 'setColorGlowPulse'; color: number; location: number; cycleSpeed: number; /* unused8; */
  spe: number;
}>;
export type EffectOpCode10V10 = AbstractEffectV10 & Readonly<{
  opcode: 'consitutionBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode11V10 = AbstractEffectV10 & Readonly<{
  opcode: 'curePoison'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode12V10 = AbstractEffectV10 & Readonly<{
  opcode: 'damage'; amount: number; mode: number; damageType: number; /* unused8; */ flags: number;
}>;
export type EffectOpCode15V10 = AbstractEffectV10 & Readonly<{
  opcode: 'dexterityBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode16V10 = AbstractEffectV10 & Readonly<{
  opcode: 'haste'; /* unused4 */ hasteType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode17V10 = AbstractEffectV10 & Readonly<{
  opcode: 'currentHpBonus'; value: number; modifierType: number; healFlags: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode18V10 = AbstractEffectV10 & Readonly<{
  opcode: 'maximumHpBonus'; value: number; modifierType: number; /* unused8; */ mode: number;
}>;
export type EffectOpCode19V10 = AbstractEffectV10 & Readonly<{
  opcode: 'intelligenceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode20V10 = AbstractEffectV10 & Readonly<{
  opcode: 'invisibility'; /* unused4 */ invisibilityType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode21V10 = AbstractEffectV10 & Readonly<{
  opcode: 'loreBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode22V10 = AbstractEffectV10 & Readonly<{
  opcode: 'luckBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode23V10 = AbstractEffectV10 & Readonly<{
  opcode: 'moraleBonus'; /* unused4; */ /* unused4; */ /* unused8; */ mode: number;
}>;
export type EffectOpCode24V10 = AbstractEffectV10 & Readonly<{
  opcode: 'panic'; /* unused4; */ panicType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode25V10 = AbstractEffectV10 & Readonly<{
  opcode: 'poison'; amount: number; poisonType: number; /* unused8; */ icon: number;
}>;
export type EffectOpCode27V10 = AbstractEffectV10 & Readonly<{
  opcode: 'acidResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode28V10 = AbstractEffectV10 & Readonly<{
  opcode: 'coldResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode29V10 = AbstractEffectV10 & Readonly<{
  opcode: 'electricityResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode30V10 = AbstractEffectV10 & Readonly<{
  opcode: 'fireResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode33V10 = AbstractEffectV10 & Readonly<{
  opcode: 'saveVsDeathBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode34V10 = AbstractEffectV10 & Readonly<{
  opcode: 'saveVsWandBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode35V10 = AbstractEffectV10 & Readonly<{
  opcode: 'saveVsPolymorphBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode36V10 = AbstractEffectV10 & Readonly<{
  opcode: 'saveVsBreathBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode37V10 = AbstractEffectV10 & Readonly<{
  opcode: 'saveVsSpellBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode38V10 = AbstractEffectV10 & Readonly<{
  opcode: 'silence'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode41V10 = AbstractEffectV10 & Readonly<{
  opcode: 'sparkle'; amount: number; particleEffect: number; resource: string; spe: number;
}>;
export type EffectOpCode42V10 = AbstractEffectV10 & Readonly<{
  opcode: 'bonusWizardSpell'; amountSpellsToAdd: number; spellLevels: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode44V10 = AbstractEffectV10 & Readonly<{
  opcode: 'strengthBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode45V10 = AbstractEffectV10 & Readonly<{
  opcode: 'stun'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode49V10 = AbstractEffectV10 & Readonly<{
  opcode: 'wisdomBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode54V10 = AbstractEffectV10 & Readonly<{
  opcode: 'baseThac0Bonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode59V10 = AbstractEffectV10 & Readonly<{
  opcode: 'moveSilentlyBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode62V10 = AbstractEffectV10 & Readonly<{
  opcode: 'bonusPriestSpell'; amountSpellsToAdd: number; spellLevels: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode65V10 = AbstractEffectV10 & Readonly<{
  opcode: 'blur'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode66V10 = AbstractEffectV10 & Readonly<{
  opcode: 'translucency'; fadeAmount: number; visualEffect: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode73V10 = AbstractEffectV10 & Readonly<{
  opcode: 'attackDamageBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode74V10 = AbstractEffectV10 & Readonly<{
  opcode: 'blindness'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode83V10 = AbstractEffectV10 & Readonly<{
  opcode: 'immunityToProjectile'; /* unused4; */ projectile: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode84V10 = AbstractEffectV10 & Readonly<{
  opcode: 'magicalFireResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode85V10 = AbstractEffectV10 & Readonly<{
  opcode: 'magicalColdResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode86V10 = AbstractEffectV10 & Readonly<{
  opcode: 'slashingResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode87V10 = AbstractEffectV10 & Readonly<{
  opcode: 'crushingResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode88V10 = AbstractEffectV10 & Readonly<{
  opcode: 'piercingResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode89V10 = AbstractEffectV10 & Readonly<{
  opcode: 'missileResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode90V10 = AbstractEffectV10 & Readonly<{
  opcode: 'openLockBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode91V10 = AbstractEffectV10 & Readonly<{
  opcode: 'findTrapBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode92V10 = AbstractEffectV10 & Readonly<{
  opcode: 'pickPocketBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode93V10 = AbstractEffectV10 & Readonly<{
  opcode: 'fatigueBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode94V10 = AbstractEffectV10 & Readonly<{
  opcode: 'intoxicationBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode97V10 = AbstractEffectV10 & Readonly<{
  opcode: 'exceptionalStrengthBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode98V10 = AbstractEffectV10 & Readonly<{
  opcode: 'regeneration'; value: number; regenerationType: number; /* unused8; */ icon: number;
}>;
export type EffectOpCode101V10 = AbstractEffectV10 & Readonly<{
  opcode: 'immunityToEffect'; /* unused4; */ effect: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode104V10 = AbstractEffectV10 & Readonly<{
  opcode: 'xpBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode105V10 = AbstractEffectV10 & Readonly<{
  opcode: 'removeGold'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode106V10 = AbstractEffectV10 & Readonly<{
  opcode: 'moraleBreak'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode109V10 = AbstractEffectV10 & Readonly<{
  opcode: 'paralyze'; idsValue: number; idsTarget: number; /* unused8; */ effect: number;
}>;
export type EffectOpCode120V10 = AbstractEffectV10 & Readonly<{
  opcode: 'immunityToWeapons'; maximumEnchantment: number; weaponType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode128V10 = AbstractEffectV10 & Readonly<{
  opcode: 'confusion'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode138V10 = AbstractEffectV10 & Readonly<{
  opcode: 'setAnimationSequence'; /* unused4; */ sequence: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode146V10 = AbstractEffectV10 & Readonly<{
  opcode: 'castSpell'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type EffectOpCode147V10 = AbstractEffectV10 & Readonly<{
  opcode: 'learnSpell'; /* unused4; */ /* unused4; */ resource: string; spe: number;
}>;
export type EffectOpCode148V10 = AbstractEffectV10 & Readonly<{
  opcode: 'castSpellAtPoint'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type EffectOpCode159V10 = AbstractEffectV10 & Readonly<{
  opcode: 'mirrorImageEffect'; imagesCount: number; /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode161V10 = AbstractEffectV10 & Readonly<{
  opcode: 'removeFear'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode166V10 = AbstractEffectV10 & Readonly<{
  opcode: 'magicResistanceBonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode169V10 = AbstractEffectV10 & Readonly<{
  opcode: 'preventPortraitIcon'; /* unused4; */ icon: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode173V10 = AbstractEffectV10 & Readonly<{
  opcode: 'poisonResistanceBonus'; value: number; /* unused4; */ /* unused8; */ spe: number; }>;
export type EffectOpCode174V10 = AbstractEffectV10 & Readonly<{
  opcode: 'playSound'; /* unused4; */ /* unused4; */ resource: string; spe: number;
}>;
export type EffectOpCode206V10 = AbstractEffectV10 & Readonly<{
  opcode: 'protectionmFromSpell'; stringRef: number; stringTlk: string; /* unused4; */ resource: string; spe: number;
}>;
export type EffectOpCode208V10 = AbstractEffectV10 & Readonly<{
  opcode: 'minimumHp'; hpAmount: number; /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode215V10 = AbstractEffectV10 & Readonly<{
  opcode: 'playVisualEffect'; /* unused4; */ playwhere: number; resource: string; spe: number;
}>;
export type EffectOpCode267V10 = AbstractEffectV10 & Readonly<{
  opcode: 'disableDisplayString'; stringRef: number; stringTlk: string; /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode269V10 = AbstractEffectV10 & Readonly<{
  opcode: 'shakeScreen'; strength: number; /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode278V10 = AbstractEffectV10 & Readonly<{
  opcode: 'thac0Bonus'; value: number; modifierType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode296V10 = AbstractEffectV10 & Readonly<{
  opcode: 'immunityToSpecificAnimation'; /* unused4; */ /* unused4; */ resource: string; spe: number;
}>;
export type EffectOpCode297V10 = AbstractEffectV10 & Readonly<{
  opcode: 'immunityToTurnUndead'; /* unused4; */ statValue: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode301V10 = AbstractEffectV10 & Readonly<{
  opcode: 'criticalHitBonus'; value: number; condition: number; /* unused8; */ attackType: number;
}>;
export type EffectOpCode319V10 = AbstractEffectV10 & Readonly<{
  opcode: 'restrictItem'; /* unused4; */ idsTarget: number; /* unused8; */ descriptionNoteRef: number; descriptionNoteTlk: string;
}>;
export type EffectOpCode354V10 = AbstractEffectV10 & Readonly<{
  opcode: 'flashScreen'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode355V10 = AbstractEffectV10 & Readonly<{
  opcode: 'soulExodus'; /* unused4; */ /* unused4; */ /* unused8; */ spe: number;
}>;
export type EffectOpCode369V10 = AbstractEffectV10 & Readonly<{
  opcode: 'playBamFile'; color: number; method: number; resource: string; spe: number;
}>;
export type EffectOpCode380V10 = AbstractEffectV10 & Readonly<{
  opcode: 'embalm'; /* unused4; */ embalmingType: number; /* unused8; */ spe: number;
}>;
export type EffectOpCode383V10 = AbstractEffectV10 & Readonly<{
  opcode: 'hitPointTransfer'; amount: number; direction: number; damageType: number; /* unused8; */
  spe: number;
}>;

export type EffectV10
  = | EffectOpCode0V10
    | EffectOpCode1V10
    | EffectOpCode3V10
    | EffectOpCode6V10
    | EffectOpCode7V10
    | EffectOpCode9V10
    | EffectOpCode10V10
    | EffectOpCode11V10
    | EffectOpCode12V10
    | EffectOpCode15V10
    | EffectOpCode16V10
    | EffectOpCode17V10
    | EffectOpCode18V10
    | EffectOpCode19V10
    | EffectOpCode20V10
    | EffectOpCode21V10
    | EffectOpCode22V10
    | EffectOpCode23V10
    | EffectOpCode24V10
    | EffectOpCode25V10
    | EffectOpCode27V10
    | EffectOpCode28V10
    | EffectOpCode29V10
    | EffectOpCode30V10
    | EffectOpCode33V10
    | EffectOpCode34V10
    | EffectOpCode35V10
    | EffectOpCode36V10
    | EffectOpCode37V10
    | EffectOpCode38V10
    | EffectOpCode41V10
    | EffectOpCode42V10
    | EffectOpCode44V10
    | EffectOpCode45V10
    | EffectOpCode49V10
    | EffectOpCode54V10
    | EffectOpCode59V10
    | EffectOpCode62V10
    | EffectOpCode65V10
    | EffectOpCode66V10
    | EffectOpCode73V10
    | EffectOpCode74V10
    | EffectOpCode83V10
    | EffectOpCode84V10
    | EffectOpCode85V10
    | EffectOpCode86V10
    | EffectOpCode87V10
    | EffectOpCode88V10
    | EffectOpCode89V10
    | EffectOpCode90V10
    | EffectOpCode91V10
    | EffectOpCode92V10
    | EffectOpCode93V10
    | EffectOpCode94V10
    | EffectOpCode97V10
    | EffectOpCode98V10
    | EffectOpCode101V10
    | EffectOpCode104V10
    | EffectOpCode105V10
    | EffectOpCode106V10
    | EffectOpCode109V10
    | EffectOpCode120V10
    | EffectOpCode128V10
    | EffectOpCode138V10
    | EffectOpCode146V10
    | EffectOpCode147V10
    | EffectOpCode148V10
    | EffectOpCode159V10
    | EffectOpCode161V10
    | EffectOpCode166V10
    | EffectOpCode169V10
    | EffectOpCode173V10
    | EffectOpCode174V10
    | EffectOpCode206V10
    | EffectOpCode208V10
    | EffectOpCode215V10
    | EffectOpCode267V10
    | EffectOpCode269V10
    | EffectOpCode278V10
    | EffectOpCode296V10
    | EffectOpCode297V10
    | EffectOpCode301V10
    | EffectOpCode319V10
    | EffectOpCode354V10
    | EffectOpCode355V10
    | EffectOpCode369V10
    | EffectOpCode380V10
    | EffectOpCode383V10
;
