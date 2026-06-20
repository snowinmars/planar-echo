import { getCurrentDialogues } from '../Creature/store/creatureApi';
import { loadTranslatedDialogue } from '../Dialogue/store/dialogueApi';
import { pickMatchingConstructorStateId } from '../Dialogue/store/helpers';

import type { GameLanguage, StateId } from '@planar/shared';

export type ResolvedCreatureDialogue = Readonly<{
  dialogueId: string;
  stateId: StateId;
}>;

export type ResolveCreatureDialogueParams = Readonly<{
  creatureId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
}>;

export const resolveCreatureDialogue = async ({
  creatureId,
  serverUrl,
  ghostDir,
  gameLanguage,
}: ResolveCreatureDialogueParams): Promise<ResolvedCreatureDialogue> => {
  const dialogueIds = await getCurrentDialogues(serverUrl, creatureId);

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

  throw new Error(`No dialogue constructor matched for creature '${creatureId}'`);
};
