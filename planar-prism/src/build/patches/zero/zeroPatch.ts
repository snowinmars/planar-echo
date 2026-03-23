import createWriter from '../../../shared/writer.js';

import type { DlgState } from '../../../steps/4.biffs2json/dlg/v1.types/2.states.js';
import type { Dlg } from '../../../steps/4.biffs2json/dlg/types.js';

const morte1 = 'dmorte1.dlg';

const patchMorte1 = (npcDialogue: Dlg): Dlg => {
  const morte1_state0 = npcDialogue.states.find(x => x.index === 0)!;
  const new_morte1_state0: DlgState = {
    ...morte1_state0,
    action: createWriter()
      .writeLine(`l.talkMorte();`, 6)
      .writeLine(`return {`, 6)
      .writeLine(`id: 'playSound',`, 8)
      .writeLine(`args: {`, 8)
      .writeLine(`sound: 'morte1_state0',`, 10)
      .writeLine(`},`, 8)
      .writeLine(`};`, 6)
      .done(),
  };

  return {
    ...npcDialogue,
    states: [
      new_morte1_state0,
      ...npcDialogue.states.filter(x => x.index !== 0),
    ],
  };
};

const zeroPatch = (npcDialogues: Dlg[]): Dlg[] => {
  const morte1Index = npcDialogues.findIndex(x => x.resourceName === morte1);
  const newMorte1 = patchMorte1(npcDialogues[morte1Index]!);

  if (morte1Index === 0) {
    return [
      newMorte1,
      ...npcDialogues.slice(morte1Index + 1),
    ];
  }
  else {
    return [
      ...npcDialogues.slice(0, morte1Index - 1),
      newMorte1,
      ...npcDialogues.slice(morte1Index),
    ];
  }
};

export default zeroPatch;
