import { client } from '@/swagger/client/client.gen';
import { postApiGhostDialogueByDialogueIdByGameLanguage } from '@/swagger/client';

import type { GameLanguage, NpcDialogue, UntranslatedNpcDialogue } from '@planar/shared';

type Translation = (untranslatedNpcDialogue: UntranslatedNpcDialogue) => NpcDialogue;
export const getTranslation = async (serverUrl: string, ghostPath: string, dialogueId: string, gameLanguage: GameLanguage): Promise<Translation> => {
  const translationResponse = await postApiGhostDialogueByDialogueIdByGameLanguage({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostPath },
    path: { dialogueId, gameLanguage },
  });
  if (translationResponse.error) {
    console.error(translationResponse.error);
    throw new Error(translationResponse.error.error.message);
  }
  else {
    return eval(translationResponse.data.data.content) as Translation;
  }
};
