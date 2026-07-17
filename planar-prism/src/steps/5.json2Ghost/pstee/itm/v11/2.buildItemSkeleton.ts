import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';

import type { GhostItemV10 } from '../../../types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { Writer } from '@/shared/writer.js';
import type { AbilityV10 } from '@/steps/4.biffs2json/pstee/itm/v10/2.parseAbilities.types.js';
import type { EffectV10 } from '@/steps/4.biffs2json/pstee/itm/v10/3.parseEffects.types.js';

const createLowercaseId = (resourceName: string): string => {
  const candidate = resourceName.split('.')[0]!.replace(`'`, ``);
  // @ts-expect-error : js is a meme, but efficient meme
  const isDigit = candidate[0] > -1;
  if (isDigit) return `_${candidate}`;
  return candidate;
};

const writeEffect = (writer: Writer, effect: EffectV10): void => {
  writer.writeLine(`opcode: '${effect.opcode}',`, 8);
  writer.writeLine(`target: '${effect.target}',`, 8);
  writer.writeLine(`power: ${effect.power},`, 8);
  writer.writeLine(`timingMode: '${effect.timingMode}',`, 8);
  writer.writeLine(`dispelOrResistance: '${effect.dispelOrResistance}',`, 8);
  writer.writeLine(`duration: ${effect.duration},`, 8);
  writer.writeLine(`probability1: ${effect.probability1},`, 8);
  writer.writeLine(`probability2: ${effect.probability2},`, 8);
  writer.writeLine(`diceThrownCountOrMaximumLevel: ${effect.diceThrownCountOrMaximumLevel},`, 8);
  writer.writeLine(`diceSidesOrMinimumLevel: ${effect.diceSidesOrMinimumLevel},`, 8);
  writeFlags(
    writer,
    effect.savingThrowType,
    'savingThrowType',
    8,
  );
  writer.writeLine(`savingThrowBonus: ${effect.savingThrowBonus},`, 8);

  switch (effect.opcode) {
    case 'acBonus': {
      writer.writeLine(`acvalue: ${effect.acvalue},`, 8);
      writer.writeLine(`bonusTo: ${effect.bonusTo},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'modifyAttacksPerRound': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'berserk': {
      writer.writeLine(`berserkType: ${effect.berserkType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'charismaBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'setColor': {
      writer.writeLine(`color: ${effect.color},`, 8);
      writer.writeLine(`location: ${effect.location},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'setColorGlowPulse': {
      writer.writeLine(`color: ${effect.color},`, 8);
      writer.writeLine(`location: ${effect.location},`, 8);
      writer.writeLine(`cycleSpeed: ${effect.cycleSpeed},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'consitutionBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'curePoison': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'damage': {
      writer.writeLine(`amount: ${effect.amount},`, 8);
      writer.writeLine(`mode: ${effect.mode},`, 8);
      writer.writeLine(`damageType: ${effect.damageType},`, 8);
      writer.writeLine(`flags: ${effect.flags},`, 8);
      break;
    }
    case 'dexterityBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'haste': {
      writer.writeLine(`hasteType: ${effect.hasteType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'currentHpBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`healFlags: ${effect.healFlags},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'maximumHpBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`mode: ${effect.mode},`, 8);
      break;
    }
    case 'intelligenceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'invisibility': {
      writer.writeLine(`invisibilityType: ${effect.invisibilityType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'loreBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'luckBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'moraleBonus': {
      writer.writeLine(`mode: ${effect.mode},`, 8);
      break;
    }
    case 'panic': {
      writer.writeLine(`panicType: ${effect.panicType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'poison': {
      writer.writeLine(`amount: ${effect.amount},`, 8);
      writer.writeLine(`poisonType: ${effect.poisonType},`, 8);
      writer.writeLine(`icon: ${effect.icon},`, 8);
      break;
    }
    case 'acidResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'coldResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'electricityResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'fireResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'saveVsDeathBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'saveVsWandBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'saveVsPolymorphBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'saveVsBreathBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'saveVsSpellBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'silence': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'sparkle': {
      writer.writeLine(`amount: ${effect.amount},`, 8);
      writer.writeLine(`particleEffect: ${effect.particleEffect},`, 8);
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'bonusWizardSpell': {
      writer.writeLine(`amountSpellsToAdd: ${effect.amountSpellsToAdd},`, 8);
      writer.writeLine(`spellLevels: ${effect.spellLevels},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'strengthBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'stun': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'wisdomBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'baseThac0Bonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'moveSilentlyBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'bonusPriestSpell': {
      writer.writeLine(`amountSpellsToAdd: ${effect.amountSpellsToAdd},`, 8);
      writer.writeLine(`spellLevels: ${effect.spellLevels},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'blur': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'translucency': {
      writer.writeLine(`fadeAmount: ${effect.fadeAmount},`, 8);
      writer.writeLine(`visualEffect: ${effect.visualEffect},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'attackDamageBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'blindness': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'immunityToProjectile': {
      writer.writeLine(`projectile: ${effect.projectile},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'magicalFireResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'magicalColdResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'slashingResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'crushingResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'piercingResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'missileResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'openLockBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'findTrapBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'pickPocketBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'fatigueBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'intoxicationBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'exceptionalStrengthBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'regeneration': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`regenerationType: ${effect.regenerationType},`, 8);
      writer.writeLine(`icon: ${effect.icon},`, 8);
      break;
    }
    case 'immunityToEffect': {
      writer.writeLine(`effect: ${effect.effect},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'xpBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'removeGold': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'moraleBreak': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'paralyze': {
      writer.writeLine(`idsValue: ${effect.idsValue},`, 8);
      writer.writeLine(`idsTarget: ${effect.idsTarget},`, 8);
      writer.writeLine(`effect: ${effect.effect},`, 8);
      break;
    }
    case 'immunityToWeapons': {
      writer.writeLine(`maximumEnchantment: ${effect.maximumEnchantment},`, 8);
      writer.writeLine(`weaponType: ${effect.weaponType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'confusion': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'setAnimationSequence': {
      writer.writeLine(`sequence: ${effect.sequence},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'castSpell': {
      writer.writeLine(`castAtLevel: ${effect.castAtLevel},`, 8);
      writer.writeLine(`mode: ${effect.mode},`, 8);
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'learnSpell': {
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'castSpellAtPoint': {
      writer.writeLine(`castAtLevel: ${effect.castAtLevel},`, 8);
      writer.writeLine(`mode: ${effect.mode},`, 8);
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'mirrorImageEffect': {
      writer.writeLine(`imagesCount: ${effect.imagesCount},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'removeFear': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'magicResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'preventPortraitIcon': {
      writer.writeLine(`icon: ${effect.icon},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'poisonResistanceBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'playSound': {
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'protectionmFromSpell': {
      writer.writeLine(`stringTlk: '${escapeSingleQuote(effect.stringTlk)}',`, 8);
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'minimumHp': {
      writer.writeLine(`hpAmount: ${effect.hpAmount},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'playVisualEffect': {
      writer.writeLine(`playwhere: ${effect.playwhere},`, 8);
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'disableDisplayString': {
      writer.writeLine(`stringTlk: '${escapeSingleQuote(effect.stringTlk)}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'shakeScreen': {
      writer.writeLine(`strength: ${effect.strength},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'thac0Bonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`modifierType: ${effect.modifierType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'immunityToSpecificAnimation': {
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'immunityToTurnUndead': {
      writer.writeLine(`statValue: ${effect.statValue},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'criticalHitBonus': {
      writer.writeLine(`value: ${effect.value},`, 8);
      writer.writeLine(`condition: ${effect.condition},`, 8);
      writer.writeLine(`attackType: ${effect.attackType},`, 8);
      break;
    }
    case 'restrictItem': {
      writer.writeLine(`idsTarget: ${effect.idsTarget},`, 8);
      writer.writeLine(`descriptionNoteTlk: '${effect.descriptionNoteTlk}',`, 8);
      break;
    }
    case 'flashScreen': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'soulExodus': {
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'playBamFile': {
      writer.writeLine(`color: ${effect.color},`, 8);
      writer.writeLine(`method: ${effect.method},`, 8);
      writer.writeLine(`resource: '${effect.resource}',`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'embalm': {
      writer.writeLine(`embalmingType: ${effect.embalmingType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
    case 'hitPointTransfer': {
      writer.writeLine(`amount: ${effect.amount},`, 8);
      writer.writeLine(`direction: ${effect.direction},`, 8);
      writer.writeLine(`damageType: ${effect.damageType},`, 8);
      writer.writeLine(`spe: ${effect.spe},`, 8);
      break;
    }
  }
};

const writeAbility = (writer: Writer, ability: AbilityV10): void => {
  writer.writeLine(`attackType: '${ability.attackType}',`, 6);
  writeFlags(
    writer,
    ability.typeFlags,
    'typeFlags',
    6,
  );
  writer.writeLine(`abilityLocation: '${ability.abilityLocation}',`, 6);
  writer.writeLine(`alternativeDiceSides: ${ability.alternativeDiceSides},`, 6);
  writer.writeLine(`useIcon: '${ability.useIcon}',`, 6);
  writer.writeLine(`targetType: '${ability.targetType}',`, 6);
  writer.writeLine(`targetCount: ${ability.targetCount},`, 6);
  writer.writeLine(`range: ${ability.range},`, 6);
  writer.writeLine(`projectileType: '${ability.projectileType}',`, 6);
  writer.writeLine(`alternativeDiceThrown: ${ability.alternativeDiceThrown},`, 6);
  writer.writeLine(`speed: ${ability.speed},`, 6);
  writer.writeLine(`alternativeDamageBonus: ${ability.alternativeDamageBonus},`, 6);
  writer.writeLine(`thac0bonus: ${ability.thac0bonus},`, 6);
  writer.writeLine(`diceSides: ${ability.diceSides},`, 6);
  writer.writeLine(`primaryType: ${ability.primaryType},`, 6);
  writer.writeLine(`diceThrown: ${ability.diceThrown},`, 6);
  writer.writeLine(`secondaryType: ${ability.secondaryType},`, 6);
  writer.writeLine(`damageBonus: ${ability.damageBonus},`, 6);
  writer.writeLine(`damageType: '${ability.damageType}',`, 6);
  writer.writeLine(`countOfEffects: ${ability.countOfEffects},`, 6);
  writer.writeLine(`firstEffectIndex: ${ability.firstEffectIndex},`, 6);
  writer.writeLine(`charges: ${ability.charges},`, 6);
  writer.writeLine(`chargeDepletionBehaviour: '${ability.chargeDepletionBehaviour}',`, 6);
  writeFlags(
    writer,
    ability.flags,
    'flags',
    6,
  );
  writer.writeLine(`projectileAnimation: ${ability.projectileAnimation},`, 6);
  writer.writeLine(`overhandSwingAnimation: ${ability.overhandSwingAnimation},`, 6);
  writer.writeLine(`backhandSwingAnimation: ${ability.backhandSwingAnimation},`, 6);
  writer.writeLine(`thrustAnimation: ${ability.thrustAnimation},`, 6);
  writer.writeLine(`isArrow: ${ability.isArrow},`, 6);
  writer.writeLine(`isBolt: ${ability.isBolt},`, 6);
  writer.writeLine(`isBullet: ${ability.isBullet},`, 6);

  writer.write('effects: [', 6);
  for (let i = 0; i < ability.effects.length; i++) {
    writer.writeLine('{');
    writeEffect(writer, ability.effects[i]!);
    if (i === ability.effects.length - 1) writer.write('}', 6);
    else writer.write('}, ', 6);
  }
  writer.writeLine('],');
};

const buildItemSkeletonV11 = (itm: GhostItemV10, discover: DiscoverNext): string => {
  const npcLowercaseId = createLowercaseId(itm.resourceName);

  discover({ type: 'item', name: npcLowercaseId });

  const writer = createWriter();
  writer.writeLine(`import type { UntranslatedItem } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${itm.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${npcLowercaseId}ItemSkeleton = () => {`);
  writer.writeLine(`const item: UntranslatedItem = {`, 2);

  writer.writeLine(`version: '${itm.header.version}',`, 4);
  writer.writeLine(`dropSound: '${itm.header.dropSound ?? null}',`, 4);
  writeFlags(
    writer,
    itm.header.flags,
    'flags',
    4,
  );
  writer.writeLine(`category: '${itm.header.category}',`, 4);
  writeFlags(
    writer,
    itm.header.unusableBy,
    'unusableBy',
    4,
  );
  writer.writeLine(`equippedAppearance: '${itm.header.equippedAppearance}',`, 4);
  writer.writeLine(`minLevel: ${itm.header.minLevel},`, 4);
  writer.writeLine(`minStrength: ${itm.header.minStrength},`, 4);
  writer.writeLine(`minStrengthBonus: ${itm.header.minStrengthBonus},`, 4);
  writeFlags(
    writer,
    itm.header.kitUsability1,
    'kitUsability1',
    4,
  );
  writer.writeLine(`minIntelligence: ${itm.header.minIntelligence},`, 4);
  writeFlags(
    writer,
    itm.header.kitUsability2,
    'kitUsability2',
    4,
  );
  writer.writeLine(`minDexterity: ${itm.header.minDexterity},`, 4);
  writeFlags(
    writer,
    itm.header.kitUsability3,
    'kitUsability3',
    4,
  );
  writer.writeLine(`minWisdom: ${itm.header.minWisdom},`, 4);
  writeFlags(
    writer,
    itm.header.kitUsability4,
    'kitUsability4',
    4,
  );
  writer.writeLine(`minConstitution: ${itm.header.minConstitution},`, 4);
  writer.writeLine(`weaponProficiency: '${itm.header.weaponProficiency}',`, 4);
  writer.writeLine(`minCharisma: ${itm.header.minCharisma},`, 4);
  writer.writeLine(`price: ${itm.header.price},`, 4);
  writer.writeLine(`maxInStack: ${itm.header.maxInStack},`, 4);
  writer.writeLine(`inventoryIcon: '${itm.header.inventoryIcon}',`, 4);
  writer.writeLine(`loreToId: ${itm.header.loreToId},`, 4);
  writer.writeLine(`groundIcon: '${itm.header.groundIcon}',`, 4);
  writer.writeLine(`weight: ${itm.header.weight},`, 4);
  writer.writeLine(`pickupSound: '${itm.header.pickupSound}',`, 4);
  writer.writeLine(`enchantment: ${itm.header.enchantment},`, 4);

  writer.write('abilities: [', 4);
  for (let i = 0; i < itm.abilities.length; i++) {
    writer.writeLine('{');
    writeAbility(writer, itm.abilities[i]!);
    if (i === itm.abilities.length - 1) writer.write('}', 4);
    else writer.write('}, ', 4);
  }
  writer.writeLine('],');

  writer.write('effects: [', 4);
  for (let i = 0; i < itm.effects.length; i++) {
    writer.writeLine('{');
    writeEffect(writer, itm.effects[i]!);
    if (i === itm.effects.length - 1) writer.write('}', 4);
    else writer.write('}, ', 4);
  }
  writer.writeLine('],');

  writer.writeLine('};', 2);
  writer.writeLine('return item;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${npcLowercaseId}ItemSkeleton;`);

  return writer.done();
};

export const buildItemSkeleton = (itm: GhostItemV10, discover: DiscoverNext): string => {
  switch (itm.header.version) {
    case 'v10':return buildItemSkeletonV11(itm, discover);
  }
};
