import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';

import type { GhostCreatureV10, GhostCreatureV11 } from '../../../types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV11;

const createNpcLowercaseId = (resourceName: string): string => {
  const candidate = resourceName.split('.')[0]!.replace(`'`, ``);
  // const isDigit = candidate[0] > -1;
  // if (isDigit) return `${candidate}`;
  // some creatures ids starts with digits
  // I discover proper characters, but write in ghost all with underscore prefix
  return candidate;
};

const buildCreatureSkeletonV10 = (cre: GhostCreatureV10, discover: DiscoverNext): string => {
  const npcLowercaseId = createNpcLowercaseId(cre.resourceName);

  discover({ type: 'who', name: npcLowercaseId });

  const writer = createWriter();
  writer.writeLine(`import type { UntranslatedCreatureV10 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${cre.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${npcLowercaseId}CreatureSkeleton = () => {`);
  writer.writeLine(`const creature: UntranslatedCreatureV10 = {`, 2);

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
  writer.writeLine(`goodIncrementBy: ${cre.header.goodIncrementBy ?? null},`, 4);
  writer.writeLine(`lawIncrementBy: ${cre.header.lawIncrementBy ?? null},`, 4);
  writer.writeLine(`ladyIncrementBy: ${cre.header.ladyIncrementBy ?? null},`, 4);
  writer.writeLine(`faction: ${cre.header.faction ?? null},`, 4);
  writer.writeLine(`team: ${cre.header.team ?? null},`, 4);
  writer.writeLine(`species: '${cre.header.species ?? null}',`, 4);
  writer.writeLine(`dialogueActivationRange: ${cre.header.dialogueActivationRange ?? null},`, 4);
  writer.writeLine(`collisionRadius: ${cre.header.collisionRadius ?? null},`, 4);
  if (cre.header.shieldFlags) writeFlags(
    writer,
    cre.header.shieldFlags,
    'shieldFlags',
    4,
  );
  else writer.writeLine(`shieldFlags: [],`, 4);
  writer.writeLine(`fieldOfVision: ${cre.header.fieldOfVision ?? null},`, 4);
  if (cre.header.attributes) writeFlags(
    writer,
    cre.header.attributes,
    'attributes',
    4,
  );
  else writer.writeLine(`attributes: [],`, 4);
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
  discover({ type: 'script', name: cre.header.overrideScriptRef });

  writer.writeLine(`classScriptRef: '${cre.header.classScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.classScriptRef });

  writer.writeLine(`raceScriptRef: '${cre.header.raceScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.raceScriptRef });

  writer.writeLine(`generalScriptRef: '${cre.header.generalScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.generalScriptRef });

  writer.writeLine(`defaultScriptRef: '${cre.header.defaultScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.defaultScriptRef });

  writer.writeLine(`allegiance: '${cre.header.allegiance}',`, 4);
  writer.writeLine(`general: '${cre.header.general}',`, 4);
  writer.writeLine(`race: '${cre.header.race}',`, 4);
  writer.writeLine(`theClass: '${cre.header.theClass}',`, 4);
  discover({ type: 'class', name: cre.header.theClass });
  writer.writeLine(`specific: '${cre.header.specific}',`, 4);
  writer.writeLine(`gender: '${cre.header.gender}',`, 4);
  writer.writeLine(`objectSpecs: [`, 4);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`],`, 4);
  writer.writeLine(`alignment: '${cre.header.alignment}',`, 4);
  discover({ type: 'alignment', name: cre.header.alignment });
  writer.writeLine(`globalIdentifier: ${cre.header.globalIdentifier},`, 4);
  writer.writeLine(`localIdentifier: ${cre.header.localIdentifier},`, 4);
  if (cre.header.scriptName) {
    writer.writeLine(`scriptName: '${cre.header.scriptName}',`, 4);
    discover({ type: 'script', name: cre.header.scriptName });
  }
  else {
    writer.writeLine(`scriptName: '',`, 4);
  }
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
  writer.writeLine(`export default _${npcLowercaseId}CreatureSkeleton;`);

  return writer.done();
};

const buildCreatureSkeletonV11 = (cre: GhostCreatureV11, discover: DiscoverNext): string => {
  const npcLowercaseId = createNpcLowercaseId(cre.resourceName);

  discover({ type: 'who', name: npcLowercaseId });

  const writer = createWriter();
  writer.writeLine(`import type { UntranslatedCreatureV11 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${cre.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${npcLowercaseId}CreatureSkeleton = () => {`);
  writer.writeLine(`const creature: UntranslatedCreatureV11 = {`, 2);

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
  writer.writeLine(`goodIncrementBy: ${cre.header.goodIncrementBy ?? null},`, 4);
  writer.writeLine(`lawIncrementBy: ${cre.header.lawIncrementBy ?? null},`, 4);
  writer.writeLine(`ladyIncrementBy: ${cre.header.ladyIncrementBy ?? null},`, 4);
  writer.writeLine(`faction: ${cre.header.faction ?? null},`, 4);
  writer.writeLine(`team: ${cre.header.team ?? null},`, 4);
  writer.writeLine(`species: '${cre.header.species ?? null}',`, 4);
  writer.writeLine(`dialogueActivationRange: ${cre.header.dialogueActivationRange ?? null},`, 4);
  writer.writeLine(`collisionRadius: ${cre.header.collisionRadius ?? null},`, 4);
  if (cre.header.shieldFlags) writeFlags(
    writer,
    cre.header.shieldFlags,
    'shieldFlags',
    4,
  );
  else writer.writeLine(`shieldFlags: [],`, 4);
  writer.writeLine(`fieldOfVision: ${cre.header.fieldOfVision ?? null},`, 4);
  if (cre.header.attributes) writeFlags(
    writer,
    cre.header.attributes,
    'attributes',
    4,
  );
  else writer.writeLine(`attributes: [],`, 4);
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
  discover({ type: 'script', name: cre.header.overrideScriptRef });

  writer.writeLine(`classScriptRef: '${cre.header.classScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.classScriptRef });

  writer.writeLine(`raceScriptRef: '${cre.header.raceScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.raceScriptRef });

  writer.writeLine(`generalScriptRef: '${cre.header.generalScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.generalScriptRef });

  writer.writeLine(`defaultScriptRef: '${cre.header.defaultScriptRef}',`, 4);
  discover({ type: 'script', name: cre.header.defaultScriptRef });

  writer.writeLine(`overlaysOffset: '${cre.header.overlaysOffset}',`, 4);
  writer.writeLine(`overlaysSize: '${cre.header.overlaysSize}',`, 4);
  writer.writeLine(`murderIncrementBy: ${cre.header.murderIncrementBy},`, 4);
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
  discover({ type: 'class', name: cre.header.theClass });
  writer.writeLine(`specific: '${cre.header.specific}',`, 4);
  writer.writeLine(`gender: '${cre.header.gender}',`, 4);
  writer.writeLine(`objectSpecs: [`, 4);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`'${cre.header.objectSpec1}',`, 6);
  writer.writeLine(`],`, 4);
  writer.writeLine(`alignment: '${cre.header.alignment}',`, 4);
  discover({ type: 'alignment', name: cre.header.alignment });
  writer.writeLine(`globalIdentifier: ${cre.header.globalIdentifier},`, 4);
  writer.writeLine(`localIdentifier: ${cre.header.localIdentifier},`, 4);
  if (cre.header.scriptName) {
    writer.writeLine(`scriptName: '${cre.header.scriptName}',`, 4);
    discover({ type: 'script', name: cre.header.scriptName });
  }
  else {
    writer.writeLine(`scriptName: '',`, 4);
  }
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
  writer.writeLine(`export default _${npcLowercaseId}CreatureSkeleton;`);

  return writer.done();
};

const buildCreatureSkeleton = (cre: GhostCreature, discover: DiscoverNext): string => {
  switch (cre.header.version) {
    case 'v1.0':return buildCreatureSkeletonV10(cre as GhostCreatureV10, discover);
    case 'v1.1':return buildCreatureSkeletonV11(cre as GhostCreatureV11, discover);
  }
};

export default buildCreatureSkeleton;
