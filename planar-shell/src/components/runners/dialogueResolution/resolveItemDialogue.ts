import { getCurrentDialogues } from '../Item/store/itemApi';
import { loadTranslatedDialogue } from '../Dialogue/store/dialogueApi';
import { pickMatchingConstructorStateId } from '../Dialogue/store/helpers';

import type { GameLanguage, StateId } from '@planar/shared';

export type ResolvedItemDialogue = Readonly<{
  dialogueId: string;
  stateId: StateId;
}>;

export type ResolveItemDialogueParams = Readonly<{
  itemId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
}>;

export const resolveItemDialogue = async ({
  itemId,
  serverUrl,
  ghostDir,
  gameLanguage,
}: ResolveItemDialogueParams): Promise<ResolvedItemDialogue> => {
  const dialogueIds = await getCurrentDialogues(serverUrl, itemId);

  for (const dialogueId of dialogueIds) {
    const tree = await loadTranslatedDialogue({
      dialogueId,
      serverUrl,
      ghostDir,
      gameLanguage,
    });
    const stateId = pickMatchingConstructorStateId(tree);
    if (stateId) return { dialogueId, stateId };
  }

  throw new Error(`No dialogue constructor matched for item '${itemId}'`);
};
