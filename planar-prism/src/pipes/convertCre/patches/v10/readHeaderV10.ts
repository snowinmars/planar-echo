import { offsetMap } from './readHeaderTypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';
import { externalOffsetMap } from '../../../../pipes/offsetMap.js';

const readHeaderV10 = (reader: BufferReader, meta: CreatureMeta): CreatureHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const tmp: PartialWriteable<CreatureHeaderV10> = {};

  tmp.signature = meta.signature;
  tmp.version = meta.version;

  tmp.longNameRef = reader.uint();
  tmp.shortNameRef = reader.uint();
  if (tmp.longNameRef === meta.emptyInt) tmp.longNameRef = -1;
  if (tmp.shortNameRef === meta.emptyInt) tmp.shortNameRef = -1;
  tmp.creatureFlags = reader.map.uint(offsetMap.creatureFlags.parseFlags);
  tmp.xpGainedForKilling = reader.uint();
  tmp.creaturePowerLevelOrXpOfCreature = reader.uint();
  tmp.goldCarried = reader.uint();
  tmp.permanentStatusFlags = reader.map.uint(offsetMap.permanentStatusFlags.parseFlags);
  tmp.currentHitPoints = reader.short();
  tmp.maximumHitPoints = reader.short();
  tmp.animationId = reader.uint();
  tmp.metalColourIndex = reader.byte();
  tmp.minorColourIndex = reader.byte();
  tmp.majorColourIndex = reader.byte();
  tmp.skinColourIndex = reader.byte();
  tmp.leatherColourIndex = reader.byte();
  tmp.armorColourIndex = reader.byte();
  tmp.hairColourIndex = reader.byte();
  tmp.effStructureVersion = reader.byte();
  tmp.smallPortrait = reader.string(8);
  tmp.largePortrait = reader.string(8);
  tmp.reputation = reader.ubyte();
  tmp.hideInShadows = reader.byte();
  tmp.armorClassNatural = reader.short();
  tmp.armorClassEffective = reader.short();
  tmp.armorClassCrushingAttacksModifier = reader.short();
  tmp.armorClassMissileAttacksModifier = reader.short();
  tmp.armorClassPiercingAttacksModifier = reader.short();
  tmp.armorClassSlashingAttacksModifier = reader.short();
  tmp.thac0 = reader.byte();
  tmp.numberOfAttacks = reader.byte();
  tmp.saveVersusDeath = reader.byte();
  tmp.saveVersusWands = reader.byte();
  tmp.saveVersusPolymorph = reader.byte();
  tmp.saveVersusBreathAttacks = reader.byte();
  tmp.saveVersusSpells = reader.byte();
  tmp.resistFire = reader.byte();
  tmp.resistCold = reader.byte();
  tmp.resistElectricity = reader.byte();
  tmp.resistAcid = reader.byte();
  tmp.resistMagic = reader.byte();
  tmp.resistMagicFire = reader.byte();
  tmp.resistMagicCold = reader.byte();
  tmp.resistSlashing = reader.byte();
  tmp.resistCrushing = reader.byte();
  tmp.resistPiercing = reader.byte();
  tmp.resistMissile = reader.byte();
  tmp.detectIllusion = reader.byte();
  tmp.setTraps = reader.byte();
  tmp.lore = reader.byte();
  tmp.lockpicking = reader.byte();
  tmp.moveSilently = reader.byte();
  tmp.findOrDisarmTraps = reader.byte();
  tmp.pickPockets = reader.byte();
  tmp.fatigue = reader.byte();
  tmp.intoxication = reader.byte();
  tmp.luck = reader.byte();
  tmp.largeSwordsProficiencyBg1 = reader.byte();
  tmp.smallSwordsProficiencyBg1 = reader.byte();
  tmp.bowsProficiencyBg1 = reader.byte();
  tmp.spearsProficiencyBg1 = reader.byte();
  tmp.bluntProficiencyBg1 = reader.byte();
  tmp.spikedProficiencyBg1 = reader.byte();
  tmp.axeProficiencyBg1 = reader.byte();
  tmp.missileProficiencyBg1 = reader.byte();
  tmp.unusedProficiency1 = reader.byte();
  tmp.unusedProficiency2 = reader.byte();
  tmp.unusedProficiency3 = reader.byte();
  tmp.unusedProficiency4 = reader.byte();
  tmp.unusedProficiency5 = reader.byte();
  tmp.unspentProficienciesPstee = reader.byte();
  tmp.numberOfAvailableInventorySlotsPstee = reader.byte();
  tmp.nightmareModeModifiersApplied = reader.byte();
  tmp.translucency = reader.byte();
  tmp.reputationGainOrLossWhenKilledInBg12_or_MurderVariableIncrementValueIsPstee = reader.byte();
  tmp.reputationGainOrLossWhenJoiningPartyBgee = reader.byte();
  tmp.reputationGainOrLossWhenLeavingPartyBgee = reader.byte();
  tmp.turnUndeadLevel = reader.byte();
  tmp.trackingSkill = reader.byte();

  if (meta.isBg || meta.isBg2 || meta.isBgee) {
    tmp.trackingTarget = reader.string(32, true);
  }
  else if (meta.isPstee) {
    tmp.currentThiefClassExperience = reader.uint();
    tmp.currentMageClassExperience = reader.uint();
    tmp.goodVariableIncrementValue = reader.byte();
    tmp.lawVariableIncrementValue = reader.byte();
    tmp.ladyVariableIncrementValue = reader.byte();
    tmp.faction = reader.byte();
    tmp.team = reader.byte();
    tmp.species = reader.byte(); // TODO [snow]: to enum
    tmp.dialogueActivationRange = reader.byte();
    tmp.selectionCircleSize = reader.byte();
    tmp.shieldFlags = reader.map.byte(offsetMap.shieldFlags.parseFlags);
    tmp.fieldOfVision = reader.byte();
    tmp.attributeFlags = reader.map.uint(offsetMap.attributeFlags.parseFlags);
    reader.skip.custom(10);
  }
  else {
    throw new Error(`This parser support bg1, bg2, bgee, pstee, but got an unsupported format ${meta.gameName}`);
  }

  tmp.strRefsPertainingToCharacter = [];
  for (let i = 0; i < 100; i++) {
    const strRef = reader.uint();
    if (strRef != meta.emptyInt) tmp.strRefsPertainingToCharacter.push(strRef);
  }

  tmp.levelFirstClass = reader.byte();
  tmp.levelSecondClass = reader.byte();
  tmp.levelThirdClass = reader.byte();
  tmp.sex = reader.map.byte(offsetMap.sex.parse);
  tmp.strength = reader.byte();
  tmp.strengthPercentageBonus = reader.byte();
  tmp.intelligence = reader.byte();
  tmp.wisdom = reader.byte();
  tmp.dexterity = reader.byte();
  tmp.constitution = reader.byte();
  tmp.charisma = reader.byte();
  tmp.morale = reader.byte();
  tmp.moraleBreak = reader.byte();
  tmp.racialEnemy = reader.ubyte(); // TODO [snow]: to enum
  tmp.moraleRecoveryTime = reader.short();
  if (meta.idsMap.has('deity.ids')) {
    // tmp.deity = ...; // TODO [snow]: fill when find example
  }
  else if (meta.idsMap.has('diety.ids')) {
    try {
      tmp.diety = reader.map.short(x => externalOffsetMap.parseExternal(x, meta.idsMap.get('diety.ids')!.entries));
    }
    catch {
      tmp.diety = reader.map.short(x => externalOffsetMap.parseExternal(x, meta.idsMap.get('diety.ids')!.entries));
    }
    tmp.mageType = reader.short(); // TODO [snow]: to enum
  }
  else {
    tmp.kitInformation = reader.map.uint(offsetMap.kitInformation.parse);
  }
  tmp.creatureScriptOverrideRef = reader.string(8);
  tmp.creatureScriptClassRef = reader.string(8);
  tmp.creatureScriptRaceRef = reader.string(8);
  tmp.creatureScriptGeneralRef = reader.string(8);
  tmp.creatureScriptDefaultRef = reader.string(8);
  tmp.enemyAlly = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.idsMap.get('ea.ids')!.entries));
  tmp.general = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.idsMap.get('general.ids')!.entries));
  tmp.race = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.idsMap.get('race.ids')!.entries));
  tmp.theClass = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.idsMap.get('class.ids')!.entries));
  tmp.specific = reader.map.ubyte(offsetMap.specific.parse);
  tmp.gender = reader.map.ubyte(offsetMap.gender.parse);
  if (meta.isPstee) {
    tmp.objectSpec1 = reader.ubyte();
    tmp.objectSpec2 = reader.ubyte();
    tmp.objectSpec3 = reader.ubyte();
    tmp.objectSpec4 = reader.ubyte();
    tmp.objectSpec5 = reader.ubyte();
  }
  else {
    // The objectIdsReferences is 5 bytes length long
    // It makes no sence to me to meme it aroung,
    //   because I know the numbers it stores
    // So...
    tmp.objectIdsReferences = reader.map.uint(offsetMap.objectIdsReferences.parse);
    reader.skip.byte();
  }
  tmp.alignment = reader.map.byte(offsetMap.alignment.parse);
  tmp.globalActorEnumerationValue = reader.short();
  tmp.localAreaActorEnumerationValue = reader.short();
  if (meta.isPstee) {
    tmp.scriptName = reader.string(32);
  }
  else {
    tmp.deathVariable = reader.string(32);
  }
  tmp.knownSpellsOffset = reader.uint();
  tmp.knownSpellsCount = reader.uint();
  tmp.spellMemorizationInfoOffset = reader.uint();
  tmp.spellMemorizationInfoEntriesCount = reader.uint();
  tmp.memorizedSpellsOffset = reader.uint();
  tmp.memorizedSpellsCount = reader.uint();
  tmp.offsetToItemSlots = reader.uint();
  tmp.offsetToItems = reader.uint();
  tmp.countOfItems = reader.uint();
  tmp.offsetToEffects = reader.uint();
  tmp.countOfEffects = reader.uint();
  tmp.dialogFileRef = reader.string(8);

  return {
    signature: tmp.signature,
    version: tmp.version,
    longNameRef: tmp.longNameRef,
    longName: `UNTRANSLATED LONGNAME ${tmp.longNameRef}`,
    shortNameRef: tmp.shortNameRef,
    shortName: `UNTRANSLATED SHORTNAME ${tmp.shortNameRef}`,
    creatureFlags: tmp.creatureFlags,
    xpGainedForKilling: tmp.xpGainedForKilling,
    creaturePowerLevelOrXpOfCreature: tmp.creaturePowerLevelOrXpOfCreature,
    goldCarried: tmp.goldCarried,
    permanentStatusFlags: tmp.permanentStatusFlags,
    currentHitPoints: tmp.currentHitPoints,
    maximumHitPoints: tmp.maximumHitPoints,
    animationId: tmp.animationId,
    metalColourIndex: tmp.metalColourIndex,
    minorColourIndex: tmp.minorColourIndex,
    majorColourIndex: tmp.majorColourIndex,
    skinColourIndex: tmp.skinColourIndex,
    leatherColourIndex: tmp.leatherColourIndex,
    armorColourIndex: tmp.armorColourIndex,
    hairColourIndex: tmp.hairColourIndex,
    effStructureVersion: tmp.effStructureVersion,
    smallPortrait: tmp.smallPortrait,
    largePortrait: tmp.largePortrait,
    reputation: tmp.reputation,
    hideInShadows: tmp.hideInShadows,
    armorClassNatural: tmp.armorClassNatural,
    armorClassEffective: tmp.armorClassEffective,
    armorClassCrushingAttacksModifier: tmp.armorClassCrushingAttacksModifier,
    armorClassMissileAttacksModifier: tmp.armorClassMissileAttacksModifier,
    armorClassPiercingAttacksModifier: tmp.armorClassPiercingAttacksModifier,
    armorClassSlashingAttacksModifier: tmp.armorClassSlashingAttacksModifier,
    thac0: tmp.thac0,
    numberOfAttacks: tmp.numberOfAttacks,
    saveVersusDeath: tmp.saveVersusDeath,
    saveVersusWands: tmp.saveVersusWands,
    saveVersusPolymorph: tmp.saveVersusPolymorph,
    saveVersusBreathAttacks: tmp.saveVersusBreathAttacks,
    saveVersusSpells: tmp.saveVersusSpells,
    resistFire: tmp.resistFire,
    resistCold: tmp.resistCold,
    resistElectricity: tmp.resistElectricity,
    resistAcid: tmp.resistAcid,
    resistMagic: tmp.resistMagic,
    resistMagicFire: tmp.resistMagicFire,
    resistMagicCold: tmp.resistMagicCold,
    resistSlashing: tmp.resistSlashing,
    resistCrushing: tmp.resistCrushing,
    resistPiercing: tmp.resistPiercing,
    resistMissile: tmp.resistMissile,
    detectIllusion: tmp.detectIllusion,
    setTraps: tmp.setTraps,
    lore: tmp.lore,
    lockpicking: tmp.lockpicking,
    moveSilently: tmp.moveSilently,
    findOrDisarmTraps: tmp.findOrDisarmTraps,
    pickPockets: tmp.pickPockets,
    fatigue: tmp.fatigue,
    intoxication: tmp.intoxication,
    luck: tmp.luck,
    largeSwordsProficiencyBg1: tmp.largeSwordsProficiencyBg1,
    smallSwordsProficiencyBg1: tmp.smallSwordsProficiencyBg1,
    bowsProficiencyBg1: tmp.bowsProficiencyBg1,
    spearsProficiencyBg1: tmp.spearsProficiencyBg1,
    bluntProficiencyBg1: tmp.bluntProficiencyBg1,
    spikedProficiencyBg1: tmp.spikedProficiencyBg1,
    axeProficiencyBg1: tmp.axeProficiencyBg1,
    missileProficiencyBg1: tmp.missileProficiencyBg1,
    unusedProficiency1: tmp.unusedProficiency1,
    unusedProficiency2: tmp.unusedProficiency2,
    unusedProficiency3: tmp.unusedProficiency3,
    unusedProficiency4: tmp.unusedProficiency4,
    unusedProficiency5: tmp.unusedProficiency5,
    unspentProficienciesPstee: tmp.unspentProficienciesPstee,
    numberOfAvailableInventorySlotsPstee: tmp.numberOfAvailableInventorySlotsPstee,
    nightmareModeModifiersApplied: tmp.nightmareModeModifiersApplied,
    translucency: tmp.translucency,
    reputationGainOrLossWhenKilledInBg12_or_MurderVariableIncrementValueIsPstee: tmp.reputationGainOrLossWhenKilledInBg12_or_MurderVariableIncrementValueIsPstee,
    reputationGainOrLossWhenJoiningPartyBgee: tmp.reputationGainOrLossWhenJoiningPartyBgee,
    reputationGainOrLossWhenLeavingPartyBgee: tmp.reputationGainOrLossWhenLeavingPartyBgee,
    turnUndeadLevel: tmp.turnUndeadLevel,
    trackingSkill: tmp.trackingSkill,
    trackingTarget: tmp.trackingTarget,
    currentThiefClassExperience: tmp.currentThiefClassExperience,
    currentMageClassExperience: tmp.currentMageClassExperience,
    goodVariableIncrementValue: tmp.goodVariableIncrementValue,
    lawVariableIncrementValue: tmp.lawVariableIncrementValue,
    ladyVariableIncrementValue: tmp.ladyVariableIncrementValue,
    faction: tmp.faction,
    team: tmp.team,
    species: tmp.species,
    dialogueActivationRange: tmp.dialogueActivationRange,
    selectionCircleSize: tmp.selectionCircleSize,
    shieldFlags: tmp.shieldFlags,
    fieldOfVision: tmp.fieldOfVision,
    attributeFlags: tmp.attributeFlags,
    strRefsPertainingToCharacter: tmp.strRefsPertainingToCharacter,
    levelFirstClass: tmp.levelFirstClass,
    levelSecondClass: tmp.levelSecondClass,
    levelThirdClass: tmp.levelThirdClass,
    sex: tmp.sex,
    strength: tmp.strength,
    strengthPercentageBonus: tmp.strengthPercentageBonus,
    intelligence: tmp.intelligence,
    wisdom: tmp.wisdom,
    dexterity: tmp.dexterity,
    constitution: tmp.constitution,
    charisma: tmp.charisma,
    morale: tmp.morale,
    moraleBreak: tmp.moraleBreak,
    racialEnemy: tmp.racialEnemy,
    moraleRecoveryTime: tmp.moraleRecoveryTime,
    deity: tmp.deity!,
    diety: tmp.diety!,
    mageType: tmp.mageType,
    kitInformation: tmp.kitInformation!,
    creatureScriptOverrideRef: tmp.creatureScriptOverrideRef,
    creatureScriptClassRef: tmp.creatureScriptClassRef,
    creatureScriptRaceRef: tmp.creatureScriptRaceRef,
    creatureScriptGeneralRef: tmp.creatureScriptGeneralRef,
    creatureScriptDefaultRef: tmp.creatureScriptDefaultRef,
    enemyAlly: tmp.enemyAlly,
    general: tmp.general,
    race: tmp.race,
    theClass: tmp.theClass,
    specific: tmp.specific,
    gender: tmp.gender,
    objectSpec1: tmp.objectSpec1,
    objectSpec2: tmp.objectSpec2,
    objectSpec3: tmp.objectSpec3,
    objectSpec4: tmp.objectSpec4,
    objectSpec5: tmp.objectSpec5,
    objectIdsReferences: tmp.objectIdsReferences,
    alignment: tmp.alignment,
    globalActorEnumerationValue: tmp.globalActorEnumerationValue,
    localAreaActorEnumerationValue: tmp.localAreaActorEnumerationValue,
    scriptName: tmp.scriptName,
    deathVariable: tmp.deathVariable,
    knownSpellsOffset: tmp.knownSpellsOffset,
    knownSpellsCount: tmp.knownSpellsCount,
    spellMemorizationInfoOffset: tmp.spellMemorizationInfoOffset,
    spellMemorizationInfoEntriesCount: tmp.spellMemorizationInfoEntriesCount,
    memorizedSpellsOffset: tmp.memorizedSpellsOffset,
    memorizedSpellsCount: tmp.memorizedSpellsCount,
    offsetToItemSlots: tmp.offsetToItemSlots,
    offsetToItems: tmp.offsetToItems,
    countOfItems: tmp.countOfItems,
    offsetToEffects: tmp.offsetToEffects,
    countOfEffects: tmp.countOfEffects,
    dialogFileRef: tmp.dialogFileRef,
  };
};

export default readHeaderV10;
