import { extendMap } from './3.parseEffects.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type {
  RawItmAbstractEffectV10,
  RawItmEffectOpCode0V10,
  RawItmEffectOpCode1V10,
  RawItmEffectOpCode3V10,
  RawItmEffectOpCode6V10,
  RawItmEffectOpCode7V10,
  RawItmEffectOpCode9V10,
  RawItmEffectOpCode10V10,
  RawItmEffectOpCode11V10,
  RawItmEffectOpCode12V10,
  RawItmEffectOpCode15V10,
  RawItmEffectOpCode16V10,
  RawItmEffectOpCode17V10,
  RawItmEffectOpCode18V10,
  RawItmEffectOpCode19V10,
  RawItmEffectOpCode20V10,
  RawItmEffectOpCode21V10,
  RawItmEffectOpCode22V10,
  RawItmEffectOpCode23V10,
  RawItmEffectOpCode24V10,
  RawItmEffectOpCode25V10,
  RawItmEffectOpCode27V10,
  RawItmEffectOpCode28V10,
  RawItmEffectOpCode29V10,
  RawItmEffectOpCode30V10,
  RawItmEffectOpCode33V10,
  RawItmEffectOpCode34V10,
  RawItmEffectOpCode35V10,
  RawItmEffectOpCode36V10,
  RawItmEffectOpCode37V10,
  RawItmEffectOpCode38V10,
  RawItmEffectOpCode41V10,
  RawItmEffectOpCode42V10,
  RawItmEffectOpCode44V10,
  RawItmEffectOpCode45V10,
  RawItmEffectOpCode49V10,
  RawItmEffectOpCode54V10,
  RawItmEffectOpCode59V10,
  RawItmEffectOpCode62V10,
  RawItmEffectOpCode65V10,
  RawItmEffectOpCode66V10,
  RawItmEffectOpCode73V10,
  RawItmEffectOpCode74V10,
  RawItmEffectOpCode83V10,
  RawItmEffectOpCode84V10,
  RawItmEffectOpCode85V10,
  RawItmEffectOpCode86V10,
  RawItmEffectOpCode87V10,
  RawItmEffectOpCode88V10,
  RawItmEffectOpCode89V10,
  RawItmEffectOpCode90V10,
  RawItmEffectOpCode91V10,
  RawItmEffectOpCode92V10,
  RawItmEffectOpCode93V10,
  RawItmEffectOpCode94V10,
  RawItmEffectOpCode97V10,
  RawItmEffectOpCode98V10,
  RawItmEffectOpCode101V10,
  RawItmEffectOpCode104V10,
  RawItmEffectOpCode105V10,
  RawItmEffectOpCode106V10,
  RawItmEffectOpCode109V10,
  RawItmEffectOpCode120V10,
  RawItmEffectOpCode128V10,
  RawItmEffectOpCode138V10,
  RawItmEffectOpCode146V10,
  RawItmEffectOpCode147V10,
  RawItmEffectOpCode148V10,
  RawItmEffectOpCode159V10,
  RawItmEffectOpCode161V10,
  RawItmEffectOpCode166V10,
  RawItmEffectOpCode169V10,
  RawItmEffectOpCode173V10,
  RawItmEffectOpCode174V10,
  RawItmEffectOpCode206V10,
  RawItmEffectOpCode208V10,
  RawItmEffectOpCode215V10,
  RawItmEffectOpCode267V10,
  RawItmEffectOpCode269V10,
  RawItmEffectOpCode278V10,
  RawItmEffectOpCode296V10,
  RawItmEffectOpCode297V10,
  RawItmEffectOpCode301V10,
  RawItmEffectOpCode319V10,
  RawItmEffectOpCode354V10,
  RawItmEffectOpCode355V10,
  RawItmEffectOpCode369V10,
  RawItmEffectOpCode380V10,
  RawItmEffectOpCode383V10,
  RawItmEffectV10,
} from './3.parseEffects.types.js';
import { normalizeRef } from '@/shared/numbers.js';

export const parseEffect = (reader: BufferReader): RawItmEffectV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.1.htm

  const opcode = reader.map.short(extendMap.opcode.parse);
  const target = reader.map.byte(extendMap.target.parse);
  const power = reader.byte();
  const custom1 = reader.uint();
  const custom2 = reader.uint();
  const timingMode = reader.map.byte(extendMap.timingMode.parse);
  const dispelOrResistance = reader.map.byte(extendMap.dispelOrResistance.parse);
  const duration = reader.uint();
  const probability1 = reader.byte();
  const probability2 = reader.byte();
  const resource = reader.string(8);
  const diceThrownCountOrMaximumLevel = reader.uint();
  const diceSidesOrMinimumLevel = reader.uint();
  const savingThrowType = reader.map.uint(extendMap.savingThrowType.parseFlags);
  const savingThrowBonus = reader.uint();
  const custom3 = reader.uint();

  const abstractEffect: RawItmAbstractEffectV10 = {
    target,
    power, // TODO [snow]: not always, redo to custom
    timingMode,
    dispelOrResistance,
    duration,
    probability1,
    probability2,
    diceThrownCountOrMaximumLevel,
    diceSidesOrMinimumLevel,
    savingThrowType,
    savingThrowBonus,
  };

  // TODO [snow}: should I write it in binary order?
  switch (opcode) {
    case 'acBonus': {
      const effect: RawItmEffectOpCode0V10 = {
        ...abstractEffect,
        opcode,
        acvalue: custom1,
        bonusTo: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'modifyAttacksPerRound': {
      const effect: RawItmEffectOpCode1V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'berserk': {
      const effect: RawItmEffectOpCode3V10 = {
        ...abstractEffect,
        opcode,
        berserkType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'charismaBonus': {
      const effect: RawItmEffectOpCode6V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'setColor': {
      const effect: RawItmEffectOpCode7V10 = {
        ...abstractEffect,
        opcode,
        color: custom1,
        location: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'setColorGlowPulse': {
      const effect: RawItmEffectOpCode9V10 = {
        ...abstractEffect,
        opcode,
        color: custom1,
        location: custom2 >> 8,
        cycleSpeed: custom2 & 0xff,
        spe: custom3,
      };
      return effect;
    }
    case 'consitutionBonus': {
      const effect: RawItmEffectOpCode10V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'curePoison': {
      const effect: RawItmEffectOpCode11V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'damage': {
      const effect: RawItmEffectOpCode12V10 = {
        ...abstractEffect,
        opcode,
        amount: custom1,
        mode: custom2 >> 8,
        damageType: custom2 & 0xff,
        flags: custom3,
      };
      return effect;
    }
    case 'dexterityBonus': {
      const effect: RawItmEffectOpCode15V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'haste': {
      const effect: RawItmEffectOpCode16V10 = {
        ...abstractEffect,
        opcode,
        hasteType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'currentHpBonus': {
      const effect: RawItmEffectOpCode17V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2 >> 8,
        healFlags: custom2 & 0xff,
        spe: custom3,
      };
      return effect;
    }
    case 'maximumHpBonus': {
      const effect: RawItmEffectOpCode18V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        mode: custom3,
      };
      return effect;
    }
    case 'intelligenceBonus': {
      const effect: RawItmEffectOpCode19V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'invisibility': {
      const effect: RawItmEffectOpCode20V10 = {
        ...abstractEffect,
        opcode,
        invisibilityType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'loreBonus': {
      const effect: RawItmEffectOpCode21V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'luckBonus': {
      const effect: RawItmEffectOpCode22V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'moraleBonus': {
      const effect: RawItmEffectOpCode23V10 = {
        ...abstractEffect,
        opcode,
        mode: custom3,
      };
      return effect;
    }
    case 'panic': {
      const effect: RawItmEffectOpCode24V10 = {
        ...abstractEffect,
        opcode,
        panicType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'poison': {
      const effect: RawItmEffectOpCode25V10 = {
        ...abstractEffect,
        opcode,
        amount: custom1,
        poisonType: custom2,
        icon: custom3,
      };
      return effect;
    }
    case 'acidResistanceBonus': {
      const effect: RawItmEffectOpCode27V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'coldResistanceBonus': {
      const effect: RawItmEffectOpCode28V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'electricityResistanceBonus': {
      const effect: RawItmEffectOpCode29V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'fireResistanceBonus': {
      const effect: RawItmEffectOpCode30V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsDeathBonus': {
      const effect: RawItmEffectOpCode33V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsWandBonus': {
      const effect: RawItmEffectOpCode34V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsPolymorphBonus': {
      const effect: RawItmEffectOpCode35V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsBreathBonus': {
      const effect: RawItmEffectOpCode36V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsSpellBonus': {
      const effect: RawItmEffectOpCode37V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'silence': {
      const effect: RawItmEffectOpCode38V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'sparkle': {
      const effect: RawItmEffectOpCode41V10 = {
        ...abstractEffect,
        opcode,
        amount: custom1,
        particleEffect: custom2,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'bonusWizardSpell': {
      const effect: RawItmEffectOpCode42V10 = {
        ...abstractEffect,
        opcode,
        amountSpellsToAdd: custom1,
        spellLevels: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'strengthBonus': {
      const effect: RawItmEffectOpCode44V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'stun': {
      const effect: RawItmEffectOpCode45V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'wisdomBonus': {
      const effect: RawItmEffectOpCode49V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'baseThac0Bonus': {
      const effect: RawItmEffectOpCode54V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'moveSilentlyBonus': {
      const effect: RawItmEffectOpCode59V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'bonusPriestSpell': {
      const effect: RawItmEffectOpCode62V10 = {
        ...abstractEffect,
        opcode,
        amountSpellsToAdd: custom1,
        spellLevels: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'blur': {
      const effect: RawItmEffectOpCode65V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'translucency': {
      const effect: RawItmEffectOpCode66V10 = {
        ...abstractEffect,
        opcode,
        fadeAmount: custom1,
        visualEffect: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'attackDamageBonus': {
      const effect: RawItmEffectOpCode73V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'blindness': {
      const effect: RawItmEffectOpCode74V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'immunityToProjectile': {
      const effect: RawItmEffectOpCode83V10 = {
        ...abstractEffect,
        opcode,
        projectile: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'magicalFireResistanceBonus': {
      const effect: RawItmEffectOpCode84V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'magicalColdResistanceBonus': {
      const effect: RawItmEffectOpCode85V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'slashingResistanceBonus': {
      const effect: RawItmEffectOpCode86V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'crushingResistanceBonus': {
      const effect: RawItmEffectOpCode87V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'piercingResistanceBonus': {
      const effect: RawItmEffectOpCode88V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'missileResistanceBonus': {
      const effect: RawItmEffectOpCode89V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'openLockBonus': {
      const effect: RawItmEffectOpCode90V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'findTrapBonus': {
      const effect: RawItmEffectOpCode91V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'pickPocketBonus': {
      const effect: RawItmEffectOpCode92V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'fatigueBonus': {
      const effect: RawItmEffectOpCode93V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'intoxicationBonus': {
      const effect: RawItmEffectOpCode94V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'exceptionalStrengthBonus': {
      const effect: RawItmEffectOpCode97V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'regeneration': {
      const effect: RawItmEffectOpCode98V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        regenerationType: custom2,
        icon: custom3,
      };
      return effect;
    }
    case 'immunityToEffect': {
      const effect: RawItmEffectOpCode101V10 = {
        ...abstractEffect,
        opcode,
        effect: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'xpBonus': {
      const effect: RawItmEffectOpCode104V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'removeGold': {
      const effect: RawItmEffectOpCode105V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'moraleBreak': {
      const effect: RawItmEffectOpCode106V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'paralyze': {
      const effect: RawItmEffectOpCode109V10 = {
        ...abstractEffect,
        opcode,
        idsValue: custom1,
        idsTarget: custom2,
        effect: custom3,
      };
      return effect;
    }
    case 'immunityToWeapons': {
      const effect: RawItmEffectOpCode120V10 = {
        ...abstractEffect,
        opcode,
        maximumEnchantment: custom1,
        weaponType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'confusion': {
      const effect: RawItmEffectOpCode128V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'setAnimationSequence': {
      const effect: RawItmEffectOpCode138V10 = {
        ...abstractEffect,
        opcode,
        sequence: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'castSpell': {
      const effect: RawItmEffectOpCode146V10 = {
        ...abstractEffect,
        opcode,
        castAtLevel: custom1,
        mode: custom2,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'learnSpell': {
      const effect: RawItmEffectOpCode147V10 = {
        ...abstractEffect,
        opcode,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'castSpellAtPoint': {
      const effect: RawItmEffectOpCode148V10 = {
        ...abstractEffect,
        opcode,
        castAtLevel: custom1,
        mode: custom2,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'mirrorImageEffect': {
      const effect: RawItmEffectOpCode159V10 = {
        ...abstractEffect,
        opcode,
        imagesCount: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'removeFear': {
      const effect: RawItmEffectOpCode161V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'magicResistanceBonus': {
      const effect: RawItmEffectOpCode166V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'preventPortraitIcon': {
      const effect: RawItmEffectOpCode169V10 = {
        ...abstractEffect,
        opcode,
        icon: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'poisonResistanceBonus': {
      const effect: RawItmEffectOpCode173V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'playSound': {
      const effect: RawItmEffectOpCode174V10 = {
        ...abstractEffect,
        opcode,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'protectionmFromSpell': {
      const effect: RawItmEffectOpCode206V10 = {
        ...abstractEffect,
        opcode,
        stringRef: normalizeRef(custom1),
        stringTlk: '', // TODO [snow]: tlk should be added in translation step, not here
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'minimumHp': {
      const effect: RawItmEffectOpCode208V10 = {
        ...abstractEffect,
        opcode,
        hpAmount: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'playVisualEffect': {
      const effect: RawItmEffectOpCode215V10 = {
        ...abstractEffect,
        opcode,
        playwhere: custom2,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'disableDisplayString': {
      const effect: RawItmEffectOpCode267V10 = {
        ...abstractEffect,
        opcode,
        stringRef: normalizeRef(custom1),
        stringTlk: '', // TODO [snow]: tlk should be added in translation step, not here
        spe: custom3,
      };
      return effect;
    }
    case 'shakeScreen': {
      const effect: RawItmEffectOpCode269V10 = {
        ...abstractEffect,
        opcode,
        strength: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'thac0Bonus': {
      const effect: RawItmEffectOpCode278V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'immunityToSpecificAnimation': {
      const effect: RawItmEffectOpCode296V10 = {
        ...abstractEffect,
        opcode,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'immunityToTurnUndead': {
      const effect: RawItmEffectOpCode297V10 = {
        ...abstractEffect,
        opcode,
        statValue: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'criticalHitBonus': {
      const effect: RawItmEffectOpCode301V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        condition: custom2,
        attackType: custom3,
      };
      return effect;
    }
    case 'restrictItem': {
      const effect: RawItmEffectOpCode319V10 = {
        ...abstractEffect,
        opcode,
        idsTarget: custom2,
        descriptionNoteRef: normalizeRef(custom3),
        descriptionNoteTlk: '', // TODO [snow]: tlk should be added in translation step, not here
      };
      return effect;
    }
    case 'flashScreen': {
      const effect: RawItmEffectOpCode354V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'soulExodus': {
      const effect: RawItmEffectOpCode355V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'playBamFile': {
      const effect: RawItmEffectOpCode369V10 = {
        ...abstractEffect,
        opcode,
        color: custom1,
        method: custom2,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'embalm': {
      const effect: RawItmEffectOpCode380V10 = {
        ...abstractEffect,
        opcode,
        embalmingType: custom2,
        spe: custom3,

      };
      return effect;
    }
    case 'hitPointTransfer': {
      const effect: RawItmEffectOpCode383V10 = {
        ...abstractEffect,
        opcode,
        amount: custom1,
        direction: custom2 >> 8,
        damageType: custom2 & 0xff,
        spe: custom3,
      };
      return effect;
    }
  }
};

type ParseFeatureBlocksProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseEffects = ({
  reader,
  count,
}: ParseFeatureBlocksProps): RawItmEffectV10[] => {
  const r = reader.fork();
  return Array.from<never, RawItmEffectV10>({ length: count }, () => parseEffect(r));
};
