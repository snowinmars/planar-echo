import type { RawTlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { RawItmV10 } from '@/steps/4.biffs2json/pstee/itm/index.js';
import type { ItmWithTlk } from './patchItms.types.js';
import type { RawItmEffectV10 } from '@/steps/4.biffs2json/pstee/itm/v10/3.parseEffects.types.js';

const translateEffect = (effect: RawItmEffectV10, tlk: RawTlk): RawItmEffectV10 => {
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

export const patchWithTranslation = (itm: RawItmV10, tlk: RawTlk): ItmWithTlk => {
  switch (itm.header.version) {
    case 'v10': return {
      ...itm,
      header: {
        ...itm.header,
        unidentifiedNameTlk: tlk.getText(itm.header.unidentifiedNameRef),
        identifiedNameTlk: tlk.getText(itm.header.identifiedNameRef),
        unidentifiedDescriptionTlk: tlk.getText(itm.header.unidentifiedDescriptionRef),
        identifiedDescriptionTlk: tlk.getText(itm.header.identifiedDescriptionRef),
      },
      abilities: itm.abilities.map(ability => ({
        ...ability,
        effects: ability.effects.map(effect => translateEffect(effect, tlk)),
      })),
      effects: itm.effects.map(effect => translateEffect(effect, tlk)),
    };
  }
};
