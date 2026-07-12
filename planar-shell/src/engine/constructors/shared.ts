import { TranslatedCreature } from '@planar/shared';
import { CharacterNarrativeProps } from './types';

export const createNpc = (translatedCreature: TranslatedCreature): CharacterNarrativeProps => ({
  str: translatedCreature.strength,
  dex: translatedCreature.dexterity,
  con: translatedCreature.constitution,
  int: translatedCreature.intelligence,
  wis: translatedCreature.wisdom,
  chr: translatedCreature.charisma,
  armorclass: translatedCreature.effectiveAc,
  damagebonus: 0,
  level: -1,
  levelFirstClass: translatedCreature.levelFirstClass,
  levelSecondClass: translatedCreature.levelSecondClass,
  levelThirdClass: translatedCreature.levelThirdClass,
  lockpicking: translatedCreature.lockpicking,
  luck: translatedCreature.luck,
  maxhitpoints: translatedCreature.maximumHp,
  pickpocket: translatedCreature.pickPockets,
  resistfire: translatedCreature.fireResistance,
  resistmagicfire: translatedCreature.magicFireResistance,
  stealth: translatedCreature.moveSilently,
  theClass: translatedCreature.theClass,
  traps: translatedCreature.findOrDisarmTraps,
});

// TODO [snow]: this function may have a bug: the nameless one level calculates wrong, because docs do not have rules for that
export const recalculateLevel = (character: CharacterNarrativeProps): CharacterNarrativeProps => {
  if (character.theClass === 'cleric') return {
    ...character,
    level: character.levelFirstClass,
  };
  if (character.theClass === 'cleric_mage') return {
    ...character,
    level: character.levelFirstClass + character.levelSecondClass,
  };

  if (character.theClass === 'fighter') return {
    ...character,
    level: character.levelFirstClass,
  };
  if (character.theClass === 'fighter_mage') return {
    ...character,
    level: character.levelFirstClass + character.levelSecondClass,
  };
  if (character.theClass === 'fighter_thief') return {
    ...character,
    level: character.levelFirstClass + character.levelSecondClass,
  };

  if (character.theClass === 'mage') return {
    ...character,
    level: character.levelFirstClass,
  };

  if (character.theClass === 'no_class') return {
    ...character,
    level: character.levelFirstClass,
  };

  if (character.theClass === 'thief') return {
    ...character,
    level: character.levelFirstClass,
  };

  throw new Error(`Unknown class '${character.theClass}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
};
