import { externalOffsetMap } from '@/shared/extendedMap.js';
import { extendMap } from './1.parseHeaderV10.types.js';
import { normalizeRef } from '@/shared/numbers.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { CreatureHeaderV10 } from './1.parseHeaderV10.types.js';
import type { Ids } from '../../../ids/index.js';

type ParseHeaderV10Props = Readonly<{
  reader: BufferReader;
  ids: Map<string, Ids>;
}>;
export const parseHeaderV10 = ({
  reader,
  ids,
}: ParseHeaderV10Props): CreatureHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const nameRef = normalizeRef(reader.uint());
  const tooltipRef = normalizeRef(reader.uint());
  const flags = reader.map.uint(extendMap.flags.parseFlags);
  const xpGainedForKilling = reader.uint();
  const powerLevelOrXp = reader.uint();
  const goldCarried = reader.uint();
  const status = reader.map.uint(extendMap.status.parseFlags);
  const currentHp = reader.short();
  const maximumHp = reader.short();
  const animationId = reader.uint();
  const metalColourIndex = reader.byte();
  const minorColourIndex = reader.byte();
  const majorColourIndex = reader.byte();
  const skinColourIndex = reader.byte();
  const leatherColourIndex = reader.byte();
  const armorColourIndex = reader.byte();
  const hairColourIndex = reader.byte();
  const effectVersion = reader.byte();
  if (effectVersion !== 0 && effectVersion !== 1) throw new Error(`Unsupported effectVersion '${effectVersion}' for creature`);
  const smallPortrait = reader.string(8);
  const largePortrait = reader.string(8);
  const reputation = reader.ubyte();
  const hideInShadows = reader.byte();
  const naturalAc = reader.short();
  const effectiveAc = reader.short();
  const crushingAcModifier = reader.short();
  const missileAcModifier = reader.short();
  const piercingAcModifier = reader.short();
  const slashingAcModifier = reader.short();
  const thac0 = reader.byte();
  const numberOfAttacksPerRound = reader.byte();
  const saveVersusDeath = reader.byte();
  const saveVersusWands = reader.byte();
  const saveVersusPolymorph = reader.byte();
  const saveVersusBreath = reader.byte();
  const saveVersusSpells = reader.byte();
  const fireResistance = reader.byte();
  const coldResistance = reader.byte();
  const electricityResistance = reader.byte();
  const acidResistance = reader.byte();
  const magicResistance = reader.byte();
  const magicFireResistance = reader.byte();
  const magicColdResistance = reader.byte();
  const slashingResistance = reader.byte();
  const crushingResistance = reader.byte();
  const piercingResistance = reader.byte();
  const missileResistance = reader.byte();
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
  const largeSwordProficiency = reader.byte();
  const smallSwordProficiency = reader.byte();
  const bowProficiency = reader.byte();
  const spearProficiency = reader.byte();
  const bluntProficiency = reader.byte();
  const spikedProficiency = reader.byte();
  const axeProficiency = reader.byte();
  const missileProficiency = reader.byte();
  const unusedProficiency1 = reader.byte();
  const unusedProficiency2 = reader.byte();
  const unusedProficiency3 = reader.byte();
  const unusedProficiency4 = reader.byte();
  const unusedProficiency5 = reader.byte();
  const unspentProficiencies = reader.byte();
  const availableInventorySlotsCount = reader.byte();
  const nightmareModeModifiersApplied = reader.byte();
  const translucency = reader.byte();
  const murderIncrementBy = reader.byte();
  reader.skip.byte();
  reader.skip.byte();
  const turnUndeadLevel = reader.byte();
  const tracking = reader.byte();
  const currentThiefClassXp = reader.uint();
  const currentMageClassXp = reader.uint();
  const goodIncrementBy = reader.byte();
  const lawIncrementBy = reader.byte();
  const ladyIncrementBy = reader.byte();
  const faction = reader.byte();
  const team = reader.byte();
  const species = reader.map.byte(x => externalOffsetMap.parseExternal(x, ids.get('race.ids')!.entries));
  const dialogueActivationRange = reader.byte();
  const collisionRadius = reader.byte();
  const shieldFlags = reader.map.byte(extendMap.shieldFlags.parseFlags);
  const fieldOfVision = reader.byte();
  const attributes = reader.map.uint(extendMap.attributes.parseFlags);
  reader.skip.custom(10);
  const initialMeetingSoundRef = reader.int();
  const moraleSoundRef = reader.int();
  const happySoundRef = reader.int();
  const unhappyAnnoyedSoundRef = reader.int();
  const unhappySeriousSoundRef = reader.int();
  const unhappyBreakingPointSoundRef = reader.int();
  const leaderSoundRef = reader.int();
  const tiredSoundRef = reader.int();
  const boredSoundRef = reader.int();
  const battleCry1SoundRef = reader.int();
  const battleCry2SoundRef = reader.int();
  const battleCry3SoundRef = reader.int();
  const battleCry4SoundRef = reader.int();
  const battleCry5SoundRef = reader.int();
  const attack1SoundRef = reader.int();
  const attack2SoundRef = reader.int();
  const attack3SoundRef = reader.int();
  const attack4SoundRef = reader.int();
  const damageSoundRef = reader.int();
  const dyingSoundRef = reader.int();
  const hurtSoundRef = reader.int();
  const areaForestSoundRef = reader.int();
  const areaCitySoundRef = reader.int();
  const areaDungeonSoundRef = reader.int();
  const areaDaySoundRef = reader.int();
  const areaNightSoundRef = reader.int();
  const selectCommon1SoundRef = reader.int();
  const selectCommon2SoundRef = reader.int();
  const selectCommon3SoundRef = reader.int();
  const selectCommon4SoundRef = reader.int();
  const selectCommon5SoundRef = reader.int();
  const selectCommon6SoundRef = reader.int();
  const selectAction1SoundRef = reader.int();
  const selectAction2SoundRef = reader.int();
  const selectAction3SoundRef = reader.int();
  const selectAction4SoundRef = reader.int();
  const selectAction5SoundRef = reader.int();
  const selectAction6SoundRef = reader.int();
  const selectAction7SoundRef = reader.int();
  const interaction1SoundRef = reader.int();
  const interaction2SoundRef = reader.int();
  const interaction3SoundRef = reader.int();
  const interaction4SoundRef = reader.int();
  const interaction5SoundRef = reader.int();
  const insult1SoundRef = reader.int();
  const insult2SoundRef = reader.int();
  const insult3SoundRef = reader.int();
  const compliment1SoundRef = reader.int();
  const compliment2SoundRef = reader.int();
  const compliment3SoundRef = reader.int();
  const special1SoundRef = reader.int();
  const special2SoundRef = reader.int();
  const special3SoundRef = reader.int();
  const reactToDieGeneralSoundRef = reader.int();
  const reactToDieSpecificSoundRef = reader.int();
  const responseToCompliment1SoundRef = reader.int();
  const responseToCompliment2SoundRef = reader.int();
  const responseToCompliment3SoundRef = reader.int();
  const responseToInsult1SoundRef = reader.int();
  const responseToInsult2SoundRef = reader.int();
  const responseToInsult3SoundRef = reader.int();
  const dialogHostileSoundRef = reader.int();
  const dialogDefaultSoundRef = reader.int();
  const selectRare1SoundRef = reader.int();
  const selectRare2SoundRef = reader.int();
  const criticalHitSoundRef = reader.int();
  const criticalMissSoundRef = reader.int();
  const targetImmuneSoundRef = reader.int();
  const inventoryFullSoundRef = reader.int();
  const pickedPicketSoundRef = reader.int();
  const hiddenInShadowsSoundRef = reader.int();
  const spellDisruptedSoundRef = reader.int();
  const setTrapSoundRef = reader.int();
  const existance4SoundRef = reader.int();
  const bioSoundRef = reader.int();
  const sound1Ref = reader.int();
  const sound2Ref = reader.int();
  const sound3Ref = reader.int();
  const sound4Ref = reader.int();
  const sound5Ref = reader.int();
  const sound6Ref = reader.int();
  const sound7Ref = reader.int();
  const sound8Ref = reader.int();
  const sound9Ref = reader.int();
  const sound10Ref = reader.int();
  const sound11Ref = reader.int();
  const sound12Ref = reader.int();
  const sound13Ref = reader.int();
  const sound14Ref = reader.int();
  const sound15Ref = reader.int();
  const sound16Ref = reader.int();
  const sound17Ref = reader.int();
  const sound18Ref = reader.int();
  const sound19Ref = reader.int();
  const sound20Ref = reader.int();
  const sound21Ref = reader.int();
  const sound22Ref = reader.int();
  const sound23Ref = reader.int();
  const sound24Ref = reader.int();
  const sound25Ref = reader.int();
  const levelFirstClass = reader.byte();
  const levelSecondClass = reader.byte();
  const levelThirdClass = reader.byte();
  const sex = reader.map.byte(extendMap.sex.parse);
  const strength = reader.byte();
  const strengthPercentageBonus = reader.byte();
  const intelligence = reader.byte();
  const wisdom = reader.byte();
  const dexterity = reader.byte();
  const constitution = reader.byte();
  const charisma = reader.byte();
  const morale = reader.byte();
  const moraleBreak = reader.byte();
  const racialEnemy = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('race.ids')!.entries));
  const moraleRecoveryTime = reader.short();
  const deity = reader.map.short<string>(x => externalOffsetMap.parseExternal(x, ids.get('diety.ids')!.entries)); // in pstee it is diety, not deity
  const mageType = reader.map.short<CreatureHeaderV10['mageType']>(x => externalOffsetMap.parseFlagsExternal(x, ids.get('magespec.ids')!.entries));
  const overrideScriptRef = reader.string(8);
  const classScriptRef = reader.string(8);
  const raceScriptRef = reader.string(8);
  const generalScriptRef = reader.string(8);
  const defaultScriptRef = reader.string(8);
  const allegiance = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('ea.ids')!.entries));
  const general = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('general.ids')!.entries));
  const race = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('race.ids')!.entries));
  const theClass = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('class.ids')!.entries));
  const specific = reader.map.ubyte(extendMap.specific.parse);
  const gender = reader.map.ubyte(extendMap.gender.parse);
  const objectSpec1 = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('object.ids')!.entries)); // TODO [snow]: should I use ObjectIdsReferencesV10 here from docs?
  const objectSpec2 = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('object.ids')!.entries));
  const objectSpec3 = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('object.ids')!.entries));
  const objectSpec4 = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('object.ids')!.entries));
  const objectSpec5 = reader.map.ubyte(x => externalOffsetMap.parseExternal(x, ids.get('object.ids')!.entries));
  const alignment = reader.map.byte(extendMap.alignment.parse);
  const globalIdentifier = reader.short();
  const localIdentifier = reader.short();
  const scriptName = reader.string(32);
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
  const dialogueRef = reader.string(8);

  return {
    signature: 'cre',
    version: 'v1.0',
    nameRef,
    tooltipRef,
    flags,
    xpGainedForKilling,
    powerLevelOrXp,
    goldCarried,
    status,
    currentHp,
    maximumHp,
    animationId,
    metalColourIndex,
    minorColourIndex,
    majorColourIndex,
    skinColourIndex,
    leatherColourIndex,
    armorColourIndex,
    hairColourIndex,
    effectVersion,
    smallPortrait,
    largePortrait,
    reputation,
    hideInShadows,
    naturalAc,
    effectiveAc,
    crushingAcModifier,
    missileAcModifier,
    piercingAcModifier,
    slashingAcModifier,
    thac0,
    numberOfAttacksPerRound,
    saveVersusDeath,
    saveVersusWands,
    saveVersusPolymorph,
    saveVersusBreath,
    saveVersusSpells,
    fireResistance,
    coldResistance,
    electricityResistance,
    acidResistance,
    magicResistance,
    magicFireResistance,
    magicColdResistance,
    slashingResistance,
    crushingResistance,
    piercingResistance,
    missileResistance,
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
    largeSwordProficiency,
    smallSwordProficiency,
    bowProficiency,
    spearProficiency,
    bluntProficiency,
    spikedProficiency,
    axeProficiency,
    missileProficiency,
    unusedProficiency1,
    unusedProficiency2,
    unusedProficiency3,
    unusedProficiency4,
    unusedProficiency5,
    unspentProficiencies,
    availableInventorySlotsCount,
    nightmareModeModifiersApplied,
    translucency,
    murderIncrementBy,
    turnUndeadLevel,
    tracking,
    currentThiefClassXp,
    currentMageClassXp,
    goodIncrementBy,
    lawIncrementBy,
    ladyIncrementBy,
    faction,
    team,
    species,
    dialogueActivationRange,
    collisionRadius,
    shieldFlags,
    fieldOfVision,
    attributes,
    initialMeetingSoundRef,
    moraleSoundRef,
    happySoundRef,
    unhappyAnnoyedSoundRef,
    unhappySeriousSoundRef,
    unhappyBreakingPointSoundRef,
    leaderSoundRef,
    tiredSoundRef,
    boredSoundRef,
    battleCry1SoundRef,
    battleCry2SoundRef,
    battleCry3SoundRef,
    battleCry4SoundRef,
    battleCry5SoundRef,
    attack1SoundRef,
    attack2SoundRef,
    attack3SoundRef,
    attack4SoundRef,
    damageSoundRef,
    dyingSoundRef,
    hurtSoundRef,
    areaForestSoundRef,
    areaCitySoundRef,
    areaDungeonSoundRef,
    areaDaySoundRef,
    areaNightSoundRef,
    selectCommon1SoundRef,
    selectCommon2SoundRef,
    selectCommon3SoundRef,
    selectCommon4SoundRef,
    selectCommon5SoundRef,
    selectCommon6SoundRef,
    selectAction1SoundRef,
    selectAction2SoundRef,
    selectAction3SoundRef,
    selectAction4SoundRef,
    selectAction5SoundRef,
    selectAction6SoundRef,
    selectAction7SoundRef,
    interaction1SoundRef,
    interaction2SoundRef,
    interaction3SoundRef,
    interaction4SoundRef,
    interaction5SoundRef,
    insult1SoundRef,
    insult2SoundRef,
    insult3SoundRef,
    compliment1SoundRef,
    compliment2SoundRef,
    compliment3SoundRef,
    special1SoundRef,
    special2SoundRef,
    special3SoundRef,
    reactToDieGeneralSoundRef,
    reactToDieSpecificSoundRef,
    responseToCompliment1SoundRef,
    responseToCompliment2SoundRef,
    responseToCompliment3SoundRef,
    responseToInsult1SoundRef,
    responseToInsult2SoundRef,
    responseToInsult3SoundRef,
    dialogHostileSoundRef,
    dialogDefaultSoundRef,
    selectRare1SoundRef,
    selectRare2SoundRef,
    criticalHitSoundRef,
    criticalMissSoundRef,
    targetImmuneSoundRef,
    inventoryFullSoundRef,
    pickedPicketSoundRef,
    hiddenInShadowsSoundRef,
    spellDisruptedSoundRef,
    setTrapSoundRef,
    existance4SoundRef,
    bioSoundRef,
    sound1Ref,
    sound2Ref,
    sound3Ref,
    sound4Ref,
    sound5Ref,
    sound6Ref,
    sound7Ref,
    sound8Ref,
    sound9Ref,
    sound10Ref,
    sound11Ref,
    sound12Ref,
    sound13Ref,
    sound14Ref,
    sound15Ref,
    sound16Ref,
    sound17Ref,
    sound18Ref,
    sound19Ref,
    sound20Ref,
    sound21Ref,
    sound22Ref,
    sound23Ref,
    sound24Ref,
    sound25Ref,
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
    mageType,
    overrideScriptRef,
    classScriptRef,
    raceScriptRef,
    generalScriptRef,
    defaultScriptRef,
    allegiance,
    general,
    race,
    theClass,
    specific,
    gender,
    objectSpec1,
    objectSpec2,
    objectSpec3,
    objectSpec4,
    objectSpec5,
    alignment,
    globalIdentifier,
    localIdentifier,
    scriptName,
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
    dialogueRef,
  };
};
