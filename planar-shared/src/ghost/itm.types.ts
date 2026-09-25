import type { Maybe } from '../maybe.js';

export type GhostItmV10 = Readonly<{
  version: 'v10';
  resourceName: string;
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

export type GhostItmAbilityV10 = Readonly<{
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

export type GhostItmEffect_AcBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'acBonus'; acvalue: number; bonusTo: number; spe: number;
}>;
export type GhostItmEffect_ModifyAttacksPerRound = BaseGhostItmEffect & Readonly<{
  opcode: 'modifyAttacksPerRound'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_Berserk = BaseGhostItmEffect & Readonly<{
  opcode: 'berserk'; berserkType: number; spe: number;
}>;
export type GhostItmEffect_CharismaBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'charismaBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_SetColor = BaseGhostItmEffect & Readonly<{
  opcode: 'setColor'; color: number; location: number; spe: number;
}>;
export type GhostItmEffect_SetColorGlowPulse = BaseGhostItmEffect & Readonly<{
  opcode: 'setColorGlowPulse'; color: number; location: number; cycleSpeed: number;
  spe: number;
}>;
export type GhostItmEffec_ConsitutionBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'consitutionBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_CurePoison = BaseGhostItmEffect & Readonly<{
  opcode: 'curePoison'; spe: number;
}>;
export type GhostItmEffec_Damage = BaseGhostItmEffect & Readonly<{
  opcode: 'damage'; amount: number; mode: number; damageType: number; flags: number;
}>;
export type GhostItmEffec_DexterityBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'dexterityBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_Haste = BaseGhostItmEffect & Readonly<{
  opcode: 'haste'; hasteType: number; spe: number;
}>;
export type GhostItmEffec_CurrentHpBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'currentHpBonus'; value: number; modifierType: number; healFlags: number; spe: number;
}>;
export type GhostItmEffec_MaximumHpBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'maximumHpBonus'; value: number; modifierType: number; mode: number;
}>;
export type GhostItmEffec_IntelligenceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'intelligenceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_Invisibility = BaseGhostItmEffect & Readonly<{
  opcode: 'invisibility'; invisibilityType: number; spe: number;
}>;
export type GhostItmEffec_LoreBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'loreBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_LuckBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'luckBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_MoraleBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'moraleBonus'; mode: number;
}>;
export type GhostItmEffec_Panic = BaseGhostItmEffect & Readonly<{
  opcode: 'panic'; panicType: number; spe: number;
}>;
export type GhostItmEffec_Poison = BaseGhostItmEffect & Readonly<{
  opcode: 'poison'; amount: number; poisonType: number; icon: number;
}>;
export type GhostItmEffec_AcidResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'acidResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ColdResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'coldResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ElectricityResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'electricityResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_FireResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'fireResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_SaveVsDeathBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsDeathBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_SaveVsWandBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsWandBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_SaveVsPolymorphBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsPolymorphBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_SaveVsBreathBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsBreathBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_SaveVsSpellBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'saveVsSpellBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_Silence = BaseGhostItmEffect & Readonly<{
  opcode: 'silence'; spe: number;
}>;
export type GhostItmEffec_Sparkle = BaseGhostItmEffect & Readonly<{
  opcode: 'sparkle'; amount: number; particleEffect: number; resource: string; spe: number;
}>;
export type GhostItmEffec_BonusWizardSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'bonusWizardSpell'; amountSpellsToAdd: number; spellLevels: number; spe: number;
}>;
export type GhostItmEffec_StrengthBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'strengthBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_Stun = BaseGhostItmEffect & Readonly<{
  opcode: 'stun'; spe: number;
}>;
export type GhostItmEffec_WisdomBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'wisdomBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_BaseThac0Bonus = BaseGhostItmEffect & Readonly<{
  opcode: 'baseThac0Bonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_MoveSilentlyBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'moveSilentlyBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_BonusPriestSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'bonusPriestSpell'; amountSpellsToAdd: number; spellLevels: number; spe: number;
}>;
export type GhostItmEffec_Blur = BaseGhostItmEffect & Readonly<{
  opcode: 'blur'; spe: number;
}>;
export type GhostItmEffec_Translucency = BaseGhostItmEffect & Readonly<{
  opcode: 'translucency'; fadeAmount: number; visualEffect: number; spe: number;
}>;
export type GhostItmEffec_AttackDamageBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'attackDamageBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_Blindness = BaseGhostItmEffect & Readonly<{
  opcode: 'blindness'; spe: number;
}>;
export type GhostItmEffec_ImmunityToProjectile = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToProjectile'; projectile: number; spe: number;
}>;
export type GhostItmEffec_MagicalFireResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'magicalFireResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_MagicalColdResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'magicalColdResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_SlashingResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'slashingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_CrushingResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'crushingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_PiercingResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'piercingResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_MissileResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'missileResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_OpenLockBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'openLockBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_FindTrapBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'findTrapBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_PickPocketBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'pickPocketBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_FatigueBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'fatigueBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_IntoxicationBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'intoxicationBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_ExceptionalStrengthBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'exceptionalStrengthBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffec_Regeneration = BaseGhostItmEffect & Readonly<{
  opcode: 'regeneration'; value: number; regenerationType: number; icon: number;
}>;
export type GhostItmEffect_ImmunityToEffect = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToEffect'; effect: number; spe: number;
}>;
export type GhostItmEffect_XpBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'xpBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_RemoveGold = BaseGhostItmEffect & Readonly<{
  opcode: 'removeGold'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_MoraleBreak = BaseGhostItmEffect & Readonly<{
  opcode: 'moraleBreak'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_Paralyze = BaseGhostItmEffect & Readonly<{
  opcode: 'paralyze'; idsValue: number; idsTarget: number; effect: number;
}>;
export type GhostItmEffect_ImmunityToWeapons = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToWeapons'; maximumEnchantment: number; weaponType: number; spe: number;
}>;
export type GhostItmEffect_Confusion = BaseGhostItmEffect & Readonly<{
  opcode: 'confusion'; spe: number;
}>;
export type GhostItmEffect_SetAnimationSequence = BaseGhostItmEffect & Readonly<{
  opcode: 'setAnimationSequence'; sequence: number; spe: number;
}>;
export type GhostItmEffect_CastSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'castSpell'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type GhostItmEffect_LearnSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'learnSpell'; resource: string; spe: number;
}>;
export type GhostItmEffect_CastSpellAtPoint = BaseGhostItmEffect & Readonly<{
  opcode: 'castSpellAtPoint'; castAtLevel: number; mode: number; resource: string; spe: number;
}>;
export type GhostItmEffect_MirrorImageEffect = BaseGhostItmEffect & Readonly<{
  opcode: 'mirrorImageEffect'; imagesCount: number; spe: number;
}>;
export type GhostItmEffect_RemoveFear = BaseGhostItmEffect & Readonly<{
  opcode: 'removeFear'; spe: number;
}>;
export type GhostItmEffect_MagicResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'magicResistanceBonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_PreventPortraitIcon = BaseGhostItmEffect & Readonly<{
  opcode: 'preventPortraitIcon'; icon: number; spe: number;
}>;
export type GhostItmEffect_PoisonResistanceBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'poisonResistanceBonus'; value: number; spe: number; }>;
export type GhostItmEffect_PlaySound = BaseGhostItmEffect & Readonly<{
  opcode: 'playSound'; resource: string; spe: number;
}>;
export type GhostItmEffect_ProtectionmFromSpell = BaseGhostItmEffect & Readonly<{
  opcode: 'protectionmFromSpell'; stringTlk: string; resource: string; spe: number;
}>;
export type GhostItmEffect_MinimumHp = BaseGhostItmEffect & Readonly<{
  opcode: 'minimumHp'; hpAmount: number; spe: number;
}>;
export type GhostItmEffect_PlayVisualEffect = BaseGhostItmEffect & Readonly<{
  opcode: 'playVisualEffect'; playwhere: number; resource: string; spe: number;
}>;
export type GhostItmEffect_DisableDisplayString = BaseGhostItmEffect & Readonly<{
  opcode: 'disableDisplayString'; stringTlk: string; spe: number;
}>;
export type GhostItmEffect_ShakeScreen = BaseGhostItmEffect & Readonly<{
  opcode: 'shakeScreen'; strength: number; spe: number;
}>;
export type GhostItmEffect_Thac0Bonus = BaseGhostItmEffect & Readonly<{
  opcode: 'thac0Bonus'; value: number; modifierType: number; spe: number;
}>;
export type GhostItmEffect_ImmunityToSpecificAnimation = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToSpecificAnimation'; resource: string; spe: number;
}>;
export type GhostItmEffect_ImmunityToTurnUndead = BaseGhostItmEffect & Readonly<{
  opcode: 'immunityToTurnUndead'; statValue: number; spe: number;
}>;
export type GhostItmEffect_CriticalHitBonus = BaseGhostItmEffect & Readonly<{
  opcode: 'criticalHitBonus'; value: number; condition: number; attackType: number;
}>;
export type GhostItmEffect_RestrictItem = BaseGhostItmEffect & Readonly<{
  opcode: 'restrictItem'; idsTarget: number; descriptionNoteTlk: string;
}>;
export type GhostItmEffect_FlashScreen = BaseGhostItmEffect & Readonly<{
  opcode: 'flashScreen'; spe: number;
}>;
export type GhostItmEffect_SoulExodus = BaseGhostItmEffect & Readonly<{
  opcode: 'soulExodus'; spe: number;
}>;
export type GhostItmEffect_PlayBamFile = BaseGhostItmEffect & Readonly<{
  opcode: 'playBamFile'; color: number; method: number; resource: string; spe: number;
}>;
export type GhostItmEffect_Embalm = BaseGhostItmEffect & Readonly<{
  opcode: 'embalm'; embalmingType: number; spe: number;
}>;
export type GhostItmEffect_HitPointTransfer = BaseGhostItmEffect & Readonly<{
  opcode: 'hitPointTransfer'; amount: number; direction: number; damageType: number; spe: number;
}>;

export type GhostItmEffectV10
  = | GhostItmEffect_AcBonus
    | GhostItmEffect_ModifyAttacksPerRound
    | GhostItmEffect_Berserk
    | GhostItmEffect_CharismaBonus
    | GhostItmEffect_SetColor
    | GhostItmEffect_SetColorGlowPulse
    | GhostItmEffec_ConsitutionBonus
    | GhostItmEffec_CurePoison
    | GhostItmEffec_Damage
    | GhostItmEffec_DexterityBonus
    | GhostItmEffec_Haste
    | GhostItmEffec_CurrentHpBonus
    | GhostItmEffec_MaximumHpBonus
    | GhostItmEffec_IntelligenceBonus
    | GhostItmEffec_Invisibility
    | GhostItmEffec_LoreBonus
    | GhostItmEffec_LuckBonus
    | GhostItmEffec_MoraleBonus
    | GhostItmEffec_Panic
    | GhostItmEffec_Poison
    | GhostItmEffec_AcidResistanceBonus
    | GhostItmEffec_ColdResistanceBonus
    | GhostItmEffec_ElectricityResistanceBonus
    | GhostItmEffec_FireResistanceBonus
    | GhostItmEffec_SaveVsDeathBonus
    | GhostItmEffec_SaveVsWandBonus
    | GhostItmEffec_SaveVsPolymorphBonus
    | GhostItmEffec_SaveVsBreathBonus
    | GhostItmEffec_SaveVsSpellBonus
    | GhostItmEffec_Silence
    | GhostItmEffec_Sparkle
    | GhostItmEffec_BonusWizardSpell
    | GhostItmEffec_StrengthBonus
    | GhostItmEffec_Stun
    | GhostItmEffec_WisdomBonus
    | GhostItmEffec_BaseThac0Bonus
    | GhostItmEffec_MoveSilentlyBonus
    | GhostItmEffec_BonusPriestSpell
    | GhostItmEffec_Blur
    | GhostItmEffec_Translucency
    | GhostItmEffec_AttackDamageBonus
    | GhostItmEffec_Blindness
    | GhostItmEffec_ImmunityToProjectile
    | GhostItmEffec_MagicalFireResistanceBonus
    | GhostItmEffec_MagicalColdResistanceBonus
    | GhostItmEffec_SlashingResistanceBonus
    | GhostItmEffec_CrushingResistanceBonus
    | GhostItmEffec_PiercingResistanceBonus
    | GhostItmEffec_MissileResistanceBonus
    | GhostItmEffec_OpenLockBonus
    | GhostItmEffec_FindTrapBonus
    | GhostItmEffec_PickPocketBonus
    | GhostItmEffec_FatigueBonus
    | GhostItmEffec_IntoxicationBonus
    | GhostItmEffec_ExceptionalStrengthBonus
    | GhostItmEffec_Regeneration
    | GhostItmEffect_ImmunityToEffect
    | GhostItmEffect_XpBonus
    | GhostItmEffect_RemoveGold
    | GhostItmEffect_MoraleBreak
    | GhostItmEffect_Paralyze
    | GhostItmEffect_ImmunityToWeapons
    | GhostItmEffect_Confusion
    | GhostItmEffect_SetAnimationSequence
    | GhostItmEffect_CastSpell
    | GhostItmEffect_LearnSpell
    | GhostItmEffect_CastSpellAtPoint
    | GhostItmEffect_MirrorImageEffect
    | GhostItmEffect_RemoveFear
    | GhostItmEffect_MagicResistanceBonus
    | GhostItmEffect_PreventPortraitIcon
    | GhostItmEffect_PoisonResistanceBonus
    | GhostItmEffect_PlaySound
    | GhostItmEffect_ProtectionmFromSpell
    | GhostItmEffect_MinimumHp
    | GhostItmEffect_PlayVisualEffect
    | GhostItmEffect_DisableDisplayString
    | GhostItmEffect_ShakeScreen
    | GhostItmEffect_Thac0Bonus
    | GhostItmEffect_ImmunityToSpecificAnimation
    | GhostItmEffect_ImmunityToTurnUndead
    | GhostItmEffect_CriticalHitBonus
    | GhostItmEffect_RestrictItem
    | GhostItmEffect_FlashScreen
    | GhostItmEffect_SoulExodus
    | GhostItmEffect_PlayBamFile
    | GhostItmEffect_Embalm
    | GhostItmEffect_HitPointTransfer
;

export type GhostItm = GhostItmV10;
export type GhostItmAbility = GhostItmAbilityV10;
export type GhostItmEffect = GhostItmEffectV10;
