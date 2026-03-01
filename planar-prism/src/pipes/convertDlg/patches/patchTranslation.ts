import type { PlainNpcDialogue } from '../types.js';
import type { TlkEntry } from '../../../pipes/convertTlk/types.js';

const patchTranslation = (dialogue: PlainNpcDialogue, tlk: TlkEntry): PlainNpcDialogue => {
  const states = dialogue.states.map(x => ({ ...x }));
  const responses = dialogue.responses.map(x => ({ ...x }));

  for (const state of states) {
    if (state.textRef && state.textRef > 0) {
      const tlkItem = tlk.itemsMap.get(state.textRef);
      if (!tlkItem) throw new Error(`Unable to find tlk translation for state textRef '${state.textRef}'`);
      state.text = tlkItem.text;
      state.soundResRef = tlkItem.soundResRef;
      state.flags = tlkItem.flags;
    }
  }

  for (const response of responses) {
    if (response.textRef && response.textRef > 0) {
      const tlkItem = tlk.itemsMap.get(response.textRef);
      if (!tlkItem) throw new Error(`Unable to find tlk translation for response textRef '${response.textRef}'`);
      response.text = tlkItem.text;
      response.soundResRef = tlkItem.soundResRef;
      response.flags = tlkItem.flags;
    }

    if (response.journalRef && response.journalRef > 0) {
      const journalTlkItem = tlk.itemsMap.get(response.journalRef);
      if (!journalTlkItem) throw new Error(`Unable to find tlk translation for response journalRef '${response.journalRef}'`);
      response.journal = journalTlkItem.text;
    }
  }

  return {
    ...dialogue,
    states,
    responses,
  };
};

export default patchTranslation;
