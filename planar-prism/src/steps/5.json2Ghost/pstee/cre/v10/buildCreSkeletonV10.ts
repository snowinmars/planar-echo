import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { DiscoverNext } from '@/discoverer.types.js';
import type { GhostCreV10 } from '@planar/shared';

const createNpcLowercaseId = (resourceName: string): string => {
  const candidate = withoutExtension(resourceName).replace(`'`, ``);
  // const isDigit = candidate[0] > -1;
  // if (isDigit) return `${candidate}`;
  // some creatures ids starts with digits
  // I discover proper characters, but write in ghost all with underscore prefix
  return candidate;
};

export const buildCreSkeletonV10 = (cre: GhostCreV10, discover: DiscoverNext): string => {
  const npcLowercaseId = createNpcLowercaseId(cre.resourceName);

  discover({ type: 'who', name: npcLowercaseId });

  const writer = createWriter();
  writer.writeLine(`import type { GhostCreV10 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${cre.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${npcLowercaseId}CreSkeleton = () => {`);
  writer.writeLine(`const cre: GhostCreV10 = {`, 2);

  writer.writeLine(`resourceName: '${cre.resourceName.replace(`'`, `\\'`)}',`, 4);
  writer.writeLine(`version: '${cre.version}',`, 4);
  writer.writeLine(`nameRef: ${cre.nameRef},`, 4);
  writer.writeLine(`tooltipRef: ${cre.tooltipRef},`, 4);
  writeFlags(
    writer,
    cre.flags,
    'flags',
    4,
  );
  writer.writeLine(`xpGainedForKilling: ${cre.xpGainedForKilling},`, 4);
  writer.writeLine(`powerLevelOrXp: ${cre.powerLevelOrXp},`, 4);
  writer.writeLine(`goldCarried: ${cre.goldCarried},`, 4);
  writeFlags(
    writer,
    cre.status,
    'status',
    4,
  );
  writer.writeLine(`currentHp: ${cre.currentHp},`, 4);
  writer.writeLine(`maximumHp: ${cre.maximumHp},`, 4);
  writer.writeLine(`animationId: ${cre.animationId},`, 4);
  writer.writeLine(`metalColourIndex: ${cre.metalColourIndex},`, 4);
  writer.writeLine(`minorColourIndex: ${cre.minorColourIndex},`, 4);
  writer.writeLine(`majorColourIndex: ${cre.majorColourIndex},`, 4);
  writer.writeLine(`skinColourIndex: ${cre.skinColourIndex},`, 4);
  writer.writeLine(`leatherColourIndex: ${cre.leatherColourIndex},`, 4);
  writer.writeLine(`armorColourIndex: ${cre.armorColourIndex},`, 4);
  writer.writeLine(`hairColourIndex: ${cre.hairColourIndex},`, 4);
  writer.writeLine(`effectVersion: ${cre.effectVersion},`, 4);
  writer.writeLine(`smallPortrait: '${cre.smallPortrait}',`, 4);
  writer.writeLine(`largePortrait: '${cre.largePortrait}',`, 4);
  writer.writeLine(`reputation: ${cre.reputation},`, 4);
  writer.writeLine(`hideInShadows: ${cre.hideInShadows},`, 4);
  writer.writeLine(`naturalAc: ${cre.naturalAc},`, 4);
  writer.writeLine(`effectiveAc: ${cre.effectiveAc},`, 4);
  writer.writeLine(`crushingAcModifier: ${cre.crushingAcModifier},`, 4);
  writer.writeLine(`missileAcModifier: ${cre.missileAcModifier},`, 4);
  writer.writeLine(`piercingAcModifier: ${cre.piercingAcModifier},`, 4);
  writer.writeLine(`slashingAcModifier: ${cre.slashingAcModifier},`, 4);
  writer.writeLine(`thac0: ${cre.thac0},`, 4);
  writer.writeLine(`numberOfAttacksPerRound: ${cre.numberOfAttacksPerRound},`, 4);
  writer.writeLine(`saveVersusDeath: ${cre.saveVersusDeath},`, 4);
  writer.writeLine(`saveVersusWands: ${cre.saveVersusWands},`, 4);
  writer.writeLine(`saveVersusPolymorph: ${cre.saveVersusPolymorph},`, 4);
  writer.writeLine(`saveVersusBreath: ${cre.saveVersusBreath},`, 4);
  writer.writeLine(`saveVersusSpells: ${cre.saveVersusSpells},`, 4);
  writer.writeLine(`fireResistance: ${cre.fireResistance},`, 4);
  writer.writeLine(`coldResistance: ${cre.coldResistance},`, 4);
  writer.writeLine(`electricityResistance: ${cre.electricityResistance},`, 4);
  writer.writeLine(`acidResistance: ${cre.acidResistance},`, 4);
  writer.writeLine(`magicResistance: ${cre.magicResistance},`, 4);
  writer.writeLine(`magicFireResistance: ${cre.magicFireResistance},`, 4);
  writer.writeLine(`magicColdResistance: ${cre.magicColdResistance},`, 4);
  writer.writeLine(`slashingResistance: ${cre.slashingResistance},`, 4);
  writer.writeLine(`crushingResistance: ${cre.crushingResistance},`, 4);
  writer.writeLine(`piercingResistance: ${cre.piercingResistance},`, 4);
  writer.writeLine(`missileResistance: ${cre.missileResistance},`, 4);
  writer.writeLine(`detectIllusion: ${cre.detectIllusion},`, 4);
  writer.writeLine(`setTraps: ${cre.setTraps},`, 4);
  writer.writeLine(`lore: ${cre.lore},`, 4);
  writer.writeLine(`lockpicking: ${cre.lockpicking},`, 4);
  writer.writeLine(`moveSilently: ${cre.moveSilently},`, 4);
  writer.writeLine(`findOrDisarmTraps: ${cre.findOrDisarmTraps},`, 4);
  writer.writeLine(`pickPockets: ${cre.pickPockets},`, 4);
  writer.writeLine(`fatigue: ${cre.fatigue},`, 4);
  writer.writeLine(`intoxication: ${cre.intoxication},`, 4);
  writer.writeLine(`luck: ${cre.luck},`, 4);
  writer.writeLine(`largeSwordProficiency: ${cre.largeSwordProficiency},`, 4);
  writer.writeLine(`smallSwordProficiency: ${cre.smallSwordProficiency},`, 4);
  writer.writeLine(`bowProficiency: ${cre.bowProficiency},`, 4);
  writer.writeLine(`spearProficiency: ${cre.spearProficiency},`, 4);
  writer.writeLine(`bluntProficiency: ${cre.bluntProficiency},`, 4);
  writer.writeLine(`spikedProficiency: ${cre.spikedProficiency},`, 4);
  writer.writeLine(`axeProficiency: ${cre.axeProficiency},`, 4);
  writer.writeLine(`missileProficiency: ${cre.missileProficiency},`, 4);
  writer.writeLine(`unusedProficiency1: ${cre.unusedProficiency1},`, 4);
  writer.writeLine(`unusedProficiency2: ${cre.unusedProficiency2},`, 4);
  writer.writeLine(`unusedProficiency3: ${cre.unusedProficiency3},`, 4);
  writer.writeLine(`unusedProficiency4: ${cre.unusedProficiency4},`, 4);
  writer.writeLine(`unusedProficiency5: ${cre.unusedProficiency5},`, 4);
  writer.writeLine(`unspentProficiencies: ${cre.unspentProficiencies},`, 4);
  writer.writeLine(`availableInventorySlotsCount: ${cre.availableInventorySlotsCount},`, 4);
  writer.writeLine(`nightmareModeModifiersApplied: ${cre.nightmareModeModifiersApplied},`, 4);
  writer.writeLine(`translucency: ${cre.translucency},`, 4);
  writer.writeLine(`murderIncrementBy: ${cre.murderIncrementBy},`, 4);
  writer.writeLine(`turnUndeadLevel: ${cre.turnUndeadLevel},`, 4);
  writer.writeLine(`tracking: ${cre.tracking},`, 4);
  if (cre.currentThiefClassXp) writer.writeLine(`currentThiefClassXp: ${cre.currentThiefClassXp},`, 4);
  if (cre.currentMageClassXp) writer.writeLine(`currentMageClassXp: ${cre.currentMageClassXp},`, 4);
  if (cre.goodIncrementBy) writer.writeLine(`goodIncrementBy: ${cre.goodIncrementBy},`, 4);
  if (cre.lawIncrementBy) writer.writeLine(`lawIncrementBy: ${cre.lawIncrementBy},`, 4);
  if (cre.ladyIncrementBy) writer.writeLine(`ladyIncrementBy: ${cre.ladyIncrementBy},`, 4);
  if (cre.faction) writer.writeLine(`faction: ${cre.faction},`, 4);
  if (cre.team) writer.writeLine(`team: ${cre.team},`, 4);
  if (cre.species) writer.writeLine(`species: '${cre.species}',`, 4);
  if (cre.dialogueActivationRange) writer.writeLine(`dialogueActivationRange: ${cre.dialogueActivationRange},`, 4);
  if (cre.collisionRadius) writer.writeLine(`collisionRadius: ${cre.collisionRadius},`, 4);
  if (cre.shieldFlags) writeFlags(
    writer,
    cre.shieldFlags,
    'shieldFlags',
    4,
  );
  else writer.writeLine(`shieldFlags: [],`, 4);
  if (cre.fieldOfVision) writer.writeLine(`fieldOfVision: ${cre.fieldOfVision},`, 4);
  if (cre.attributes) writeFlags(
    writer,
    cre.attributes,
    'attributes',
    4,
  );
  else writer.writeLine(`attributes: [],`, 4);
  writer.writeLine(`levelFirstClass: ${cre.levelFirstClass},`, 4);
  writer.writeLine(`levelSecondClass: ${cre.levelSecondClass},`, 4);
  writer.writeLine(`levelThirdClass: ${cre.levelThirdClass},`, 4);
  writer.writeLine(`sex: '${cre.sex}',`, 4);
  writer.writeLine(`strength: ${cre.strength},`, 4);
  writer.writeLine(`strengthPercentageBonus: ${cre.strengthPercentageBonus},`, 4);
  writer.writeLine(`intelligence: ${cre.intelligence},`, 4);
  writer.writeLine(`wisdom: ${cre.wisdom},`, 4);
  writer.writeLine(`dexterity: ${cre.dexterity},`, 4);
  writer.writeLine(`constitution: ${cre.constitution},`, 4);
  writer.writeLine(`charisma: ${cre.charisma},`, 4);
  writer.writeLine(`morale: ${cre.morale},`, 4);
  writer.writeLine(`moraleBreak: ${cre.moraleBreak},`, 4);
  writer.writeLine(`racialEnemy: '${cre.racialEnemy}',`, 4);
  writer.writeLine(`moraleRecoveryTime: ${cre.moraleRecoveryTime},`, 4);
  if (cre.deity) writer.writeLine(`deity: '${cre.deity}',`, 4);
  writeFlags(
    writer,
    cre.mageType,
    'mageType',
    4,
  );
  writer.writeLine(`overrideScriptRef: '${cre.overrideScriptRef}',`, 4);
  discover({ type: 'script', name: cre.overrideScriptRef });

  writer.writeLine(`classScriptRef: '${cre.classScriptRef}',`, 4);
  discover({ type: 'script', name: cre.classScriptRef });

  writer.writeLine(`raceScriptRef: '${cre.raceScriptRef}',`, 4);
  discover({ type: 'script', name: cre.raceScriptRef });

  writer.writeLine(`generalScriptRef: '${cre.generalScriptRef}',`, 4);
  discover({ type: 'script', name: cre.generalScriptRef });

  writer.writeLine(`defaultScriptRef: '${cre.defaultScriptRef}',`, 4);
  discover({ type: 'script', name: cre.defaultScriptRef });

  writer.writeLine(`allegiance: '${cre.allegiance}',`, 4);
  writer.writeLine(`general: '${cre.general}',`, 4);
  writer.writeLine(`race: '${cre.race}',`, 4);
  writer.writeLine(`theClass: '${cre.theClass}',`, 4);
  discover({ type: 'class', name: cre.theClass });
  writer.writeLine(`specific: '${cre.specific}',`, 4);
  writer.writeLine(`gender: '${cre.gender}',`, 4);
  writer.writeLine(`objectSpecs: [`, 4);
  for (const objectSpec of cre.objectSpecs) {
    writer.writeLine(`'${objectSpec}',`, 6);
  }
  writer.writeLine(`],`, 4);
  writer.writeLine(`alignment: '${cre.alignment}',`, 4);
  discover({ type: 'alignment', name: cre.alignment });
  writer.writeLine(`globalIdentifier: ${cre.globalIdentifier},`, 4);
  writer.writeLine(`localIdentifier: ${cre.localIdentifier},`, 4);
  if (cre.scriptName) {
    writer.writeLine(`scriptName: '${cre.scriptName}',`, 4);
    discover({ type: 'script', name: cre.scriptName });
  }
  else {
    writer.writeLine(`scriptName: '',`, 4);
  }
  writer.writeLine(`knownSpellsOffset: ${cre.knownSpellsOffset},`, 4);
  writer.writeLine(`knownSpellsCount: ${cre.knownSpellsCount},`, 4);
  writer.writeLine(`spellMemorizationInfoOffset: ${cre.spellMemorizationInfoOffset},`, 4);
  writer.writeLine(`spellMemorizationInfoEntriesCount: ${cre.spellMemorizationInfoEntriesCount},`, 4);
  writer.writeLine(`memorizedSpellsOffset: ${cre.memorizedSpellsOffset},`, 4);
  writer.writeLine(`memorizedSpellsCount: ${cre.memorizedSpellsCount},`, 4);
  writer.writeLine(`offsetToItemSlots: ${cre.offsetToItemSlots},`, 4);
  writer.writeLine(`offsetToItems: ${cre.offsetToItems},`, 4);
  writer.writeLine(`countOfItems: ${cre.countOfItems},`, 4);
  writer.writeLine(`offsetToEffects: ${cre.offsetToEffects},`, 4);
  writer.writeLine(`countOfEffects: ${cre.countOfEffects},`, 4);
  writer.writeLine(`dlgRef: '${escapeSingleQuote(cre.dlgRef)}',`, 4);
  writer.writeLine(`initialMeetingSoundRef: ${cre.initialMeetingSoundRef},`, 4);
  writer.writeLine(`moraleSoundRef: ${cre.moraleSoundRef},`, 4);
  writer.writeLine(`happySoundRef: ${cre.happySoundRef},`, 4);
  writer.writeLine(`unhappyAnnoyedSoundRef: ${cre.unhappyAnnoyedSoundRef},`, 4);
  writer.writeLine(`unhappySeriousSoundRef: ${cre.unhappySeriousSoundRef},`, 4);
  writer.writeLine(`unhappyBreakingPointSoundRef: ${cre.unhappyBreakingPointSoundRef},`, 4);
  writer.writeLine(`leaderSoundRef: ${cre.leaderSoundRef},`, 4);
  writer.writeLine(`tiredSoundRef: ${cre.tiredSoundRef},`, 4);
  writer.writeLine(`boredSoundRef: ${cre.boredSoundRef},`, 4);
  writer.writeLine(`battleCry1SoundRef: ${cre.battleCry1SoundRef},`, 4);
  writer.writeLine(`battleCry2SoundRef: ${cre.battleCry2SoundRef},`, 4);
  writer.writeLine(`battleCry3SoundRef: ${cre.battleCry3SoundRef},`, 4);
  writer.writeLine(`battleCry4SoundRef: ${cre.battleCry4SoundRef},`, 4);
  writer.writeLine(`battleCry5SoundRef: ${cre.battleCry5SoundRef},`, 4);
  writer.writeLine(`attack1SoundRef: ${cre.attack1SoundRef},`, 4);
  writer.writeLine(`attack2SoundRef: ${cre.attack2SoundRef},`, 4);
  writer.writeLine(`attack3SoundRef: ${cre.attack3SoundRef},`, 4);
  writer.writeLine(`attack4SoundRef: ${cre.attack4SoundRef},`, 4);
  writer.writeLine(`damageSoundRef: ${cre.damageSoundRef},`, 4);
  writer.writeLine(`dyingSoundRef: ${cre.dyingSoundRef},`, 4);
  writer.writeLine(`hurtSoundRef: ${cre.hurtSoundRef},`, 4);
  writer.writeLine(`areaForestSoundRef: ${cre.areaForestSoundRef},`, 4);
  writer.writeLine(`areaCitySoundRef: ${cre.areaCitySoundRef},`, 4);
  writer.writeLine(`areaDungeonSoundRef: ${cre.areaDungeonSoundRef},`, 4);
  writer.writeLine(`areaDaySoundRef: ${cre.areaDaySoundRef},`, 4);
  writer.writeLine(`areaNightSoundRef: ${cre.areaNightSoundRef},`, 4);
  writer.writeLine(`selectCommon1SoundRef: ${cre.selectCommon1SoundRef},`, 4);
  writer.writeLine(`selectCommon2SoundRef: ${cre.selectCommon2SoundRef},`, 4);
  writer.writeLine(`selectCommon3SoundRef: ${cre.selectCommon3SoundRef},`, 4);
  writer.writeLine(`selectCommon4SoundRef: ${cre.selectCommon4SoundRef},`, 4);
  writer.writeLine(`selectCommon5SoundRef: ${cre.selectCommon5SoundRef},`, 4);
  writer.writeLine(`selectCommon6SoundRef: ${cre.selectCommon6SoundRef},`, 4);
  writer.writeLine(`selectAction1SoundRef: ${cre.selectAction1SoundRef},`, 4);
  writer.writeLine(`selectAction2SoundRef: ${cre.selectAction2SoundRef},`, 4);
  writer.writeLine(`selectAction3SoundRef: ${cre.selectAction3SoundRef},`, 4);
  writer.writeLine(`selectAction4SoundRef: ${cre.selectAction4SoundRef},`, 4);
  writer.writeLine(`selectAction5SoundRef: ${cre.selectAction5SoundRef},`, 4);
  writer.writeLine(`selectAction6SoundRef: ${cre.selectAction6SoundRef},`, 4);
  writer.writeLine(`selectAction7SoundRef: ${cre.selectAction7SoundRef},`, 4);
  writer.writeLine(`interaction1SoundRef: ${cre.interaction1SoundRef},`, 4);
  writer.writeLine(`interaction2SoundRef: ${cre.interaction2SoundRef},`, 4);
  writer.writeLine(`interaction3SoundRef: ${cre.interaction3SoundRef},`, 4);
  writer.writeLine(`interaction4SoundRef: ${cre.interaction4SoundRef},`, 4);
  writer.writeLine(`interaction5SoundRef: ${cre.interaction5SoundRef},`, 4);
  writer.writeLine(`insult1SoundRef: ${cre.insult1SoundRef},`, 4);
  writer.writeLine(`insult2SoundRef: ${cre.insult2SoundRef},`, 4);
  writer.writeLine(`insult3SoundRef: ${cre.insult3SoundRef},`, 4);
  writer.writeLine(`compliment1SoundRef: ${cre.compliment1SoundRef},`, 4);
  writer.writeLine(`compliment2SoundRef: ${cre.compliment2SoundRef},`, 4);
  writer.writeLine(`compliment3SoundRef: ${cre.compliment3SoundRef},`, 4);
  writer.writeLine(`special1SoundRef: ${cre.special1SoundRef},`, 4);
  writer.writeLine(`special2SoundRef: ${cre.special2SoundRef},`, 4);
  writer.writeLine(`special3SoundRef: ${cre.special3SoundRef},`, 4);
  writer.writeLine(`reactToDieGeneralSoundRef: ${cre.reactToDieGeneralSoundRef},`, 4);
  writer.writeLine(`reactToDieSpecificSoundRef: ${cre.reactToDieSpecificSoundRef},`, 4);
  writer.writeLine(`responseToCompliment1SoundRef: ${cre.responseToCompliment1SoundRef},`, 4);
  writer.writeLine(`responseToCompliment2SoundRef: ${cre.responseToCompliment2SoundRef},`, 4);
  writer.writeLine(`responseToCompliment3SoundRef: ${cre.responseToCompliment3SoundRef},`, 4);
  writer.writeLine(`responseToInsult1SoundRef: ${cre.responseToInsult1SoundRef},`, 4);
  writer.writeLine(`responseToInsult2SoundRef: ${cre.responseToInsult2SoundRef},`, 4);
  writer.writeLine(`responseToInsult3SoundRef: ${cre.responseToInsult3SoundRef},`, 4);
  writer.writeLine(`dialogHostileSoundRef: ${cre.dialogHostileSoundRef},`, 4);
  writer.writeLine(`dialogDefaultSoundRef: ${cre.dialogDefaultSoundRef},`, 4);
  writer.writeLine(`selectRare1SoundRef: ${cre.selectRare1SoundRef},`, 4);
  writer.writeLine(`selectRare2SoundRef: ${cre.selectRare2SoundRef},`, 4);
  writer.writeLine(`criticalHitSoundRef: ${cre.criticalHitSoundRef},`, 4);
  writer.writeLine(`criticalMissSoundRef: ${cre.criticalMissSoundRef},`, 4);
  writer.writeLine(`targetImmuneSoundRef: ${cre.targetImmuneSoundRef},`, 4);
  writer.writeLine(`inventoryFullSoundRef: ${cre.inventoryFullSoundRef},`, 4);
  writer.writeLine(`pickedPicketSoundRef: ${cre.pickedPicketSoundRef},`, 4);
  writer.writeLine(`hiddenInShadowsSoundRef: ${cre.hiddenInShadowsSoundRef},`, 4);
  writer.writeLine(`spellDisruptedSoundRef: ${cre.spellDisruptedSoundRef},`, 4);
  writer.writeLine(`setTrapSoundRef: ${cre.setTrapSoundRef},`, 4);
  writer.writeLine(`existance4SoundRef: ${cre.existance4SoundRef},`, 4);
  writer.writeLine(`bioSoundRef: ${cre.bioSoundRef},`, 4);
  writer.writeLine(`sound1Ref: ${cre.sound1Ref},`, 4);
  writer.writeLine(`sound2Ref: ${cre.sound2Ref},`, 4);
  writer.writeLine(`sound3Ref: ${cre.sound3Ref},`, 4);
  writer.writeLine(`sound4Ref: ${cre.sound4Ref},`, 4);
  writer.writeLine(`sound5Ref: ${cre.sound5Ref},`, 4);
  writer.writeLine(`sound6Ref: ${cre.sound6Ref},`, 4);
  writer.writeLine(`sound7Ref: ${cre.sound7Ref},`, 4);
  writer.writeLine(`sound8Ref: ${cre.sound8Ref},`, 4);
  writer.writeLine(`sound9Ref: ${cre.sound9Ref},`, 4);
  writer.writeLine(`sound10Ref: ${cre.sound10Ref},`, 4);
  writer.writeLine(`sound11Ref: ${cre.sound11Ref},`, 4);
  writer.writeLine(`sound12Ref: ${cre.sound12Ref},`, 4);
  writer.writeLine(`sound13Ref: ${cre.sound13Ref},`, 4);
  writer.writeLine(`sound14Ref: ${cre.sound14Ref},`, 4);
  writer.writeLine(`sound15Ref: ${cre.sound15Ref},`, 4);
  writer.writeLine(`sound16Ref: ${cre.sound16Ref},`, 4);
  writer.writeLine(`sound17Ref: ${cre.sound17Ref},`, 4);
  writer.writeLine(`sound18Ref: ${cre.sound18Ref},`, 4);
  writer.writeLine(`sound19Ref: ${cre.sound19Ref},`, 4);
  writer.writeLine(`sound20Ref: ${cre.sound20Ref},`, 4);
  writer.writeLine(`sound21Ref: ${cre.sound21Ref},`, 4);
  writer.writeLine(`sound22Ref: ${cre.sound22Ref},`, 4);
  writer.writeLine(`sound23Ref: ${cre.sound23Ref},`, 4);
  writer.writeLine(`sound24Ref: ${cre.sound24Ref},`, 4);
  writer.writeLine(`sound25Ref: ${cre.sound25Ref},`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return cre;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${npcLowercaseId}CreSkeleton;`);

  return writer.done();
};
