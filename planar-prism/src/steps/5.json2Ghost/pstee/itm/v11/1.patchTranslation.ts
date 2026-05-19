import type { Tlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { ItmV10 } from '@/steps/4.biffs2json/pstee/itm/index.js';
import type { GhostItemV10 } from '../../../types.js';
import type { EffectV10 } from '@/steps/4.biffs2json/pstee/itm/v10/3.parseEffects.types.js';

const translateEffect = (effect: EffectV10, tlk: Tlk): EffectV10 => {
  switch (effect.opcode) {
    case 'protectionmFromSpell': return {
      ...effect,
      stringTlk: tlk.getText(effect.stringRef),
    };
    case 'disableDisplayString':return {
      ...effect,
      stringTlk: tlk.getText((effect).stringRef),
    };
    case 'restrictItem':return {
      ...effect,
      descriptionNoteTlk: tlk.getText((effect).descriptionNoteRef),
    };
    default: return effect;
  }
};
export const patchWithTranslation = (item: ItmV10, tlk: Tlk): GhostItemV10 => {
  switch (item.header.version) {
    case 'v10': return {
      ...item,
      header: {
        ...item.header,
        unidentifiedNameTlk: tlk.getText(item.header.unidentifiedNameRef),
        identifiedNameTlk: tlk.getText(item.header.identifiedNameRef),
        unidentifiedDescriptionTlk: tlk.getText(item.header.unidentifiedDescriptionRef),
        identifiedDescriptionTlk: tlk.getText(item.header.identifiedDescriptionRef),
      },
      abilities: item.abilities.map(ability => ({
        ...ability,
        effects: ability.effects.map(effect => translateEffect(effect, tlk)),
      })),
      effects: item.effects.map(effect => translateEffect(effect, tlk)),
    };
  }
};
