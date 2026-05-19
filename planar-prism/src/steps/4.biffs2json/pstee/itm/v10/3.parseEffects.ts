import { extendMap } from './3.parseEffects.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type {
  AbstractEffectV10,
  EffectOpCode0V10,
  EffectOpCode1V10,
  EffectOpCode3V10,
  EffectOpCode6V10,
  EffectOpCode7V10,
  EffectOpCode9V10,
  EffectOpCode10V10,
  EffectOpCode11V10,
  EffectOpCode12V10,
  EffectOpCode15V10,
  EffectOpCode16V10,
  EffectOpCode17V10,
  EffectOpCode18V10,
  EffectOpCode19V10,
  EffectOpCode20V10,
  EffectOpCode21V10,
  EffectOpCode22V10,
  EffectOpCode23V10,
  EffectOpCode24V10,
  EffectOpCode25V10,
  EffectOpCode27V10,
  EffectOpCode28V10,
  EffectOpCode29V10,
  EffectOpCode30V10,
  EffectOpCode33V10,
  EffectOpCode34V10,
  EffectOpCode35V10,
  EffectOpCode36V10,
  EffectOpCode37V10,
  EffectOpCode38V10,
  EffectOpCode41V10,
  EffectOpCode42V10,
  EffectOpCode44V10,
  EffectOpCode45V10,
  EffectOpCode49V10,
  EffectOpCode54V10,
  EffectOpCode59V10,
  EffectOpCode62V10,
  EffectOpCode65V10,
  EffectOpCode66V10,
  EffectOpCode73V10,
  EffectOpCode74V10,
  EffectOpCode83V10,
  EffectOpCode84V10,
  EffectOpCode85V10,
  EffectOpCode86V10,
  EffectOpCode87V10,
  EffectOpCode88V10,
  EffectOpCode89V10,
  EffectOpCode90V10,
  EffectOpCode91V10,
  EffectOpCode92V10,
  EffectOpCode93V10,
  EffectOpCode94V10,
  EffectOpCode97V10,
  EffectOpCode98V10,
  EffectOpCode101V10,
  EffectOpCode104V10,
  EffectOpCode105V10,
  EffectOpCode106V10,
  EffectOpCode109V10,
  EffectOpCode120V10,
  EffectOpCode128V10,
  EffectOpCode138V10,
  EffectOpCode146V10,
  EffectOpCode147V10,
  EffectOpCode148V10,
  EffectOpCode159V10,
  EffectOpCode161V10,
  EffectOpCode166V10,
  EffectOpCode169V10,
  EffectOpCode173V10,
  EffectOpCode174V10,
  EffectOpCode206V10,
  EffectOpCode208V10,
  EffectOpCode215V10,
  EffectOpCode267V10,
  EffectOpCode269V10,
  EffectOpCode278V10,
  EffectOpCode296V10,
  EffectOpCode297V10,
  EffectOpCode301V10,
  EffectOpCode319V10,
  EffectOpCode354V10,
  EffectOpCode355V10,
  EffectOpCode369V10,
  EffectOpCode380V10,
  EffectOpCode383V10,
  EffectV10,
} from './3.parseEffects.types.js';
import { normalizeRef } from '@/shared/numbers.js';

export const parseEffect = (reader: BufferReader): EffectV10 => {
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

  const abstractEffect: AbstractEffectV10 = {
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
      const effect: EffectOpCode0V10 = {
        ...abstractEffect,
        opcode,
        acvalue: custom1,
        bonusTo: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'modifyAttacksPerRound': {
      const effect: EffectOpCode1V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'berserk': {
      const effect: EffectOpCode3V10 = {
        ...abstractEffect,
        opcode,
        berserkType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'charismaBonus': {
      const effect: EffectOpCode6V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'setColor': {
      const effect: EffectOpCode7V10 = {
        ...abstractEffect,
        opcode,
        color: custom1,
        location: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'setColorGlowPulse': {
      const effect: EffectOpCode9V10 = {
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
      const effect: EffectOpCode10V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'curePoison': {
      const effect: EffectOpCode11V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'damage': {
      const effect: EffectOpCode12V10 = {
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
      const effect: EffectOpCode15V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'haste': {
      const effect: EffectOpCode16V10 = {
        ...abstractEffect,
        opcode,
        hasteType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'currentHpBonus': {
      const effect: EffectOpCode17V10 = {
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
      const effect: EffectOpCode18V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        mode: custom3,
      };
      return effect;
    }
    case 'intelligenceBonus': {
      const effect: EffectOpCode19V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'invisibility': {
      const effect: EffectOpCode20V10 = {
        ...abstractEffect,
        opcode,
        invisibilityType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'loreBonus': {
      const effect: EffectOpCode21V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'luckBonus': {
      const effect: EffectOpCode22V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'moraleBonus': {
      const effect: EffectOpCode23V10 = {
        ...abstractEffect,
        opcode,
        mode: custom3,
      };
      return effect;
    }
    case 'panic': {
      const effect: EffectOpCode24V10 = {
        ...abstractEffect,
        opcode,
        panicType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'poison': {
      const effect: EffectOpCode25V10 = {
        ...abstractEffect,
        opcode,
        amount: custom1,
        poisonType: custom2,
        icon: custom3,
      };
      return effect;
    }
    case 'acidResistanceBonus': {
      const effect: EffectOpCode27V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'coldResistanceBonus': {
      const effect: EffectOpCode28V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'electricityResistanceBonus': {
      const effect: EffectOpCode29V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'fireResistanceBonus': {
      const effect: EffectOpCode30V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsDeathBonus': {
      const effect: EffectOpCode33V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsWandBonus': {
      const effect: EffectOpCode34V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsPolymorphBonus': {
      const effect: EffectOpCode35V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsBreathBonus': {
      const effect: EffectOpCode36V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'saveVsSpellBonus': {
      const effect: EffectOpCode37V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'silence': {
      const effect: EffectOpCode38V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'sparkle': {
      const effect: EffectOpCode41V10 = {
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
      const effect: EffectOpCode42V10 = {
        ...abstractEffect,
        opcode,
        amountSpellsToAdd: custom1,
        spellLevels: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'strengthBonus': {
      const effect: EffectOpCode44V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'stun': {
      const effect: EffectOpCode45V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'wisdomBonus': {
      const effect: EffectOpCode49V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'baseThac0Bonus': {
      const effect: EffectOpCode54V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'moveSilentlyBonus': {
      const effect: EffectOpCode59V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'bonusPriestSpell': {
      const effect: EffectOpCode62V10 = {
        ...abstractEffect,
        opcode,
        amountSpellsToAdd: custom1,
        spellLevels: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'blur': {
      const effect: EffectOpCode65V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'translucency': {
      const effect: EffectOpCode66V10 = {
        ...abstractEffect,
        opcode,
        fadeAmount: custom1,
        visualEffect: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'attackDamageBonus': {
      const effect: EffectOpCode73V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'blindness': {
      const effect: EffectOpCode74V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'immunityToProjectile': {
      const effect: EffectOpCode83V10 = {
        ...abstractEffect,
        opcode,
        projectile: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'magicalFireResistanceBonus': {
      const effect: EffectOpCode84V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'magicalColdResistanceBonus': {
      const effect: EffectOpCode85V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'slashingResistanceBonus': {
      const effect: EffectOpCode86V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'crushingResistanceBonus': {
      const effect: EffectOpCode87V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'piercingResistanceBonus': {
      const effect: EffectOpCode88V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'missileResistanceBonus': {
      const effect: EffectOpCode89V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'openLockBonus': {
      const effect: EffectOpCode90V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'findTrapBonus': {
      const effect: EffectOpCode91V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'pickPocketBonus': {
      const effect: EffectOpCode92V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'fatigueBonus': {
      const effect: EffectOpCode93V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'intoxicationBonus': {
      const effect: EffectOpCode94V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'exceptionalStrengthBonus': {
      const effect: EffectOpCode97V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'regeneration': {
      const effect: EffectOpCode98V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        regenerationType: custom2,
        icon: custom3,
      };
      return effect;
    }
    case 'immunityToEffect': {
      const effect: EffectOpCode101V10 = {
        ...abstractEffect,
        opcode,
        effect: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'xpBonus': {
      const effect: EffectOpCode104V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'removeGold': {
      const effect: EffectOpCode105V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'moraleBreak': {
      const effect: EffectOpCode106V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'paralyze': {
      const effect: EffectOpCode109V10 = {
        ...abstractEffect,
        opcode,
        idsValue: custom1,
        idsTarget: custom2,
        effect: custom3,
      };
      return effect;
    }
    case 'immunityToWeapons': {
      const effect: EffectOpCode120V10 = {
        ...abstractEffect,
        opcode,
        maximumEnchantment: custom1,
        weaponType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'confusion': {
      const effect: EffectOpCode128V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'setAnimationSequence': {
      const effect: EffectOpCode138V10 = {
        ...abstractEffect,
        opcode,
        sequence: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'castSpell': {
      const effect: EffectOpCode146V10 = {
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
      const effect: EffectOpCode147V10 = {
        ...abstractEffect,
        opcode,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'castSpellAtPoint': {
      const effect: EffectOpCode148V10 = {
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
      const effect: EffectOpCode159V10 = {
        ...abstractEffect,
        opcode,
        imagesCount: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'removeFear': {
      const effect: EffectOpCode161V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'magicResistanceBonus': {
      const effect: EffectOpCode166V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'preventPortraitIcon': {
      const effect: EffectOpCode169V10 = {
        ...abstractEffect,
        opcode,
        icon: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'poisonResistanceBonus': {
      const effect: EffectOpCode173V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'playSound': {
      const effect: EffectOpCode174V10 = {
        ...abstractEffect,
        opcode,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'protectionmFromSpell': {
      const effect: EffectOpCode206V10 = {
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
      const effect: EffectOpCode208V10 = {
        ...abstractEffect,
        opcode,
        hpAmount: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'playVisualEffect': {
      const effect: EffectOpCode215V10 = {
        ...abstractEffect,
        opcode,
        playwhere: custom2,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'disableDisplayString': {
      const effect: EffectOpCode267V10 = {
        ...abstractEffect,
        opcode,
        stringRef: normalizeRef(custom1),
        stringTlk: '', // TODO [snow]: tlk should be added in translation step, not here
        spe: custom3,
      };
      return effect;
    }
    case 'shakeScreen': {
      const effect: EffectOpCode269V10 = {
        ...abstractEffect,
        opcode,
        strength: custom1,
        spe: custom3,
      };
      return effect;
    }
    case 'thac0Bonus': {
      const effect: EffectOpCode278V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        modifierType: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'immunityToSpecificAnimation': {
      const effect: EffectOpCode296V10 = {
        ...abstractEffect,
        opcode,
        resource,
        spe: custom3,
      };
      return effect;
    }
    case 'immunityToTurnUndead': {
      const effect: EffectOpCode297V10 = {
        ...abstractEffect,
        opcode,
        statValue: custom2,
        spe: custom3,
      };
      return effect;
    }
    case 'criticalHitBonus': {
      const effect: EffectOpCode301V10 = {
        ...abstractEffect,
        opcode,
        value: custom1,
        condition: custom2,
        attackType: custom3,
      };
      return effect;
    }
    case 'restrictItem': {
      const effect: EffectOpCode319V10 = {
        ...abstractEffect,
        opcode,
        idsTarget: custom2,
        descriptionNoteRef: normalizeRef(custom3),
        descriptionNoteTlk: '', // TODO [snow]: tlk should be added in translation step, not here
      };
      return effect;
    }
    case 'flashScreen': {
      const effect: EffectOpCode354V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'soulExodus': {
      const effect: EffectOpCode355V10 = {
        ...abstractEffect,
        opcode,
        spe: custom3,
      };
      return effect;
    }
    case 'playBamFile': {
      const effect: EffectOpCode369V10 = {
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
      const effect: EffectOpCode380V10 = {
        ...abstractEffect,
        opcode,
        embalmingType: custom2,
        spe: custom3,

      };
      return effect;
    }
    case 'hitPointTransfer': {
      const effect: EffectOpCode383V10 = {
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
}: ParseFeatureBlocksProps): EffectV10[] => {
  const effectSize = 48;
  return Array.from<never, EffectV10>({ length: count }, (_, i) => parseEffect(reader.fork(reader.offset + i * effectSize)));
};
