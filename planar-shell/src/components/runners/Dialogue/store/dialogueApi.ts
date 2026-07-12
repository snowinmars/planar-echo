import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostDialogueByDialogueIdSkeleton,
  postApiGhostDialogueByDialogueIdByGameLanguage,
} from '@/swagger/client';
import { getDbDialogue, setDbDialogue } from '@/shared/indexedDb';
import { createDialogueLogic } from '@/engine/dialogueLogic';

import type { GameLanguage } from '@/swagger/client';
import type { TranslatedNpcDialogue, UntranslatedNpcDialogue } from '@planar/shared';
import type { ZustandNarrative } from '@/engine/store/narrativeStore';
import type { ZustandCharacter } from '@/engine/store/characterStore';

type Skeleton = <T>(dialogueLogic: T) => UntranslatedNpcDialogue;
export const getSkeleton = async (serverUrl: string, ghostDir: string, dialogueId: string): Promise<string> => {
  const skeletonResponse = await postApiGhostDialogueByDialogueIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { dialogueId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

type Translation = (untranslatedNpcDialogue: UntranslatedNpcDialogue) => TranslatedNpcDialogue;
export const getTranslation = async (serverUrl: string, ghostDir: string, dialogueId: string, gameLanguage: GameLanguage): Promise<string> => {
  const translationResponse = await postApiGhostDialogueByDialogueIdByGameLanguage({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { dialogueId, gameLanguage },
  });

  if (translationResponse.error) {
    console.error(translationResponse.error);
    throw new Error(translationResponse.error.error.message);
  }
  else {
    return translationResponse.data.data.content;
  }
};

export type LoadTranslatedDialogueProps = Readonly<{
  dialogueId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  narrative: ZustandNarrative;
  character: ZustandCharacter;
}>;
export const loadTranslatedDialogue = async ({
  dialogueId,
  serverUrl,
  ghostDir,
  gameLanguage,
  narrative,
  character,
}: LoadTranslatedDialogueProps,
): Promise<TranslatedNpcDialogue> => {
  const dbDialogue = await getDbDialogue(dialogueId);
  let skeleton: Skeleton;
  let translation: Translation;

  if (dbDialogue) {
    skeleton = ((0, eval)(dbDialogue.skeleton));
    translation = ((0, eval)(dbDialogue.translation));
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, dialogueId);
    const translationContent = await getTranslation(serverUrl, ghostDir, dialogueId, gameLanguage);
    await setDbDialogue(dialogueId, skeletonContent, translationContent);
    skeleton = ((0, eval)(skeletonContent));
    translation = ((0, eval)(translationContent));
  }

  const logic = createDialogueLogic({ narrative, character });
  const untranslated = skeleton(logic);
  const translated = translation(untranslated);
  return translated;
};
