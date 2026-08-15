import type { Maybe } from '../maybe.js';

export type GhostItm = Readonly<{
  version: 'v10';
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  unidentifiedDescriptionRef: number;
  identifiedDescriptionRef: number;
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
  abilities: GhostItmAbility[];
  effects: GhostItmEffect[];
}>;

export type GhostItmAbility = Readonly<{
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
  effects: GhostItmEffect[];
}>;

type BaseGhostItmEffect = Readonly<{
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

export type GhostItmUntranExtensionslatedEffect_AcBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'acBonus'; acvalue: number; bonusTo: number; spe: number;
}>;
export type GhostItmEffect_MExtensionodifyAttacksPerRound = BaseGhostItmEffect & Readonly<{
  opcode: 'modifyAttacksPerRound'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_BExtensionerserk = BaseGhostItmEffect & Readonly<{
  opcode: 'berserk'; berserkType: number; spe: number;
}>;
export type GhostItmEffect_CExtensionharismaBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'charismaBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_SExtensionetColor = BaseGhostItmEffect & Readonly<{
  opcode: 'setColor'; color: number; location: number; spe: number;
}>;
export type GhostItmEffect_SExtensionetColorGlowPulse = BaseGhostItmEffect & Readonly<{
  opcode: 'setColorGlowPulse'; color: number; location: number; cycleSpeed: number;
  spe: number;
}>;
export type GhostItmEffec_ExtensionConsitutionBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'consitutionBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionCurePoison = BaseGhostItmEffect & Readonly<{
  opcode: 'curePoison'; spe: number;
}>;
export type GhostItmEffec_ExtensionDamage = BaseGhostItmEffect & Readonly<{
  opcode: 'damage'; amount: number; mode: number; damageType: number; flags: number;
}>;
export type GhostItmEffec_ExtensionDexterityBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'dexterityBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionHaste = BaseGhostItmEffect & Readonly<{
  opcode: 'haste'; hasteType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionCurrentHpBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'currentHpBonus'; value: number; modifierType: number; healFlags: number; spe: number;
}>;
export type GhostItmEffec_ExtensionMaximumHpBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'maximumHpBonus'; value: number; modifierType: number; mode: number;
}>;
export type GhostItmEffec_ExtensionIntelligenceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'intelligenceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionInvisibility = BaseGhostItmEffect & Readonly<{
  opcode: 'invisibility'; invisibilityType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionLoreBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'loreBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionLuckBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'luckBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionMoraleBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'moraleBonus'; mode: number;
}>;
export type GhostItmEffec_ExtensionPanic = BaseGhostItmEffect & Readonly<{
  opcode: 'panic'; panicType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionPoison = BaseGhostItmEffect & Readonly<{
  opcode: 'poison'; amount: number; poisonType: number; icon: number;
}>;
export type GhostItmEffec_ExtensionAcidResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'acidResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionColdResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'coldResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionElectricityResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'electricityResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionFireResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'fireResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSaveVsDeathBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsDeathBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSaveVsWandBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsWandBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSaveVsPolymorphBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsPolymorphBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSaveVsBreathBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsBreathBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSaveVsSpellBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsSpellBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSilence = BaseGhostItmEffect & Readonly<{
  opcode: 'silence'; spe: number;
}>;
export type GhostItmEffec_ExtensionSparkle = BaseGhostItmEffect & Readonly<{
  opcode: 'sparkle'; amount: number; particleEffect: number; resource: string; spe: number;
}>;
export type GhostItmEffec_ExtensionBonusWizardSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'bonusWizardSpell'; amountSpellsToAdd: number; spellLevels: number; spe: number;
}>;
export type GhostItmEffec_ExtensionStrengthBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'strengthBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionStun = BaseGhostItmEffect & Readonly<{
  opcode: 'stun'; spe: number;
}>;
export type GhostItmEffec_ExtensionWisdomBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'wisdomBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionBaseThac0Bonus = BaseGhostItmEffect & Readonly<{
  opcode: 'baseThac0Bonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionMoveSilentlyBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'moveSilentlyBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionBonusPriestSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'bonusPriestSpell'; amountSpellsToAdd: number; spellLevels: number; spe: number;
}>;
export type GhostItmEffec_ExtensionBlur = BaseGhostItmEffect & Readonly<{
  opcode: 'blur'; spe: number;
}>;
export type GhostItmEffec_ExtensionTranslucency = BaseGhostItmEffect & Readonly<{
  opcode: 'translucency'; fadeAmount: number; visualEffect: number; spe: number;
}>;
export type GhostItmEffec_ExtensionAttackDamageBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'attackDamageBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionBlindness = BaseGhostItmEffect & Readonly<{
  opcode: 'blindness'; spe: number;
}>;
export type GhostItmEffec_ExtensionImmunityToProjectile = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToProjectile'; projectile: number; spe: number;
}>;
export type GhostItmEffec_ExtensionMagicalFireResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'magicalFireResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionMagicalColdResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'magicalColdResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionSlashingResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'slashingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionCrushingResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'crushingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionPiercingResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'piercingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionMissileResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'missileResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionOpenLockBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'openLockBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionFindTrapBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'findTrapBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionPickPocketBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'pickPocketBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionFatigueBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'fatigueBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionIntoxicationBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'intoxicationBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionExceptionalStrengthBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'exceptionalStrengthBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExtensionRegeneration = BaseGhostItmEffect & Readonly<{
  opcode: 'regeneration'; value: number; regenerationType: number; icon: number;
}>;
export type GhostItmEffectExtension_ImmunityToEffect = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToEffect'; effect: number; spe: number;
}>;
export type GhostItmEffectExtension_XpBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'xpBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffectExtension_RemoveGold = BaseGhostItmEffect & Readonly<{
  opcode: 'removeGold'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffectExtension_MoraleBreak = BaseGhostItmEffect & Readonly<{
  opcode: 'moraleBreak'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffectExtension_Paralyze = BaseGhostItmEffect & Readonly<{
  opcode: 'paralyze'; idsValue: number; idsTarget: number; effect: number;
}>;
export type GhostItmEffectExtension_ImmunityToWeapons = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToWeapons'; maximumEnchantment: number; weaponType: number; spe: number;
}>;
export type GhostItmEffectExtension_Confusion = BaseGhostItmEffect & Readonly<{
  opcode: 'confusion'; spe: number;
}>;
export type GhostItmEffectExtension_SetAnimationSequence = BaseGhostItmEffect & Readonly<{
  opcode: 'setAnimationSequence'; sequence: number; spe: number;
}>;
export type GhostItmEffectExtension_CastSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'castSpell'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_LearnSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'learnSpell'; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_CastSpellAtPoint = BaseGhostItmEffect & Readonly<{
  opcode: 'castSpellAtPoint'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_MirrorImageEffect = BaseGhostItmEffect & Readonly<{
  opcode: 'mirrorImageEffect'; imagesCount: number; spe: number;
}>;
export type GhostItmEffectExtension_RemoveFear = BaseGhostItmEffect & Readonly<{
  opcode: 'removeFear'; spe: number;
}>;
export type GhostItmEffectExtension_MagicResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'magicResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffectExtension_PreventPortraitIcon = BaseGhostItmEffect & Readonly<{
  opcode: 'preventPortraitIcon'; icon: number; spe: number;
}>;
export type GhostItmEffectExtension_PoisonResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'poisonResistanceBonus'; value: number; spe: number; }>;
export type GhostItmEffectExtension_PlaySound = BaseGhostItmEffect & Readonly<{
  opcode: 'playSound'; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_ProtectionmFromSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'protectionmFromSpell'; stringTlk: string; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_MinimumHp = BaseGhostItmEffect & Readonly<{
  opcode: 'minimumHp'; hpAmount: number; spe: number;
}>;
export type GhostItmEffectExtension_PlayVisualEffect = BaseGhostItmEffect & Readonly<{
  opcode: 'playVisualEffect'; playwhere: number; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_DisableDisplayString = BaseGhostItmEffect & Readonly<{
  opcode: 'disableDisplayString'; stringTlk: string; spe: number;
}>;
export type GhostItmEffectExtension_ShakeScreen = BaseGhostItmEffect & Readonly<{
  opcode: 'shakeScreen'; strength: number; spe: number;
}>;
export type GhostItmEffectExtension_Thac0Bonus = BaseGhostItmEffect & Readonly<{
  opcode: 'thac0Bonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffectExtension_ImmunityToSpecificAnimation = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToSpecificAnimation'; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_ImmunityToTurnUndead = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToTurnUndead'; statValue: number; spe: number;
}>;
export type GhostItmEffectExtension_CriticalHitBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'criticalHitBonus'; value: number; condition: number; attackType: number;
}>;
export type GhostItmEffectExtension_RestrictItem = BaseGhostItmEffect & Readonly<{
  opcode: 'restrictItem'; idsTarget: number; descriptionNoteTlk: string;
}>;
export type GhostItmEffectExtension_FlashScreen = BaseGhostItmEffect & Readonly<{
  opcode: 'flashScreen'; spe: number;
}>;
export type GhostItmEffectExtension_SoulExodus = BaseGhostItmEffect & Readonly<{
  opcode: 'soulExodus'; spe: number;
}>;
export type GhostItmEffectExtension_PlayBamFile = BaseGhostItmEffect & Readonly<{
  opcode: 'playBamFile'; color: number; method: number; resource: string; spe: number;
}>;
export type GhostItmEffectExtension_Embalm = BaseGhostItmEffect & Readonly<{
  opcode: 'embalm'; embalmingType: number; spe: number;
}>;
export type GhostItmEffectExtension_HitPointTransfer = BaseGhostItmEffect & Readonly<{
  opcode: 'hitPointTransfer'; amount: number; direction: number; damageType: number; spe: number;
}>;

export type GhostItmEffect
  = | GhostItmUntranExtensionslatedEffect_AcBonus
    | GhostItmEffect_MExtensionodifyAttacksPerRound
    | GhostItmEffect_BExtensionerserk
    | GhostItmEffect_CExtensionharismaBonus
    | GhostItmEffect_SExtensionetColor
    | GhostItmEffect_SExtensionetColorGlowPulse
    | GhostItmEffec_ExtensionConsitutionBonus
    | GhostItmEffec_ExtensionCurePoison
    | GhostItmEffec_ExtensionDamage
    | GhostItmEffec_ExtensionDexterityBonus
    | GhostItmEffec_ExtensionHaste
    | GhostItmEffec_ExtensionCurrentHpBonus
    | GhostItmEffec_ExtensionMaximumHpBonus
    | GhostItmEffec_ExtensionIntelligenceBonus
    | GhostItmEffec_ExtensionInvisibility
    | GhostItmEffec_ExtensionLoreBonus
    | GhostItmEffec_ExtensionLuckBonus
    | GhostItmEffec_ExtensionMoraleBonus
    | GhostItmEffec_ExtensionPanic
    | GhostItmEffec_ExtensionPoison
    | GhostItmEffec_ExtensionAcidResistanceBonus
    | GhostItmEffec_ExtensionColdResistanceBonus
    | GhostItmEffec_ExtensionElectricityResistanceBonus
    | GhostItmEffec_ExtensionFireResistanceBonus
    | GhostItmEffec_ExtensionSaveVsDeathBonus
    | GhostItmEffec_ExtensionSaveVsWandBonus
    | GhostItmEffec_ExtensionSaveVsPolymorphBonus
    | GhostItmEffec_ExtensionSaveVsBreathBonus
    | GhostItmEffec_ExtensionSaveVsSpellBonus
    | GhostItmEffec_ExtensionSilence
    | GhostItmEffec_ExtensionSparkle
    | GhostItmEffec_ExtensionBonusWizardSpell
    | GhostItmEffec_ExtensionStrengthBonus
    | GhostItmEffec_ExtensionStun
    | GhostItmEffec_ExtensionWisdomBonus
    | GhostItmEffec_ExtensionBaseThac0Bonus
    | GhostItmEffec_ExtensionMoveSilentlyBonus
    | GhostItmEffec_ExtensionBonusPriestSpell
    | GhostItmEffec_ExtensionBlur
    | GhostItmEffec_ExtensionTranslucency
    | GhostItmEffec_ExtensionAttackDamageBonus
    | GhostItmEffec_ExtensionBlindness
    | GhostItmEffec_ExtensionImmunityToProjectile
    | GhostItmEffec_ExtensionMagicalFireResistanceBonus
    | GhostItmEffec_ExtensionMagicalColdResistanceBonus
    | GhostItmEffec_ExtensionSlashingResistanceBonus
    | GhostItmEffec_ExtensionCrushingResistanceBonus
    | GhostItmEffec_ExtensionPiercingResistanceBonus
    | GhostItmEffec_ExtensionMissileResistanceBonus
    | GhostItmEffec_ExtensionOpenLockBonus
    | GhostItmEffec_ExtensionFindTrapBonus
    | GhostItmEffec_ExtensionPickPocketBonus
    | GhostItmEffec_ExtensionFatigueBonus
    | GhostItmEffec_ExtensionIntoxicationBonus
    | GhostItmEffec_ExtensionExceptionalStrengthBonus
    | GhostItmEffec_ExtensionRegeneration
    | GhostItmEffectExtension_ImmunityToEffect
    | GhostItmEffectExtension_XpBonus
    | GhostItmEffectExtension_RemoveGold
    | GhostItmEffectExtension_MoraleBreak
    | GhostItmEffectExtension_Paralyze
    | GhostItmEffectExtension_ImmunityToWeapons
    | GhostItmEffectExtension_Confusion
    | GhostItmEffectExtension_SetAnimationSequence
    | GhostItmEffectExtension_CastSpell
    | GhostItmEffectExtension_LearnSpell
    | GhostItmEffectExtension_CastSpellAtPoint
    | GhostItmEffectExtension_MirrorImageEffect
    | GhostItmEffectExtension_RemoveFear
    | GhostItmEffectExtension_MagicResistanceBonus
    | GhostItmEffectExtension_PreventPortraitIcon
    | GhostItmEffectExtension_PoisonResistanceBonus
    | GhostItmEffectExtension_PlaySound
    | GhostItmEffectExtension_ProtectionmFromSpell
    | GhostItmEffectExtension_MinimumHp
    | GhostItmEffectExtension_PlayVisualEffect
    | GhostItmEffectExtension_DisableDisplayString
    | GhostItmEffectExtension_ShakeScreen
    | GhostItmEffectExtension_Thac0Bonus
    | GhostItmEffectExtension_ImmunityToSpecificAnimation
    | GhostItmEffectExtension_ImmunityToTurnUndead
    | GhostItmEffectExtension_CriticalHitBonus
    | GhostItmEffectExtension_RestrictItem
    | GhostItmEffectExtension_FlashScreen
    | GhostItmEffectExtension_SoulExodus
    | GhostItmEffectExtension_PlayBamFile
    | GhostItmEffectExtension_Embalm
    | GhostItmEffectExtension_HitPointTransfer
;
