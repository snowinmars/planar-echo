import { offsetMap } from '../../v10.types/1.header.js';
import { externalOffsetMap } from '../../../../../pipes/offsetMap.js';
import { nothing } from '../../../../../shared/maybe.js';

import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { CreatureHeaderV10 } from '../../v10.types/1.header.js';
import type { Signature, Versions } from '../../types.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

// I decline to mislead the user:
// the header is a mess with bunch of ifs
// so the code arch makes it clear
const parseHeaderV10 = (reader: BufferReader, meta: Meta<Signature, Versions>): CreatureHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  if (meta.version !== 'v1.0') throw new Error(`Unsupported version '${meta.version}' for creature ${meta.resourceName}`);

  const longNameRef = normalizeRef(reader.uint(), meta.emptyInt);
  const shortNameRef = normalizeRef(reader.uint(), meta.emptyInt);
  const creatureFlags = reader.map.uint(offsetMap.creatureFlags.parseFlags);
  const xpGainedForKilling = reader.uint();
  const creaturePowerLevelOrXpOfCreature = reader.uint();
  const goldCarried = reader.uint();
  const permanentStatusFlags = reader.map.uint(offsetMap.permanentStatusFlags.parseFlags);
  const currentHitPoints = reader.short();
  const maximumHitPoints = reader.short();
  const animationId = reader.uint();
  const metalColourIndex = reader.byte();
  const minorColourIndex = reader.byte();
  const majorColourIndex = reader.byte();
  const skinColourIndex = reader.byte();
  const leatherColourIndex = reader.byte();
  const armorColourIndex = reader.byte();
  const hairColourIndex = reader.byte();
  const effStructureVersion = reader.byte();
  if (effStructureVersion !== 0 && effStructureVersion !== 1) throw new Error(`Unsupported effStructureVersion '${effStructureVersion}' for creature '${meta.resourceName}'`);
  const smallPortrait = reader.string(8);
  const largePortrait = reader.string(8);
  const reputation = reader.ubyte();
  const hideInShadows = reader.byte();
  const armorClassNatural = reader.short();
  const armorClassEffective = reader.short();
  const armorClassCrushingAttacksModifier = reader.short();
  const armorClassMissileAttacksModifier = reader.short();
  const armorClassPiercingAttacksModifier = reader.short();
  const armorClassSlashingAttacksModifier = reader.short();
  const thac0 = reader.byte();
  const numberOfAttacks = reader.byte();
  const saveVersusDeath = reader.byte();
  const saveVersusWands = reader.byte();
  const saveVersusPolymorph = reader.byte();
  const saveVersusBreathAttacks = reader.byte();
  const saveVersusSpells = reader.byte();
  const resistFire = reader.byte();
  const resistCold = reader.byte();
  const resistElectricity = reader.byte();
  const resistAcid = reader.byte();
  const resistMagic = reader.byte();
  const resistMagicFire = reader.byte();
  const resistMagicCold = reader.byte();
  const resistSlashing = reader.byte();
  const resistCrushing = reader.byte();
  const resistPiercing = reader.byte();
  const resistMissile = reader.byte();
  const detectIllusion = reader.byte();
  const setTraps = reader.byte();
  const lore = reader.byte();
  const lockpicking = reader.byte();
  const moveSilently = reader.byte();
  const findOrDisarmTraps = reader.byte();
  const pickPockets = reader.byte();
  const fatigue = reader.byte();
  const intoxication = reader.byte();
  const luck = reader.byte();
  const largeSwordsProficiencyBg1 = reader.byte();
  const smallSwordsProficiencyBg1 = reader.byte();
  const bowsProficiencyBg1 = reader.byte();
  const spearsProficiencyBg1 = reader.byte();
  const bluntProficiencyBg1 = reader.byte();
  const spikedProficiencyBg1 = reader.byte();
  const axeProficiencyBg1 = reader.byte();
  const missileProficiencyBg1 = reader.byte();
  const unusedProficiency1 = reader.byte();
  const unusedProficiency2 = reader.byte();
  const unusedProficiency3 = reader.byte();
  const unusedProficiency4 = reader.byte();
  const unusedProficiency5 = reader.byte();
  const unspentProficienciesPstee = reader.byte();
  const numberOfAvailableInventorySlotsPstee = reader.byte();
  const nightmareModeModifiersApplied = reader.byte();
  const translucency = reader.byte();
  const reputationGainOrLossWhenKilledInBg12_or_MurderVariableIncrementValueIsPstee = reader.byte();
  const reputationGainOrLossWhenJoiningPartyBgee = reader.byte();
  const reputationGainOrLossWhenLeavingPartyBgee = reader.byte();
  const turnUndeadLevel = reader.byte();
  const trackingSkill = reader.byte();

  //

  let trackingTarget: CreatureHeaderV10['trackingTarget'] = nothing();
  let currentThiefClassExperience: CreatureHeaderV10['currentThiefClassExperience'] = nothing();
  let currentMageClassExperience: CreatureHeaderV10['currentMageClassExperience'] = nothing();
  let goodVariableIncrementValue: CreatureHeaderV10['goodVariableIncrementValue'] = nothing();
  let lawVariableIncrementValue: CreatureHeaderV10['lawVariableIncrementValue'] = nothing();
  let ladyVariableIncrementValue: CreatureHeaderV10['ladyVariableIncrementValue'] = nothing();
  let faction: CreatureHeaderV10['faction'] = nothing();
  let team: CreatureHeaderV10['team'] = nothing();
  let species: CreatureHeaderV10['species'] = nothing();
  let dialogueActivationRange: CreatureHeaderV10['dialogueActivationRange'] = nothing();
  let selectionCircleSize: CreatureHeaderV10['selectionCircleSize'] = nothing();
  let shieldFlags: CreatureHeaderV10['shieldFlags'] = nothing();
  let fieldOfVision: CreatureHeaderV10['fieldOfVision'] = nothing();
  let attributeFlags: CreatureHeaderV10['attributeFlags'] = nothing();

  if (meta.isBg1 || meta.isBg2 || meta.isBg1ee) {
    trackingTarget = reader.string(32, true);
  }
  else if (meta.isPstee) {
    currentThiefClassExperience = reader.uint();
    currentMageClassExperience = reader.uint();
    goodVariableIncrementValue = reader.byte();
    lawVariableIncrementValue = reader.byte();
    ladyVariableIncrementValue = reader.byte();
    faction = reader.byte();
    team = reader.byte();
    species = reader.map.byte(x => externalOffsetMap.parseExternal(x, meta.ids.get('race.ids')!.entries));
    dialogueActivationRange = reader.byte();
    selectionCircleSize = reader.byte();
    shieldFlags = reader.map.byte(offsetMap.shieldFlags.parseFlags);
    fieldOfVision = reader.byte();
    attributeFlags = reader.map.uint(offsetMap.attributeFlags.parseFlags);
    reader.skip.custom(10);
  }
  else throw new Error(`This parser support bg1, bg2, bgee, pstee, but got an unsupported format ${meta.gameName}`);

  const strRefsPertainingToCharacter: CreatureHeaderV10['strRefsPertainingToCharacter'] = [];
  const maxStrRefsPertainingToCharacter = 100;
  for (let i = 0; i < maxStrRefsPertainingToCharacter; i++) {
    const strRef = reader.uint();
    if (strRef != meta.emptyInt) strRefsPertainingToCharacter.push(strRef);
  }

  const levelFirstClass = reader.byte();
  const levelSecondClass = reader.byte();
  const levelThirdClass = reader.byte();
  const sex = reader.map.byte(offsetMap.sex.parse);
  const strength = reader.byte();
  const strengthPercentageBonus = reader.byte();
  const intelligence = reader.byte();
  const wisdom = reader.byte();
  const dexterity = reader.byte();
  const constitution = reader.byte();
  const charisma = reader.byte();
  const morale = reader.byte();
  const moraleBreak = reader.byte();
  const racialEnemy = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.ids.get('race.ids')!.entries));
  const moraleRecoveryTime = reader.short();

  //

  let deity: CreatureHeaderV10['deity'] = nothing();
  let diety: CreatureHeaderV10['diety'] = nothing();
  let kitInformation: CreatureHeaderV10['kitInformation'] = nothing();

  if (!meta.isPstee && meta.ids.has('kit.ids')) {
    kitInformation = reader.map.uint(offsetMap.kitInformation.parse);
  };

  const deityIds = 'deity.ids';
  if (meta.ids.has(deityIds)) deity = reader.map.short(x => externalOffsetMap.parseExternal(x, meta.ids.get(deityIds)!.entries));

  const dietyIds = 'diety.ids';
  if (meta.ids.has(dietyIds)) diety = reader.map.short(x => externalOffsetMap.parseExternal(x, meta.ids.get(dietyIds)!.entries));

  if (!meta.ids.has(deityIds) && !meta.ids.has(dietyIds)) reader.skip.short();

  let mageType: CreatureHeaderV10['mageType'];
  const magespecIds = 'magespec.ids';
  if (meta.ids.has(magespecIds)) mageType = reader.map.short(x => externalOffsetMap.parseFlagsExternal(x, meta.ids.get(magespecIds)!.entries));
  else mageType = reader.map.short(offsetMap.defaultMageTypes.parseFlags);

  //

  const creatureScriptOverrideRef = reader.string(8);
  const creatureScriptClassRef = reader.string(8);
  const creatureScriptRaceRef = reader.string(8);
  const creatureScriptGeneralRef = reader.string(8);
  const creatureScriptDefaultRef = reader.string(8);
  const enemyAlly = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.ids.get('ea.ids')!.entries));
  const general = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.ids.get('general.ids')!.entries));
  const race = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.ids.get('race.ids')!.entries));
  const theClass = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.ids.get('class.ids')!.entries));
  const specific = reader.map.ubyte(offsetMap.specific.parse);
  const gender = reader.map.ubyte(offsetMap.gender.parse);

  //

  const objectSpecs: CreatureHeaderV10['objectSpecs'] = [];
  const maxObjectSpecs = 5;
  for (let i = 0; i < maxObjectSpecs; i++) {
    const objectSpec = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, meta.ids.get('object.ids')!.entries)); // TODO [snow]: should I use ObjectIdsReferencesV10 here from docs?
    objectSpecs.push(objectSpec);
  }

  //

  const alignment = reader.map.byte(offsetMap.alignment.parse);
  const globalActorEnumerationValue = reader.short();
  const localAreaActorEnumerationValue = reader.short();

  //

  let scriptName: CreatureHeaderV10['scriptName'] = nothing();
  let deathVariable: CreatureHeaderV10['deathVariable'] = nothing();
  if (meta.isPstee) {
    scriptName = reader.string(32);
  }
  else {
    deathVariable = reader.string(32);
  };

  //

  const knownSpellsOffset = reader.uint();
  const knownSpellsCount = reader.uint();
  const spellMemorizationInfoOffset = reader.uint();
  const spellMemorizationInfoEntriesCount = reader.uint();
  const memorizedSpellsOffset = reader.uint();
  const memorizedSpellsCount = reader.uint();
  const offsetToItemSlots = reader.uint();
  const offsetToItems = reader.uint();
  const countOfItems = reader.uint();
  const offsetToEffects = reader.uint();
  const countOfEffects = reader.uint();
  const dialogFileRef = reader.string(8);

  return {
    signature: meta.signature,
    version: meta.version,
    longNameRef,
    longNameTlk: nothing(),
    shortNameRef,
    shortNameTlk: nothing(),
    creatureFlags,
    xpGainedForKilling,
    creaturePowerLevelOrXpOfCreature,
    goldCarried,
    permanentStatusFlags,
    currentHitPoints,
    maximumHitPoints,
    animationId,
    metalColourIndex,
    minorColourIndex,
    majorColourIndex,
    skinColourIndex,
    leatherColourIndex,
    armorColourIndex,
    hairColourIndex,
    effStructureVersion,
    smallPortrait,
    largePortrait,
    reputation,
    hideInShadows,
    armorClassNatural,
    armorClassEffective,
    armorClassCrushingAttacksModifier,
    armorClassMissileAttacksModifier,
    armorClassPiercingAttacksModifier,
    armorClassSlashingAttacksModifier,
    thac0,
    numberOfAttacks,
    saveVersusDeath,
    saveVersusWands,
    saveVersusPolymorph,
    saveVersusBreathAttacks,
    saveVersusSpells,
    resistFire,
    resistCold,
    resistElectricity,
    resistAcid,
    resistMagic,
    resistMagicFire,
    resistMagicCold,
    resistSlashing,
    resistCrushing,
    resistPiercing,
    resistMissile,
    detectIllusion,
    setTraps,
    lore,
    lockpicking,
    moveSilently,
    findOrDisarmTraps,
    pickPockets,
    fatigue,
    intoxication,
    luck,
    largeSwordsProficiencyBg1,
    smallSwordsProficiencyBg1,
    bowsProficiencyBg1,
    spearsProficiencyBg1,
    bluntProficiencyBg1,
    spikedProficiencyBg1,
    axeProficiencyBg1,
    missileProficiencyBg1,
    unusedProficiency1,
    unusedProficiency2,
    unusedProficiency3,
    unusedProficiency4,
    unusedProficiency5,
    unspentProficienciesPstee,
    numberOfAvailableInventorySlotsPstee,
    nightmareModeModifiersApplied,
    translucency,
    reputationGainOrLossWhenKilledInBg12_or_MurderVariableIncrementValueIsPstee,
    reputationGainOrLossWhenJoiningPartyBgee,
    reputationGainOrLossWhenLeavingPartyBgee,
    turnUndeadLevel,
    trackingSkill,
    trackingTarget,
    currentThiefClassExperience,
    currentMageClassExperience,
    goodVariableIncrementValue,
    lawVariableIncrementValue,
    ladyVariableIncrementValue,
    faction,
    team,
    species,
    dialogueActivationRange,
    selectionCircleSize,
    shieldFlags,
    fieldOfVision,
    attributeFlags,
    strRefsPertainingToCharacter,
    levelFirstClass,
    levelSecondClass,
    levelThirdClass,
    sex,
    strength,
    strengthPercentageBonus,
    intelligence,
    wisdom,
    dexterity,
    constitution,
    charisma,
    morale,
    moraleBreak,
    racialEnemy,
    moraleRecoveryTime,
    deity,
    diety,
    mageType,
    kitInformation,
    creatureScriptOverrideRef,
    creatureScriptClassRef,
    creatureScriptRaceRef,
    creatureScriptGeneralRef,
    creatureScriptDefaultRef,
    enemyAlly,
    general,
    race,
    theClass,
    specific,
    gender,
    objectSpecs,
    alignment,
    globalActorEnumerationValue,
    localAreaActorEnumerationValue,
    scriptName,
    deathVariable,
    knownSpellsOffset,
    knownSpellsCount,
    spellMemorizationInfoOffset,
    spellMemorizationInfoEntriesCount,
    memorizedSpellsOffset,
    memorizedSpellsCount,
    offsetToItemSlots,
    offsetToItems,
    countOfItems,
    offsetToEffects,
    countOfEffects,
    dialogFileRef,
  };
};

export default parseHeaderV10;
