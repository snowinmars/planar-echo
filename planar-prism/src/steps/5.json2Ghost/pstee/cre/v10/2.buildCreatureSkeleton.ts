import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';

import type { GhostCreatureV10, GhostCreatureV11 } from '../../../types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV11;

const createNpcLowercaseId = (resourceName: string): string => {
  const candidate = resourceName.split('.')[0]!.replace(`'`, ``);
  // @ts-expect-error : js is a meme, but efficient meme
  const isDigit = candidate[0] > -1;
  if (isDigit) return `_${candidate}`;
  return candidate;
};

const buildCreatureSkeletonV10 = (cre: GhostCreatureV10, discover: DiscoverNext): string => {
  const npcLowercaseId = createNpcLowercaseId(cre.resourceName);

  discover({ type: 'who', name: npcLowercaseId });

  const writer = createWriter();
  writer.writeLine(`import type { UntranslatedCreature } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${cre.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${npcLowercaseId}CreatureSkeleton = () => {`);
  writer.writeLine(`const creature: UntranslatedCreature = {`, 2);

  writer.writeLine(`version: '${cre.header.version}',`, 4);
  writeFlags(
    writer,
    cre.header.flags,
    'flags',
    4,
  );
  writer.writeLine(`xpGainedForKilling: ${cre.header.xpGainedForKilling},`, 4);
  writer.writeLine(`powerLevelOrXp: ${cre.header.powerLevelOrXp},`, 4);
  writer.writeLine(`goldCarried: ${cre.header.goldCarried},`, 4);
  writeFlags(
    writer,
    cre.header.status,
    'status',
    4,
  );
  writer.writeLine(`currentHp: ${cre.header.currentHp},`, 4);
  writer.writeLine(`maximumHp: ${cre.header.maximumHp},`, 4);
  writer.writeLine(`animationId: ${cre.header.animationId},`, 4);
  writer.writeLine(`metalColourIndex: ${cre.header.metalColourIndex},`, 4);
  writer.writeLine(`minorColourIndex: ${cre.header.minorColourIndex},`, 4);
  writer.writeLine(`majorColourIndex: ${cre.header.majorColourIndex},`, 4);
  writer.writeLine(`skinColourIndex: ${cre.header.skinColourIndex},`, 4);
  writer.writeLine(`leatherColourIndex: ${cre.header.leatherColourIndex},`, 4);
  writer.writeLine(`armorColourIndex: ${cre.header.armorColourIndex},`, 4);
  writer.writeLine(`hairColourIndex: ${cre.header.hairColourIndex},`, 4);
  writer.writeLine(`effectVersion: ${cre.header.effectVersion},`, 4);
  writer.writeLine(`smallPortrait: '${cre.header.smallPortrait}',`, 4);
  writer.writeLine(`largePortrait: '${cre.header.largePortrait}',`, 4);
  writer.writeLine(`reputation: ${cre.header.reputation},`, 4);
  writer.writeLine(`hideInShadows: ${cre.header.hideInShadows},`, 4);
  writer.writeLine(`naturalAc: ${cre.header.naturalAc},`, 4);
  writer.writeLine(`effectiveAc: ${cre.header.effectiveAc},`, 4);
  writer.writeLine(`crushingAcModifier: ${cre.header.crushingAcModifier},`, 4);
  writer.writeLine(`missileAcModifier: ${cre.header.missileAcModifier},`, 4);
  writer.writeLine(`piercingAcModifier: ${cre.header.piercingAcModifier},`, 4);
  writer.writeLine(`slashingAcModifier: ${cre.header.slashingAcModifier},`, 4);
  writer.writeLine(`thac0: ${cre.header.thac0},`, 4);
  writer.writeLine(`numberOfAttacksPerRound: ${cre.header.numberOfAttacksPerRound},`, 4);
  writer.writeLine(`saveVersusDeath: ${cre.header.saveVersusDeath},`, 4);
  writer.writeLine(`saveVersusWands: ${cre.header.saveVersusWands},`, 4);
  writer.writeLine(`saveVersusPolymorph: ${cre.header.saveVersusPolymorph},`, 4);
  writer.writeLine(`saveVersusBreath: ${cre.header.saveVersusBreath},`, 4);
  writer.writeLine(`saveVersusSpells: ${cre.header.saveVersusSpells},`, 4);
  writer.writeLine(`fireResistance: ${cre.header.fireResistance},`, 4);
  writer.writeLine(`coldResistance: ${cre.header.coldResistance},`, 4);
  writer.writeLine(`electricityResistance: ${cre.header.electricityResistance},`, 4);
  writer.writeLine(`acidResistance: ${cre.header.acidResistance},`, 4);
  writer.writeLine(`magicResistance: ${cre.header.magicResistance},`, 4);
  writer.writeLine(`magicFireResistance: ${cre.header.magicFireResistance},`, 4);
  writer.writeLine(`magicColdResistance: ${cre.header.magicColdResistance},`, 4);
  writer.writeLine(`slashingResistance: ${cre.header.slashingResistance},`, 4);
  writer.writeLine(`crushingResistance: ${cre.header.crushingResistance},`, 4);
  writer.writeLine(`piercingResistance: ${cre.header.piercingResistance},`, 4);
  writer.writeLine(`missileResistance: ${cre.header.missileResistance},`, 4);
  writer.writeLine(`detectIllusion: ${cre.header.detectIllusion},`, 4);
  writer.writeLine(`setTraps: ${cre.header.setTraps},`, 4);
  writer.writeLine(`lore: ${cre.header.lore},`, 4);
  writer.writeLine(`lockpicking: ${cre.header.lockpicking},`, 4);
  writer.writeLine(`moveSilently: ${cre.header.moveSilently},`, 4);
  writer.writeLine(`findOrDisarmTraps: ${cre.header.findOrDisarmTraps},`, 4);
  writer.writeLine(`pickPockets: ${cre.header.pickPockets},`, 4);
  writer.writeLine(`fatigue: ${cre.header.fatigue},`, 4);
  writer.writeLine(`intoxication: ${cre.header.intoxication},`, 4);
  writer.writeLine(`luck: ${cre.header.luck},`, 4);
  writer.writeLine(`largeSwordProficiency: ${cre.header.largeSwordProficiency},`, 4);
  writer.writeLine(`smallSwordProficiency: ${cre.header.smallSwordProficiency},`, 4);
  writer.writeLine(`bowProficiency: ${cre.header.bowProficiency},`, 4);
  writer.writeLine(`spearProficiency: ${cre.header.spearProficiency},`, 4);
  writer.writeLine(`bluntProficiency: ${cre.header.bluntProficiency},`, 4);
  writer.writeLine(`spikedProficiency: ${cre.header.spikedProficiency},`, 4);
  writer.writeLine(`axeProficiency: ${cre.header.axeProficiency},`, 4);
  writer.writeLine(`missileProficiency: ${cre.header.missileProficiency},`, 4);
  writer.writeLine(`unusedProficiency1: ${cre.header.unusedProficiency1},`, 4);
  writer.writeLine(`unusedProficiency2: ${cre.header.unusedProficiency2},`, 4);
  writer.writeLine(`unusedProficiency3: ${cre.header.unusedProficiency3},`, 4);
  writer.writeLine(`unusedProficiency4: ${cre.header.unusedProficiency4},`, 4);
  writer.writeLine(`unusedProficiency5: ${cre.header.unusedProficiency5},`, 4);
  writer.writeLine(`unspentProficiencies: ${cre.header.unspentProficiencies},`, 4);
  writer.writeLine(`availableInventorySlotsCount: ${cre.header.availableInventorySlotsCount},`, 4);
  writer.writeLine(`nightmareModeModifiersApplied: ${cre.header.nightmareModeModifiersApplied},`, 4);
  writer.writeLine(`translucency: ${cre.header.translucency},`, 4);
  writer.writeLine(`murderIncrementBy: ${cre.header.murderIncrementBy},`, 4);
  writer.writeLine(`turnUndeadLevel: ${cre.header.turnUndeadLevel},`, 4);
  writer.writeLine(`tracking: ${cre.header.tracking},`, 4);
  if (cre.header.currentThiefClassXp) writer.writeLine(`currentThiefClassXp: ${cre.header.currentThiefClassXp},`, 4);
  if (cre.header.currentMageClassXp) writer.writeLine(`currentMageClassXp: ${cre.header.currentMageClassXp},`, 4);
  if (cre.header.goodIncrementBy) writer.writeLine(`goodIncrementBy: ${cre.header.goodIncrementBy},`, 4);
  if (cre.header.lawIncrementBy) writer.writeLine(`lawIncrementBy: ${cre.header.lawIncrementBy},`, 4);
  if (cre.header.ladyIncrementBy) writer.writeLine(`ladyIncrementBy: ${cre.header.ladyIncrementBy},`, 4);
  if (cre.header.faction) writer.writeLine(`faction: ${cre.header.faction},`, 4);
  if (cre.header.team) writer.writeLine(`team: ${cre.header.team},`, 4);
  if (cre.header.species) writer.writeLine(`species: '${cre.header.species}',`, 4);
  if (cre.header.dialogueActivationRange) writer.writeLine(`dialogueActivationRange: ${cre.header.dialogueActivationRange},`, 4);
  if (cre.header.collisionRadius) writer.writeLine(`collisionRadius: ${cre.header.collisionRadius},`, 4);
  if (cre.header.shieldFlags) writeFlags(
    writer,
    cre.header.shieldFlags,
    'shieldFlags',
    4,
  );
  if (cre.header.fieldOfVision) writer.writeLine(`fieldOfVision: ${cre.header.fieldOfVision},`, 4);
  if (cre.header.attributes) writeFlags(
    writer,
    cre.header.attributes,
    'attributes',
    4,
  );
  writer.writeLine(`initialMeetingSoundRef: ${cre.header.initialMeetingSoundRef},`, 4);
  writer.writeLine(`moraleSoundRef: ${cre.header.moraleSoundRef},`, 4);
  writer.writeLine(`happySoundRef: ${cre.header.happySoundRef},`, 4);
  writer.writeLine(`unhappyAnnoyedSoundRef: ${cre.header.unhappyAnnoyedSoundRef},`, 4);
  writer.writeLine(`unhappySeriousSoundRef: ${cre.header.unhappySeriousSoundRef},`, 4);
  writer.writeLine(`unhappyBreakingPointSoundRef: ${cre.header.unhappyBreakingPointSoundRef},`, 4);
  writer.writeLine(`leaderSoundRef: ${cre.header.leaderSoundRef},`, 4);
  writer.writeLine(`tiredSoundRef: ${cre.header.tiredSoundRef},`, 4);
  writer.writeLine(`boredSoundRef: ${cre.header.boredSoundRef},`, 4);
  writer.writeLine(`battleCry1SoundRef: ${cre.header.battleCry1SoundRef},`, 4);
  writer.writeLine(`battleCry2SoundRef: ${cre.header.battleCry2SoundRef},`, 4);
  writer.writeLine(`battleCry3SoundRef: ${cre.header.battleCry3SoundRef},`, 4);
  writer.writeLine(`battleCry4SoundRef: ${cre.header.battleCry4SoundRef},`, 4);
  writer.writeLine(`battleCry5SoundRef: ${cre.header.battleCry5SoundRef},`, 4);
  writer.writeLine(`attack1SoundRef: ${cre.header.attack1SoundRef},`, 4);
  writer.writeLine(`attack2SoundRef: ${cre.header.attack2SoundRef},`, 4);
  writer.writeLine(`attack3SoundRef: ${cre.header.attack3SoundRef},`, 4);
  writer.writeLine(`attack4SoundRef: ${cre.header.attack4SoundRef},`, 4);
  writer.writeLine(`damageSoundRef: ${cre.header.damageSoundRef},`, 4);
  writer.writeLine(`dyingSoundRef: ${cre.header.dyingSoundRef},`, 4);
  writer.writeLine(`hurtSoundRef: ${cre.header.hurtSoundRef},`, 4);
  writer.writeLine(`areaForestSoundRef: ${cre.header.areaForestSoundRef},`, 4);
  writer.writeLine(`areaCitySoundRef: ${cre.header.areaCitySoundRef},`, 4);
  writer.writeLine(`areaDungeonSoundRef: ${cre.header.areaDungeonSoundRef},`, 4);
  writer.writeLine(`areaDaySoundRef: ${cre.header.areaDaySoundRef},`, 4);
  writer.writeLine(`areaNightSoundRef: ${cre.header.areaNightSoundRef},`, 4);
  writer.writeLine(`selectCommon1SoundRef: ${cre.header.selectCommon1SoundRef},`, 4);
  writer.writeLine(`selectCommon2SoundRef: ${cre.header.selectCommon2SoundRef},`, 4);
  writer.writeLine(`selectCommon3SoundRef: ${cre.header.selectCommon3SoundRef},`, 4);
  writer.writeLine(`selectCommon4SoundRef: ${cre.header.selectCommon4SoundRef},`, 4);
  writer.writeLine(`selectCommon5SoundRef: ${cre.header.selectCommon5SoundRef},`, 4);
  writer.writeLine(`selectCommon6SoundRef: ${cre.header.selectCommon6SoundRef},`, 4);
  writer.writeLine(`selectAction1SoundRef: ${cre.header.selectAction1SoundRef},`, 4);
  writer.writeLine(`selectAction2SoundRef: ${cre.header.selectAction2SoundRef},`, 4);
  writer.writeLine(`selectAction3SoundRef: ${cre.header.selectAction3SoundRef},`, 4);
  writer.writeLine(`selectAction4SoundRef: ${cre.header.selectAction4SoundRef},`, 4);
  writer.writeLine(`selectAction5SoundRef: ${cre.header.selectAction5SoundRef},`, 4);
  writer.writeLine(`selectAction6SoundRef: ${cre.header.selectAction6SoundRef},`, 4);
  writer.writeLine(`selectAction7SoundRef: ${cre.header.selectAction7SoundRef},`, 4);
  writer.writeLine(`interaction1SoundRef: ${cre.header.interaction1SoundRef},`, 4);
  writer.writeLine(`interaction2SoundRef: ${cre.header.interaction2SoundRef},`, 4);
  writer.writeLine(`interaction3SoundRef: ${cre.header.interaction3SoundRef},`, 4);
  writer.writeLine(`interaction4SoundRef: ${cre.header.interaction4SoundRef},`, 4);
  writer.writeLine(`interaction5SoundRef: ${cre.header.interaction5SoundRef},`, 4);
  writer.writeLine(`insult1SoundRef: ${cre.header.insult1SoundRef},`, 4);
  writer.writeLine(`insult2SoundRef: ${cre.header.insult2SoundRef},`, 4);
  writer.writeLine(`insult3SoundRef: ${cre.header.insult3SoundRef},`, 4);
  writer.writeLine(`compliment1SoundRef: ${cre.header.compliment1SoundRef},`, 4);
  writer.writeLine(`compliment2SoundRef: ${cre.header.compliment2SoundRef},`, 4);
  writer.writeLine(`compliment3SoundRef: ${cre.header.compliment3SoundRef},`, 4);
  writer.writeLine(`special1SoundRef: ${cre.header.special1SoundRef},`, 4);
  writer.writeLine(`special2SoundRef: ${cre.header.special2SoundRef},`, 4);
  writer.writeLine(`special3SoundRef: ${cre.header.special3SoundRef},`, 4);
  writer.writeLine(`reactToDieGeneralSoundRef: ${cre.header.reactToDieGeneralSoundRef},`, 4);
  writer.writeLine(`reactToDieSpecificSoundRef: ${cre.header.reactToDieSpecificSoundRef},`, 4);
  writer.writeLine(`responseToCompliment1SoundRef: ${cre.header.responseToCompliment1SoundRef},`, 4);
  writer.writeLine(`responseToCompliment2SoundRef: ${cre.header.responseToCompliment2SoundRef},`, 4);
  writer.writeLine(`responseToCompliment3SoundRef: ${cre.header.responseToCompliment3SoundRef},`, 4);
  writer.writeLine(`responseToInsult1SoundRef: ${cre.header.responseToInsult1SoundRef},`, 4);
  writer.writeLine(`responseToInsult2SoundRef: ${cre.header.responseToInsult2SoundRef},`, 4);
  writer.writeLine(`responseToInsult3SoundRef: ${cre.header.responseToInsult3SoundRef},`, 4);
  writer.writeLine(`dialogHostileSoundRef: ${cre.header.dialogHostileSoundRef},`, 4);
  writer.writeLine(`dialogDefaultSoundRef: ${cre.header.dialogDefaultSoundRef},`, 4);
  writer.writeLine(`selectRare1SoundRef: ${cre.header.selectRare1SoundRef},`, 4);
  writer.writeLine(`selectRare2SoundRef: ${cre.header.selectRare2SoundRef},`, 4);
  writer.writeLine(`criticalHitSoundRef: ${cre.header.criticalHitSoundRef},`, 4);
  writer.writeLine(`criticalMissSoundRef: ${cre.header.criticalMissSoundRef},`, 4);
  writer.writeLine(`targetImmuneSoundRef: ${cre.header.targetImmuneSoundRef},`, 4);
  writer.writeLine(`inventoryFullSoundRef: ${cre.header.inventoryFullSoundRef},`, 4);
  writer.writeLine(`pickedPicketSoundRef: ${cre.header.pickedPicketSoundRef},`, 4);
  writer.writeLine(`hiddenInShadowsSoundRef: ${cre.header.hiddenInShadowsSoundRef},`, 4);
  writer.writeLine(`spellDisruptedSoundRef: ${cre.header.spellDisruptedSoundRef},`, 4);
  writer.writeLine(`setTrapSoundRef: ${cre.header.setTrapSoundRef},`, 4);
  writer.writeLine(`existance4SoundRef: ${cre.header.existance4SoundRef},`, 4);
  writer.writeLine(`bioSoundRef: ${cre.header.bioSoundRef},`, 4);
  writer.writeLine(`sound1Ref: ${cre.header.sound1Ref},`, 4);
  writer.writeLine(`sound2Ref: ${cre.header.sound2Ref},`, 4);
  writer.writeLine(`sound3Ref: ${cre.header.sound3Ref},`, 4);
  writer.writeLine(`sound4Ref: ${cre.header.sound4Ref},`, 4);
  writer.writeLine(`sound5Ref: ${cre.header.sound5Ref},`, 4);
  writer.writeLine(`sound6Ref: ${cre.header.sound6Ref},`, 4);
  writer.writeLine(`sound7Ref: ${cre.header.sound7Ref},`, 4);
  writer.writeLine(`sound8Ref: ${cre.header.sound8Ref},`, 4);
  writer.writeLine(`sound9Ref: ${cre.header.sound9Ref},`, 4);
  writer.writeLine(`sound10Ref: ${cre.header.sound10Ref},`, 4);
  writer.writeLine(`sound11Ref: ${cre.header.sound11Ref},`, 4);
  writer.writeLine(`sound12Ref: ${cre.header.sound12Ref},`, 4);
  writer.writeLine(`sound13Ref: ${cre.header.sound13Ref},`, 4);
  writer.writeLine(`sound14Ref: ${cre.header.sound14Ref},`, 4);
  writer.writeLine(`sound15Ref: ${cre.header.sound15Ref},`, 4);
  writer.writeLine(`sound16Ref: ${cre.header.sound16Ref},`, 4);
  writer.writeLine(`sound17Ref: ${cre.header.sound17Ref},`, 4);
  writer.writeLine(`sound18Ref: ${cre.header.sound18Ref},`, 4);
  writer.writeLine(`sound19Ref: ${cre.header.sound19Ref},`, 4);
  writer.writeLine(`sound20Ref: ${cre.header.sound20Ref},`, 4);
  writer.writeLine(`sound21Ref: ${cre.header.sound21Ref},`, 4);
  writer.writeLine(`sound22Ref: ${cre.header.sound22Ref},`, 4);
  writer.writeLine(`sound23Ref: ${cre.header.sound23Ref},`, 4);
  writer.writeLine(`sound24Ref: ${cre.header.sound24Ref},`, 4);
  writer.writeLine(`sound25Ref: ${cre.header.sound25Ref},`, 4);
  writer.writeLine(`levelFirstClass: ${cre.header.levelFirstClass},`, 4);
  writer.writeLine(`levelSecondClass: ${cre.header.levelSecondClass},`, 4);
  writer.writeLine(`levelThirdClass: ${cre.header.levelThirdClass},`, 4);
  writer.writeLine(`sex: '${cre.header.sex}',`, 4);
  writer.writeLine(`strength: ${cre.header.strength},`, 4);
  writer.writeLine(`strengthPercentageBonus: ${cre.header.strengthPercentageBonus},`, 4);
  writer.writeLine(`intelligence: ${cre.header.intelligence},`, 4);
  writer.writeLine(`wisdom: ${cre.header.wisdom},`, 4);
  writer.writeLine(`dexterity: ${cre.header.dexterity},`, 4);
  writer.writeLine(`constitution: ${cre.header.constitution},`, 4);
  writer.writeLine(`charisma: ${cre.header.charisma},`, 4);
  writer.writeLine(`morale: ${cre.header.morale},`, 4);
  writer.writeLine(`moraleBreak: ${cre.header.moraleBreak},`, 4);
  writer.writeLine(`racialEnemy: '${cre.header.racialEnemy}',`, 4);
  writer.writeLine(`moraleRecoveryTime: ${cre.header.moraleRecoveryTime},`, 4);
  if (cre.header.deity) writer.writeLine(`deity: '${cre.header.deity}',`, 4);
  writeFlags(
    writer,
    cre.header.mageType,
    'mageType',
    4,
  );
  writer.writeLine(`overrideScriptRef: '${cre.header.overrideScriptRef}',`, 4);
  writer.writeLine(`classScriptRef: '${cre.header.classScriptRef}',`, 4);
  writer.writeLine(`raceScriptRef: '${cre.header.raceScriptRef}',`, 4);
  writer.writeLine(`generalScriptRef: '${cre.header.generalScriptRef}',`, 4);
  writer.writeLine(`defaultScriptRef: '${cre.header.defaultScriptRef}',`, 4);
  writer.writeLine(`allegiance: '${cre.header.allegiance}',`, 4);
  writer.writeLine(`general: '${cre.header.general}',`, 4);
  writer.writeLine(`race: '${cre.header.race}',`, 4);
  writer.writeLine(`theClass: '${cre.header.theClass}',`, 4);
  writer.writeLine(`specific: '${cre.header.specific}',`, 4);
  writer.writeLine(`gender: '${cre.header.gender}',`, 4);
  writer.writeLine(`objectSpec1: '${cre.header.objectSpec1}',`, 4);
  writer.writeLine(`objectSpec2: '${cre.header.objectSpec2}',`, 4);
  writer.writeLine(`objectSpec3: '${cre.header.objectSpec3}',`, 4);
  writer.writeLine(`objectSpec4: '${cre.header.objectSpec4}',`, 4);
  writer.writeLine(`objectSpec5: '${cre.header.objectSpec5}',`, 4);
  writer.writeLine(`alignment: '${cre.header.alignment}',`, 4);
  writer.writeLine(`globalIdentifier: ${cre.header.globalIdentifier},`, 4);
  writer.writeLine(`localIdentifier: ${cre.header.localIdentifier},`, 4);
  if (cre.header.scriptName) writer.writeLine(`scriptName: '${cre.header.scriptName}',`, 4);
  writer.writeLine(`knownSpellsOffset: ${cre.header.knownSpellsOffset},`, 4);
  writer.writeLine(`knownSpellsCount: ${cre.header.knownSpellsCount},`, 4);
  writer.writeLine(`spellMemorizationInfoOffset: ${cre.header.spellMemorizationInfoOffset},`, 4);
  writer.writeLine(`spellMemorizationInfoEntriesCount: ${cre.header.spellMemorizationInfoEntriesCount},`, 4);
  writer.writeLine(`memorizedSpellsOffset: ${cre.header.memorizedSpellsOffset},`, 4);
  writer.writeLine(`memorizedSpellsCount: ${cre.header.memorizedSpellsCount},`, 4);
  writer.writeLine(`offsetToItemSlots: ${cre.header.offsetToItemSlots},`, 4);
  writer.writeLine(`offsetToItems: ${cre.header.offsetToItems},`, 4);
  writer.writeLine(`countOfItems: ${cre.header.countOfItems},`, 4);
  writer.writeLine(`offsetToEffects: ${cre.header.offsetToEffects},`, 4);
  writer.writeLine(`countOfEffects: ${cre.header.countOfEffects},`, 4);
  writer.writeLine(`dialogueRef: '${escapeSingleQuote(cre.header.dialogueRef)}',`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return creature;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default ${npcLowercaseId}CreatureSkeleton;`);

  return writer.done();
};

const buildCreatureSkeletonV11 = (cre: GhostCreatureV11, discover: DiscoverNext): string => {
  const npcLowercaseId = createNpcLowercaseId(cre.resourceName);

  discover({ type: 'who', name: npcLowercaseId });

  const writer = createWriter();
  writer.writeLine(`import type { UntranslatedCreature } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${cre.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${npcLowercaseId}CreatureSkeleton = () => {`);
  writer.writeLine(`const creature: UntranslatedCreature = {`, 2);

  writer.writeLine(`version: '${cre.header.version}',`, 4);
  writeFlags(
    writer,
    cre.header.flags,
    'flags',
    4,
  );
  writer.writeLine(`xpGainedForKilling: ${cre.header.xpGainedForKilling},`, 4);
  writer.writeLine(`powerLevelOrXp: ${cre.header.powerLevelOrXp},`, 4);
  writer.writeLine(`goldCarried: ${cre.header.goldCarried},`, 4);
  writeFlags(
    writer,
    cre.header.status,
    'status',
    4,
  );
  writer.writeLine(`currentHp: ${cre.header.currentHp},`, 4);
  writer.writeLine(`maximumHp: ${cre.header.maximumHp},`, 4);
  writer.writeLine(`animationId: ${cre.header.animationId},`, 4);
  writer.writeLine(`metalColourIndex: ${cre.header.metalColourIndex},`, 4);
  writer.writeLine(`minorColourIndex: ${cre.header.minorColourIndex},`, 4);
  writer.writeLine(`majorColourIndex: ${cre.header.majorColourIndex},`, 4);
  writer.writeLine(`skinColourIndex: ${cre.header.skinColourIndex},`, 4);
  writer.writeLine(`leatherColourIndex: ${cre.header.leatherColourIndex},`, 4);
  writer.writeLine(`armorColourIndex: ${cre.header.armorColourIndex},`, 4);
  writer.writeLine(`hairColourIndex: ${cre.header.hairColourIndex},`, 4);
  writer.writeLine(`effectVersion: ${cre.header.effectVersion},`, 4);
  writer.writeLine(`smallPortrait: '${cre.header.smallPortrait}',`, 4);
  writer.writeLine(`largePortrait: '${cre.header.largePortrait}',`, 4);
  writer.writeLine(`reputation: ${cre.header.reputation},`, 4);
  writer.writeLine(`hideInShadows: ${cre.header.hideInShadows},`, 4);
  writer.writeLine(`naturalAc: ${cre.header.naturalAc},`, 4);
  writer.writeLine(`effectiveAc: ${cre.header.effectiveAc},`, 4);
  writer.writeLine(`crushingAcModifier: ${cre.header.crushingAcModifier},`, 4);
  writer.writeLine(`missileAcModifier: ${cre.header.missileAcModifier},`, 4);
  writer.writeLine(`piercingAcModifier: ${cre.header.piercingAcModifier},`, 4);
  writer.writeLine(`slashingAcModifier: ${cre.header.slashingAcModifier},`, 4);
  writer.writeLine(`thac0: ${cre.header.thac0},`, 4);
  writer.writeLine(`numberOfAttacksPerRound: ${cre.header.numberOfAttacksPerRound},`, 4);
  writer.writeLine(`saveVersusDeath: ${cre.header.saveVersusDeath},`, 4);
  writer.writeLine(`saveVersusWands: ${cre.header.saveVersusWands},`, 4);
  writer.writeLine(`saveVersusPolymorph: ${cre.header.saveVersusPolymorph},`, 4);
  writer.writeLine(`saveVersusBreath: ${cre.header.saveVersusBreath},`, 4);
  writer.writeLine(`saveVersusSpells: ${cre.header.saveVersusSpells},`, 4);
  writer.writeLine(`fireResistance: ${cre.header.fireResistance},`, 4);
  writer.writeLine(`coldResistance: ${cre.header.coldResistance},`, 4);
  writer.writeLine(`electricityResistance: ${cre.header.electricityResistance},`, 4);
  writer.writeLine(`acidResistance: ${cre.header.acidResistance},`, 4);
  writer.writeLine(`magicResistance: ${cre.header.magicResistance},`, 4);
  writer.writeLine(`magicFireResistance: ${cre.header.magicFireResistance},`, 4);
  writer.writeLine(`magicColdResistance: ${cre.header.magicColdResistance},`, 4);
  writer.writeLine(`slashingResistance: ${cre.header.slashingResistance},`, 4);
  writer.writeLine(`crushingResistance: ${cre.header.crushingResistance},`, 4);
  writer.writeLine(`piercingResistance: ${cre.header.piercingResistance},`, 4);
  writer.writeLine(`missileResistance: ${cre.header.missileResistance},`, 4);
  writer.writeLine(`unspentProficiencies: ${cre.header.unspentProficiencies},`, 4);
  writer.writeLine(`setTraps: ${cre.header.setTraps},`, 4);
  writer.writeLine(`lore: ${cre.header.lore},`, 4);
  writer.writeLine(`lockpicking: ${cre.header.lockpicking},`, 4);
  writer.writeLine(`moveSilently: ${cre.header.moveSilently},`, 4);
  writer.writeLine(`findOrDisarmTraps: ${cre.header.findOrDisarmTraps},`, 4);
  writer.writeLine(`pickPockets: ${cre.header.pickPockets},`, 4);
  writer.writeLine(`fatigue: ${cre.header.fatigue},`, 4);
  writer.writeLine(`intoxication: ${cre.header.intoxication},`, 4);
  writer.writeLine(`luck: ${cre.header.luck},`, 4);
  writer.writeLine(`fistProficiency: ${cre.header.fistProficiency},`, 4);
  writer.writeLine(`edgedWeaponProficiency: ${cre.header.edgedWeaponProficiency},`, 4);
  writer.writeLine(`hammerProficiency: ${cre.header.hammerProficiency},`, 4);
  writer.writeLine(`axeProficiency: ${cre.header.axeProficiency},`, 4);
  writer.writeLine(`clubProficiency: ${cre.header.clubProficiency},`, 4);
  writer.writeLine(`bowProficiency: ${cre.header.bowProficiency},`, 4);
  writer.writeLine(`turnUndeadLevel: ${cre.header.turnUndeadLevel},`, 4);
  writer.writeLine(`tracking: ${cre.header.tracking},`, 4);
  if (cre.header.currentThiefClassXp) writer.writeLine(`currentThiefClassXp: ${cre.header.currentThiefClassXp},`, 4);
  if (cre.header.currentMageClassXp) writer.writeLine(`currentMageClassXp: ${cre.header.currentMageClassXp},`, 4);
  if (cre.header.goodIncrementBy) writer.writeLine(`goodIncrementBy: ${cre.header.goodIncrementBy},`, 4);
  if (cre.header.lawIncrementBy) writer.writeLine(`lawIncrementBy: ${cre.header.lawIncrementBy},`, 4);
  if (cre.header.ladyIncrementBy) writer.writeLine(`ladyIncrementBy: ${cre.header.ladyIncrementBy},`, 4);
  if (cre.header.faction) writer.writeLine(`faction: ${cre.header.faction},`, 4);
  if (cre.header.team) writer.writeLine(`team: ${cre.header.team},`, 4);
  if (cre.header.species) writer.writeLine(`species: '${cre.header.species}',`, 4);
  if (cre.header.dialogueActivationRange) writer.writeLine(`dialogueActivationRange: ${cre.header.dialogueActivationRange},`, 4);
  if (cre.header.collisionRadius) writer.writeLine(`collisionRadius: ${cre.header.collisionRadius},`, 4);
  if (cre.header.shieldFlags) writeFlags(
    writer,
    cre.header.shieldFlags,
    'shieldFlags',
    4,
  );
  if (cre.header.fieldOfVision) writer.writeLine(`fieldOfVision: ${cre.header.fieldOfVision},`, 4);
  if (cre.header.attributes) writeFlags(
    writer,
    cre.header.attributes,
    'attributes',
    4,
  );
  writer.writeLine(`initialMeetingSoundRef: ${cre.header.initialMeetingSoundRef},`, 4);
  writer.writeLine(`moraleSoundRef: ${cre.header.moraleSoundRef},`, 4);
  writer.writeLine(`happySoundRef: ${cre.header.happySoundRef},`, 4);
  writer.writeLine(`unhappyAnnoyedSoundRef: ${cre.header.unhappyAnnoyedSoundRef},`, 4);
  writer.writeLine(`unhappySeriousSoundRef: ${cre.header.unhappySeriousSoundRef},`, 4);
  writer.writeLine(`unhappyBreakingPointSoundRef: ${cre.header.unhappyBreakingPointSoundRef},`, 4);
  writer.writeLine(`leaderSoundRef: ${cre.header.leaderSoundRef},`, 4);
  writer.writeLine(`tiredSoundRef: ${cre.header.tiredSoundRef},`, 4);
  writer.writeLine(`boredSoundRef: ${cre.header.boredSoundRef},`, 4);
  writer.writeLine(`battleCry1SoundRef: ${cre.header.battleCry1SoundRef},`, 4);
  writer.writeLine(`battleCry2SoundRef: ${cre.header.battleCry2SoundRef},`, 4);
  writer.writeLine(`battleCry3SoundRef: ${cre.header.battleCry3SoundRef},`, 4);
  writer.writeLine(`battleCry4SoundRef: ${cre.header.battleCry4SoundRef},`, 4);
  writer.writeLine(`battleCry5SoundRef: ${cre.header.battleCry5SoundRef},`, 4);
  writer.writeLine(`attack1SoundRef: ${cre.header.attack1SoundRef},`, 4);
  writer.writeLine(`attack2SoundRef: ${cre.header.attack2SoundRef},`, 4);
  writer.writeLine(`attack3SoundRef: ${cre.header.attack3SoundRef},`, 4);
  writer.writeLine(`attack4SoundRef: ${cre.header.attack4SoundRef},`, 4);
  writer.writeLine(`damageSoundRef: ${cre.header.damageSoundRef},`, 4);
  writer.writeLine(`dyingSoundRef: ${cre.header.dyingSoundRef},`, 4);
  writer.writeLine(`hurtSoundRef: ${cre.header.hurtSoundRef},`, 4);
  writer.writeLine(`areaForestSoundRef: ${cre.header.areaForestSoundRef},`, 4);
  writer.writeLine(`areaCitySoundRef: ${cre.header.areaCitySoundRef},`, 4);
  writer.writeLine(`areaDungeonSoundRef: ${cre.header.areaDungeonSoundRef},`, 4);
  writer.writeLine(`areaDaySoundRef: ${cre.header.areaDaySoundRef},`, 4);
  writer.writeLine(`areaNightSoundRef: ${cre.header.areaNightSoundRef},`, 4);
  writer.writeLine(`selectCommon1SoundRef: ${cre.header.selectCommon1SoundRef},`, 4);
  writer.writeLine(`selectCommon2SoundRef: ${cre.header.selectCommon2SoundRef},`, 4);
  writer.writeLine(`selectCommon3SoundRef: ${cre.header.selectCommon3SoundRef},`, 4);
  writer.writeLine(`selectCommon4SoundRef: ${cre.header.selectCommon4SoundRef},`, 4);
  writer.writeLine(`selectCommon5SoundRef: ${cre.header.selectCommon5SoundRef},`, 4);
  writer.writeLine(`selectCommon6SoundRef: ${cre.header.selectCommon6SoundRef},`, 4);
  writer.writeLine(`selectAction1SoundRef: ${cre.header.selectAction1SoundRef},`, 4);
  writer.writeLine(`selectAction2SoundRef: ${cre.header.selectAction2SoundRef},`, 4);
  writer.writeLine(`selectAction3SoundRef: ${cre.header.selectAction3SoundRef},`, 4);
  writer.writeLine(`selectAction4SoundRef: ${cre.header.selectAction4SoundRef},`, 4);
  writer.writeLine(`selectAction5SoundRef: ${cre.header.selectAction5SoundRef},`, 4);
  writer.writeLine(`selectAction6SoundRef: ${cre.header.selectAction6SoundRef},`, 4);
  writer.writeLine(`selectAction7SoundRef: ${cre.header.selectAction7SoundRef},`, 4);
  writer.writeLine(`interaction1SoundRef: ${cre.header.interaction1SoundRef},`, 4);
  writer.writeLine(`interaction2SoundRef: ${cre.header.interaction2SoundRef},`, 4);
  writer.writeLine(`interaction3SoundRef: ${cre.header.interaction3SoundRef},`, 4);
  writer.writeLine(`interaction4SoundRef: ${cre.header.interaction4SoundRef},`, 4);
  writer.writeLine(`interaction5SoundRef: ${cre.header.interaction5SoundRef},`, 4);
  writer.writeLine(`insult1SoundRef: ${cre.header.insult1SoundRef},`, 4);
  writer.writeLine(`insult2SoundRef: ${cre.header.insult2SoundRef},`, 4);
  writer.writeLine(`insult3SoundRef: ${cre.header.insult3SoundRef},`, 4);
  writer.writeLine(`compliment1SoundRef: ${cre.header.compliment1SoundRef},`, 4);
  writer.writeLine(`compliment2SoundRef: ${cre.header.compliment2SoundRef},`, 4);
  writer.writeLine(`compliment3SoundRef: ${cre.header.compliment3SoundRef},`, 4);
  writer.writeLine(`special1SoundRef: ${cre.header.special1SoundRef},`, 4);
  writer.writeLine(`special2SoundRef: ${cre.header.special2SoundRef},`, 4);
  writer.writeLine(`special3SoundRef: ${cre.header.special3SoundRef},`, 4);
  writer.writeLine(`reactToDieGeneralSoundRef: ${cre.header.reactToDieGeneralSoundRef},`, 4);
  writer.writeLine(`reactToDieSpecificSoundRef: ${cre.header.reactToDieSpecificSoundRef},`, 4);
  writer.writeLine(`responseToCompliment1SoundRef: ${cre.header.responseToCompliment1SoundRef},`, 4);
  writer.writeLine(`responseToCompliment2SoundRef: ${cre.header.responseToCompliment2SoundRef},`, 4);
  writer.writeLine(`responseToCompliment3SoundRef: ${cre.header.responseToCompliment3SoundRef},`, 4);
  writer.writeLine(`responseToInsult1SoundRef: ${cre.header.responseToInsult1SoundRef},`, 4);
  writer.writeLine(`responseToInsult2SoundRef: ${cre.header.responseToInsult2SoundRef},`, 4);
  writer.writeLine(`responseToInsult3SoundRef: ${cre.header.responseToInsult3SoundRef},`, 4);
  writer.writeLine(`dialogHostileSoundRef: ${cre.header.dialogHostileSoundRef},`, 4);
  writer.writeLine(`dialogDefaultSoundRef: ${cre.header.dialogDefaultSoundRef},`, 4);
  writer.writeLine(`selectRare1SoundRef: ${cre.header.selectRare1SoundRef},`, 4);
  writer.writeLine(`selectRare2SoundRef: ${cre.header.selectRare2SoundRef},`, 4);
  writer.writeLine(`criticalHitSoundRef: ${cre.header.criticalHitSoundRef},`, 4);
  writer.writeLine(`criticalMissSoundRef: ${cre.header.criticalMissSoundRef},`, 4);
  writer.writeLine(`targetImmuneSoundRef: ${cre.header.targetImmuneSoundRef},`, 4);
  writer.writeLine(`inventoryFullSoundRef: ${cre.header.inventoryFullSoundRef},`, 4);
  writer.writeLine(`pickedPicketSoundRef: ${cre.header.pickedPicketSoundRef},`, 4);
  writer.writeLine(`hiddenInShadowsSoundRef: ${cre.header.hiddenInShadowsSoundRef},`, 4);
  writer.writeLine(`spellDisruptedSoundRef: ${cre.header.spellDisruptedSoundRef},`, 4);
  writer.writeLine(`setTrapSoundRef: ${cre.header.setTrapSoundRef},`, 4);
  writer.writeLine(`existance4SoundRef: ${cre.header.existance4SoundRef},`, 4);
  writer.writeLine(`bioSoundRef: ${cre.header.bioSoundRef},`, 4);
  writer.writeLine(`sound1Ref: ${cre.header.sound1Ref},`, 4);
  writer.writeLine(`sound2Ref: ${cre.header.sound2Ref},`, 4);
  writer.writeLine(`sound3Ref: ${cre.header.sound3Ref},`, 4);
  writer.writeLine(`sound4Ref: ${cre.header.sound4Ref},`, 4);
  writer.writeLine(`sound5Ref: ${cre.header.sound5Ref},`, 4);
  writer.writeLine(`sound6Ref: ${cre.header.sound6Ref},`, 4);
  writer.writeLine(`sound7Ref: ${cre.header.sound7Ref},`, 4);
  writer.writeLine(`sound8Ref: ${cre.header.sound8Ref},`, 4);
  writer.writeLine(`sound9Ref: ${cre.header.sound9Ref},`, 4);
  writer.writeLine(`sound10Ref: ${cre.header.sound10Ref},`, 4);
  writer.writeLine(`sound11Ref: ${cre.header.sound11Ref},`, 4);
  writer.writeLine(`sound12Ref: ${cre.header.sound12Ref},`, 4);
  writer.writeLine(`sound13Ref: ${cre.header.sound13Ref},`, 4);
  writer.writeLine(`sound14Ref: ${cre.header.sound14Ref},`, 4);
  writer.writeLine(`sound15Ref: ${cre.header.sound15Ref},`, 4);
  writer.writeLine(`sound16Ref: ${cre.header.sound16Ref},`, 4);
  writer.writeLine(`sound17Ref: ${cre.header.sound17Ref},`, 4);
  writer.writeLine(`sound18Ref: ${cre.header.sound18Ref},`, 4);
  writer.writeLine(`sound19Ref: ${cre.header.sound19Ref},`, 4);
  writer.writeLine(`sound20Ref: ${cre.header.sound20Ref},`, 4);
  writer.writeLine(`sound21Ref: ${cre.header.sound21Ref},`, 4);
  writer.writeLine(`sound22Ref: ${cre.header.sound22Ref},`, 4);
  writer.writeLine(`sound23Ref: ${cre.header.sound23Ref},`, 4);
  writer.writeLine(`sound24Ref: ${cre.header.sound24Ref},`, 4);
  writer.writeLine(`sound25Ref: ${cre.header.sound25Ref},`, 4);
  writer.writeLine(`levelFirstClass: ${cre.header.levelFirstClass},`, 4);
  writer.writeLine(`levelSecondClass: ${cre.header.levelSecondClass},`, 4);
  writer.writeLine(`levelThirdClass: ${cre.header.levelThirdClass},`, 4);
  writer.writeLine(`sex: '${cre.header.sex}',`, 4);
  writer.writeLine(`strength: ${cre.header.strength},`, 4);
  writer.writeLine(`strengthPercentageBonus: ${cre.header.strengthPercentageBonus},`, 4);
  writer.writeLine(`intelligence: ${cre.header.intelligence},`, 4);
  writer.writeLine(`wisdom: ${cre.header.wisdom},`, 4);
  writer.writeLine(`dexterity: ${cre.header.dexterity},`, 4);
  writer.writeLine(`constitution: ${cre.header.constitution},`, 4);
  writer.writeLine(`charisma: ${cre.header.charisma},`, 4);
  writer.writeLine(`morale: ${cre.header.morale},`, 4);
  writer.writeLine(`moraleBreak: ${cre.header.moraleBreak},`, 4);
  writer.writeLine(`racialEnemy: '${cre.header.racialEnemy}',`, 4);
  writer.writeLine(`moraleRecoveryTime: ${cre.header.moraleRecoveryTime},`, 4);
  if (cre.header.deity) writer.writeLine(`deity: '${cre.header.deity}',`, 4);
  writeFlags(
    writer,
    cre.header.mageType,
    'mageType',
    4,
  );
  writer.writeLine(`overrideScriptRef: '${cre.header.overrideScriptRef}',`, 4);
  writer.writeLine(`classScriptRef: '${cre.header.classScriptRef}',`, 4);
  writer.writeLine(`raceScriptRef: '${cre.header.raceScriptRef}',`, 4);
  writer.writeLine(`generalScriptRef: '${cre.header.generalScriptRef}',`, 4);
  writer.writeLine(`defaultScriptRef: '${cre.header.defaultScriptRef}',`, 4);
  writer.writeLine(`overlaysOffset: '${cre.header.overlaysOffset}',`, 4);
  writer.writeLine(`overlaysSize: '${cre.header.overlaysSize}',`, 4);
  writer.writeLine(`murderIncrementBy: '${cre.header.murderIncrementBy}',`, 4);
  writer.writeLine(`characterType: '${cre.header.characterType}',`, 4);
  writer.writeLine(`colorsCount: '${cre.header.colorsCount}',`, 4);
  writer.writeLine(`color1: '${cre.header.color1}',`, 4);
  writer.writeLine(`color2: '${cre.header.color2}',`, 4);
  writer.writeLine(`color3: '${cre.header.color3}',`, 4);
  writer.writeLine(`color4: '${cre.header.color4}',`, 4);
  writer.writeLine(`color5: '${cre.header.color5}',`, 4);
  writer.writeLine(`color6: '${cre.header.color6}',`, 4);
  writer.writeLine(`color7: '${cre.header.color7}',`, 4);
  writer.writeLine(`color1Placement: '${cre.header.color1Placement}',`, 4);
  writer.writeLine(`color2Placement: '${cre.header.color2Placement}',`, 4);
  writer.writeLine(`color3Placement: '${cre.header.color3Placement}',`, 4);
  writer.writeLine(`color4Placement: '${cre.header.color4Placement}',`, 4);
  writer.writeLine(`color5Placement: '${cre.header.color5Placement}',`, 4);
  writer.writeLine(`color6Placement: '${cre.header.color6Placement}',`, 4);
  writer.writeLine(`color7Placement: '${cre.header.color7Placement}',`, 4);
  writer.writeLine(`allegiance: '${cre.header.allegiance}',`, 4);
  writer.writeLine(`general: '${cre.header.general}',`, 4);
  writer.writeLine(`race: '${cre.header.race}',`, 4);
  writer.writeLine(`theClass: '${cre.header.theClass}',`, 4);
  writer.writeLine(`specific: '${cre.header.specific}',`, 4);
  writer.writeLine(`gender: '${cre.header.gender}',`, 4);
  writer.writeLine(`objectSpec1: '${cre.header.objectSpec1}',`, 4);
  writer.writeLine(`objectSpec2: '${cre.header.objectSpec2}',`, 4);
  writer.writeLine(`objectSpec3: '${cre.header.objectSpec3}',`, 4);
  writer.writeLine(`objectSpec4: '${cre.header.objectSpec4}',`, 4);
  writer.writeLine(`objectSpec5: '${cre.header.objectSpec5}',`, 4);
  writer.writeLine(`alignment: '${cre.header.alignment}',`, 4);
  writer.writeLine(`globalIdentifier: ${cre.header.globalIdentifier},`, 4);
  writer.writeLine(`localIdentifier: ${cre.header.localIdentifier},`, 4);
  if (cre.header.scriptName) writer.writeLine(`scriptName: '${cre.header.scriptName}',`, 4);
  writer.writeLine(`knownSpellsOffset: ${cre.header.knownSpellsOffset},`, 4);
  writer.writeLine(`knownSpellsCount: ${cre.header.knownSpellsCount},`, 4);
  writer.writeLine(`spellMemorizationInfoOffset: ${cre.header.spellMemorizationInfoOffset},`, 4);
  writer.writeLine(`spellMemorizationInfoEntriesCount: ${cre.header.spellMemorizationInfoEntriesCount},`, 4);
  writer.writeLine(`memorizedSpellsOffset: ${cre.header.memorizedSpellsOffset},`, 4);
  writer.writeLine(`memorizedSpellsCount: ${cre.header.memorizedSpellsCount},`, 4);
  writer.writeLine(`offsetToItemSlots: ${cre.header.offsetToItemSlots},`, 4);
  writer.writeLine(`offsetToItems: ${cre.header.offsetToItems},`, 4);
  writer.writeLine(`countOfItems: ${cre.header.countOfItems},`, 4);
  writer.writeLine(`offsetToEffects: ${cre.header.offsetToEffects},`, 4);
  writer.writeLine(`countOfEffects: ${cre.header.countOfEffects},`, 4);
  writer.writeLine(`dialogueRef: '${escapeSingleQuote(cre.header.dialogueRef)}',`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return creature;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default ${npcLowercaseId}CreatureSkeleton;`);

  return writer.done();
};

const buildCreatureSkeleton = (cre: GhostCreature, discover: DiscoverNext): string => {
  switch (cre.header.version) {
    case 'v1.0':return buildCreatureSkeletonV10(cre as GhostCreatureV10, discover);
    case 'v1.1':return buildCreatureSkeletonV11(cre as GhostCreatureV11, discover);
  }
};

export default buildCreatureSkeleton;
