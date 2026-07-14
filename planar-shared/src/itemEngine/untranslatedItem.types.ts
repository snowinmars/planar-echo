import type { Maybe } from '../maybe.js';

export type UntranslatedItem = Readonly<{
  version: 'v10';
  dropSound: Maybe<string>;
  flags: string[];
  category: string;
  unusableBy: string[];
  equippedAppearance: string;
  minLevel: number;
  minStrength: number;
  minStrengthBonus: number;
  kitUsability1: string[];
  minIntelligence: number;
  kitUsability2: string[];
  minDexterity: number;
  kitUsability3: string[];
  minWisdom: number;
  kitUsability4: string[];
  minConstitution: number;
  weaponProficiency: string;
  minCharisma: number;
  price: number;
  maxInStack: number;
  inventoryIcon: string;
  loreToId: number;
  groundIcon: string;
  weight: number;
  pickupSound: string;
  enchantment: number;
  abilities: UntranslatedAbility[];
  effects: UntranslatedEffect[];
}>;

export type UntranslatedAbility = Readonly<{
  attackType: string;
  typeFlags: string[];
  abilityLocation: string;
  alternativeDiceSides: number;
  useIcon: string;
  targetType: string;
  targetCount: number;
  range: number;
  projectileType: string;
  alternativeDiceThrown: number;
  speed: number;
  alternativeDamageBonus: number;
  thac0bonus: number;
  diceSides: number;
  primaryType: number;
  diceThrown: number;
  secondaryType: number;
  damageBonus: number;
  damageType: string;
  countOfEffects: number;
  firstEffectIndex: number;
  charges: number;
  chargeDepletionBehaviour: string;
  flags: string[];
  projectileAnimation: number;
  overhandSwingAnimation: number;
  backhandSwingAnimation: number;
  thrustAnimation: number;
  isArrow: number;
  isBolt: number;
  isBullet: number;
  effects: UntranslatedEffect[];
}>;

type BaseUntranslatedEffect = Readonly<{
  target: string;
  power: number;
  timingMode: string;
  dispelOrResistance: string;
  duration: number;
  probability1: number;
  probability2: number;
  diceThrownCountOrMaximumLevel: number;
  diceSidesOrMinimumLevel: number;
  savingThrowType: string[];
  savingThrowBonus: number;
}>;

export type UntranslatedUntranExtensionslatedEffe_AcBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'acBonus'; acvalue: number; bonusTo: number; spe: number;
}>;
export type UntranslatedEffe_MExtensionodifyAttacksPerRound = BaseUntranslatedEffect & Readonly<{
  opcode: 'modifyAttacksPerRound'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffe_BExtensionerserk = BaseUntranslatedEffect & Readonly<{
  opcode: 'berserk'; berserkType: number; spe: number;
}>;
export type UntranslatedEffe_CExtensionharismaBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'charismaBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffe_SExtensionetColor = BaseUntranslatedEffect & Readonly<{
  opcode: 'setColor'; color: number; location: number; spe: number;
}>;
export type UntranslatedEffe_SExtensionetColorGlowPulse = BaseUntranslatedEffect & Readonly<{
  opcode: 'setColorGlowPulse'; color: number; location: number; cycleSpeed: number;
  spe: number;
}>;
export type UntranslatedEffec_ExtensionConsitutionBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'consitutionBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionCurePoison = BaseUntranslatedEffect & Readonly<{
  opcode: 'curePoison'; spe: number;
}>;
export type UntranslatedEffec_ExtensionDamage = BaseUntranslatedEffect & Readonly<{
  opcode: 'damage'; amount: number; mode: number; damageType: number; flags: number;
}>;
export type UntranslatedEffec_ExtensionDexterityBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'dexterityBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionHaste = BaseUntranslatedEffect & Readonly<{
  opcode: 'haste'; hasteType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionCurrentHpBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'currentHpBonus'; value: number; modifierType: number; healFlags: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionMaximumHpBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'maximumHpBonus'; value: number; modifierType: number; mode: number;
}>;
export type UntranslatedEffec_ExtensionIntelligenceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'intelligenceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionInvisibility = BaseUntranslatedEffect & Readonly<{
  opcode: 'invisibility'; invisibilityType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionLoreBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'loreBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionLuckBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'luckBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionMoraleBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'moraleBonus'; mode: number;
}>;
export type UntranslatedEffec_ExtensionPanic = BaseUntranslatedEffect & Readonly<{
  opcode: 'panic'; panicType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionPoison = BaseUntranslatedEffect & Readonly<{
  opcode: 'poison'; amount: number; poisonType: number; icon: number;
}>;
export type UntranslatedEffec_ExtensionAcidResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'acidResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionColdResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'coldResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionElectricityResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'electricityResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionFireResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'fireResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSaveVsDeathBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'saveVsDeathBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSaveVsWandBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'saveVsWandBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSaveVsPolymorphBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'saveVsPolymorphBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSaveVsBreathBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'saveVsBreathBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSaveVsSpellBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'saveVsSpellBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSilence = BaseUntranslatedEffect & Readonly<{
  opcode: 'silence'; spe: number;
}>;
export type UntranslatedEffec_ExtensionSparkle = BaseUntranslatedEffect & Readonly<{
  opcode: 'sparkle'; amount: number; particleEffect: number; resource: string; spe: number;
}>;
export type UntranslatedEffec_ExtensionBonusWizardSpell = BaseUntranslatedEffect & Readonly<{
  opcode: 'bonusWizardSpell'; amountSpellsToAdd: number; spellLevels: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionStrengthBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'strengthBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionStun = BaseUntranslatedEffect & Readonly<{
  opcode: 'stun'; spe: number;
}>;
export type UntranslatedEffec_ExtensionWisdomBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'wisdomBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionBaseThac0Bonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'baseThac0Bonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionMoveSilentlyBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'moveSilentlyBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionBonusPriestSpell = BaseUntranslatedEffect & Readonly<{
  opcode: 'bonusPriestSpell'; amountSpellsToAdd: number; spellLevels: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionBlur = BaseUntranslatedEffect & Readonly<{
  opcode: 'blur'; spe: number;
}>;
export type UntranslatedEffec_ExtensionTranslucency = BaseUntranslatedEffect & Readonly<{
  opcode: 'translucency'; fadeAmount: number; visualEffect: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionAttackDamageBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'attackDamageBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionBlindness = BaseUntranslatedEffect & Readonly<{
  opcode: 'blindness'; spe: number;
}>;
export type UntranslatedEffec_ExtensionImmunityToProjectile = BaseUntranslatedEffect & Readonly<{
  opcode: 'immunityToProjectile'; projectile: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionMagicalFireResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'magicalFireResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionMagicalColdResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'magicalColdResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionSlashingResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'slashingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionCrushingResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'crushingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionPiercingResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'piercingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionMissileResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'missileResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionOpenLockBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'openLockBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionFindTrapBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'findTrapBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionPickPocketBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'pickPocketBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionFatigueBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'fatigueBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionIntoxicationBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'intoxicationBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionExceptionalStrengthBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'exceptionalStrengthBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffec_ExtensionRegeneration = BaseUntranslatedEffect & Readonly<{
  opcode: 'regeneration'; value: number; regenerationType: number; icon: number;
}>;
export type UntranslatedEffectExtension_ImmunityToEffect = BaseUntranslatedEffect & Readonly<{
  opcode: 'immunityToEffect'; effect: number; spe: number;
}>;
export type UntranslatedEffectExtension_XpBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'xpBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffectExtension_RemoveGold = BaseUntranslatedEffect & Readonly<{
  opcode: 'removeGold'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffectExtension_MoraleBreak = BaseUntranslatedEffect & Readonly<{
  opcode: 'moraleBreak'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffectExtension_Paralyze = BaseUntranslatedEffect & Readonly<{
  opcode: 'paralyze'; idsValue: number; idsTarget: number; effect: number;
}>;
export type UntranslatedEffectExtension_ImmunityToWeapons = BaseUntranslatedEffect & Readonly<{
  opcode: 'immunityToWeapons'; maximumEnchantment: number; weaponType: number; spe: number;
}>;
export type UntranslatedEffectExtension_Confusion = BaseUntranslatedEffect & Readonly<{
  opcode: 'confusion'; spe: number;
}>;
export type UntranslatedEffectExtension_SetAnimationSequence = BaseUntranslatedEffect & Readonly<{
  opcode: 'setAnimationSequence'; sequence: number; spe: number;
}>;
export type UntranslatedEffectExtension_CastSpell = BaseUntranslatedEffect & Readonly<{
  opcode: 'castSpell'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_LearnSpell = BaseUntranslatedEffect & Readonly<{
  opcode: 'learnSpell'; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_CastSpellAtPoint = BaseUntranslatedEffect & Readonly<{
  opcode: 'castSpellAtPoint'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_MirrorImageEffect = BaseUntranslatedEffect & Readonly<{
  opcode: 'mirrorImageEffect'; imagesCount: number; spe: number;
}>;
export type UntranslatedEffectExtension_RemoveFear = BaseUntranslatedEffect & Readonly<{
  opcode: 'removeFear'; spe: number;
}>;
export type UntranslatedEffectExtension_MagicResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'magicResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffectExtension_PreventPortraitIcon = BaseUntranslatedEffect & Readonly<{
  opcode: 'preventPortraitIcon'; icon: number; spe: number;
}>;
export type UntranslatedEffectExtension_PoisonResistanceBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'poisonResistanceBonus'; value: number; spe: number; }>;
export type UntranslatedEffectExtension_PlaySound = BaseUntranslatedEffect & Readonly<{
  opcode: 'playSound'; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_ProtectionmFromSpell = BaseUntranslatedEffect & Readonly<{
  opcode: 'protectionmFromSpell'; stringTlk: string; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_MinimumHp = BaseUntranslatedEffect & Readonly<{
  opcode: 'minimumHp'; hpAmount: number; spe: number;
}>;
export type UntranslatedEffectExtension_PlayVisualEffect = BaseUntranslatedEffect & Readonly<{
  opcode: 'playVisualEffect'; playwhere: number; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_DisableDisplayString = BaseUntranslatedEffect & Readonly<{
  opcode: 'disableDisplayString'; stringTlk: string; spe: number;
}>;
export type UntranslatedEffectExtension_ShakeScreen = BaseUntranslatedEffect & Readonly<{
  opcode: 'shakeScreen'; strength: number; spe: number;
}>;
export type UntranslatedEffectExtension_Thac0Bonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'thac0Bonus'; value: number; modifierType: number; spe: number;
}>;
export type UntranslatedEffectExtension_ImmunityToSpecificAnimation = BaseUntranslatedEffect & Readonly<{
  opcode: 'immunityToSpecificAnimation'; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_ImmunityToTurnUndead = BaseUntranslatedEffect & Readonly<{
  opcode: 'immunityToTurnUndead'; statValue: number; spe: number;
}>;
export type UntranslatedEffectExtension_CriticalHitBonus = BaseUntranslatedEffect & Readonly<{
  opcode: 'criticalHitBonus'; value: number; condition: number; attackType: number;
}>;
export type UntranslatedEffectExtension_RestrictItem = BaseUntranslatedEffect & Readonly<{
  opcode: 'restrictItem'; idsTarget: number; descriptionNoteTlk: string;
}>;
export type UntranslatedEffectExtension_FlashScreen = BaseUntranslatedEffect & Readonly<{
  opcode: 'flashScreen'; spe: number;
}>;
export type UntranslatedEffectExtension_SoulExodus = BaseUntranslatedEffect & Readonly<{
  opcode: 'soulExodus'; spe: number;
}>;
export type UntranslatedEffectExtension_PlayBamFile = BaseUntranslatedEffect & Readonly<{
  opcode: 'playBamFile'; color: number; method: number; resource: string; spe: number;
}>;
export type UntranslatedEffectExtension_Embalm = BaseUntranslatedEffect & Readonly<{
  opcode: 'embalm'; embalmingType: number; spe: number;
}>;
export type UntranslatedEffectExtension_HitPointTransfer = BaseUntranslatedEffect & Readonly<{
  opcode: 'hitPointTransfer'; amount: number; direction: number; damageType: number; spe: number;
}>;

export type UntranslatedEffect
  = | UntranslatedUntranExtensionslatedEffe_AcBonus
    | UntranslatedEffe_MExtensionodifyAttacksPerRound
    | UntranslatedEffe_BExtensionerserk
    | UntranslatedEffe_CExtensionharismaBonus
    | UntranslatedEffe_SExtensionetColor
    | UntranslatedEffe_SExtensionetColorGlowPulse
    | UntranslatedEffec_ExtensionConsitutionBonus
    | UntranslatedEffec_ExtensionCurePoison
    | UntranslatedEffec_ExtensionDamage
    | UntranslatedEffec_ExtensionDexterityBonus
    | UntranslatedEffec_ExtensionHaste
    | UntranslatedEffec_ExtensionCurrentHpBonus
    | UntranslatedEffec_ExtensionMaximumHpBonus
    | UntranslatedEffec_ExtensionIntelligenceBonus
    | UntranslatedEffec_ExtensionInvisibility
    | UntranslatedEffec_ExtensionLoreBonus
    | UntranslatedEffec_ExtensionLuckBonus
    | UntranslatedEffec_ExtensionMoraleBonus
    | UntranslatedEffec_ExtensionPanic
    | UntranslatedEffec_ExtensionPoison
    | UntranslatedEffec_ExtensionAcidResistanceBonus
    | UntranslatedEffec_ExtensionColdResistanceBonus
    | UntranslatedEffec_ExtensionElectricityResistanceBonus
    | UntranslatedEffec_ExtensionFireResistanceBonus
    | UntranslatedEffec_ExtensionSaveVsDeathBonus
    | UntranslatedEffec_ExtensionSaveVsWandBonus
    | UntranslatedEffec_ExtensionSaveVsPolymorphBonus
    | UntranslatedEffec_ExtensionSaveVsBreathBonus
    | UntranslatedEffec_ExtensionSaveVsSpellBonus
    | UntranslatedEffec_ExtensionSilence
    | UntranslatedEffec_ExtensionSparkle
    | UntranslatedEffec_ExtensionBonusWizardSpell
    | UntranslatedEffec_ExtensionStrengthBonus
    | UntranslatedEffec_ExtensionStun
    | UntranslatedEffec_ExtensionWisdomBonus
    | UntranslatedEffec_ExtensionBaseThac0Bonus
    | UntranslatedEffec_ExtensionMoveSilentlyBonus
    | UntranslatedEffec_ExtensionBonusPriestSpell
    | UntranslatedEffec_ExtensionBlur
    | UntranslatedEffec_ExtensionTranslucency
    | UntranslatedEffec_ExtensionAttackDamageBonus
    | UntranslatedEffec_ExtensionBlindness
    | UntranslatedEffec_ExtensionImmunityToProjectile
    | UntranslatedEffec_ExtensionMagicalFireResistanceBonus
    | UntranslatedEffec_ExtensionMagicalColdResistanceBonus
    | UntranslatedEffec_ExtensionSlashingResistanceBonus
    | UntranslatedEffec_ExtensionCrushingResistanceBonus
    | UntranslatedEffec_ExtensionPiercingResistanceBonus
    | UntranslatedEffec_ExtensionMissileResistanceBonus
    | UntranslatedEffec_ExtensionOpenLockBonus
    | UntranslatedEffec_ExtensionFindTrapBonus
    | UntranslatedEffec_ExtensionPickPocketBonus
    | UntranslatedEffec_ExtensionFatigueBonus
    | UntranslatedEffec_ExtensionIntoxicationBonus
    | UntranslatedEffec_ExtensionExceptionalStrengthBonus
    | UntranslatedEffec_ExtensionRegeneration
    | UntranslatedEffectExtension_ImmunityToEffect
    | UntranslatedEffectExtension_XpBonus
    | UntranslatedEffectExtension_RemoveGold
    | UntranslatedEffectExtension_MoraleBreak
    | UntranslatedEffectExtension_Paralyze
    | UntranslatedEffectExtension_ImmunityToWeapons
    | UntranslatedEffectExtension_Confusion
    | UntranslatedEffectExtension_SetAnimationSequence
    | UntranslatedEffectExtension_CastSpell
    | UntranslatedEffectExtension_LearnSpell
    | UntranslatedEffectExtension_CastSpellAtPoint
    | UntranslatedEffectExtension_MirrorImageEffect
    | UntranslatedEffectExtension_RemoveFear
    | UntranslatedEffectExtension_MagicResistanceBonus
    | UntranslatedEffectExtension_PreventPortraitIcon
    | UntranslatedEffectExtension_PoisonResistanceBonus
    | UntranslatedEffectExtension_PlaySound
    | UntranslatedEffectExtension_ProtectionmFromSpell
    | UntranslatedEffectExtension_MinimumHp
    | UntranslatedEffectExtension_PlayVisualEffect
    | UntranslatedEffectExtension_DisableDisplayString
    | UntranslatedEffectExtension_ShakeScreen
    | UntranslatedEffectExtension_Thac0Bonus
    | UntranslatedEffectExtension_ImmunityToSpecificAnimation
    | UntranslatedEffectExtension_ImmunityToTurnUndead
    | UntranslatedEffectExtension_CriticalHitBonus
    | UntranslatedEffectExtension_RestrictItem
    | UntranslatedEffectExtension_FlashScreen
    | UntranslatedEffectExtension_SoulExodus
    | UntranslatedEffectExtension_PlayBamFile
    | UntranslatedEffectExtension_Embalm
    | UntranslatedEffectExtension_HitPointTransfer
;
