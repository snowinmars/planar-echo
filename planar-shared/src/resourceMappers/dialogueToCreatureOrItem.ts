import { dialogueToCreatures } from './creatureToDialogue.js';
import { dialogueToItems } from './itemToDialogues.js';

export const dialogueToCreatureOrItem = (npcLowercaseId: string): string => {
  // TODO [snow]: it is a good idea, I can reuse it in prism/pickCre.ts,
  // But idk how to properly choose dialogue for creature and creature for dialogue
  // I should review gemrb for this algorithm
  const creatures = dialogueToCreatures(`${npcLowercaseId}.dlg`, false);
  if (creatures.length) {
    const creature = creatures.sort(x => x.length)[0];
    if (creature) return creature.replace('.cre', '');
  }
  const items = dialogueToItems(`${npcLowercaseId}.dlg`, false);
  if (items.length) {
    const item = items.sort(x => x.length)[0];
    if (item) return item.replace('.itm', '');
  }
  throw new Error(`What is '${npcLowercaseId}', if not dialogue for creature or item?`);
};
