import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostCreatureByCreatureIdSkeleton,
  postApiGhostCreatureByCreatureIdByGameLanguage,
  getApiMapCreatureToDialoguesByCreatureId,
} from '@/swagger/client';
import { getDbCreature, setDbCreature } from '@/shared/indexedDb';

import type { GameLanguage, TranslatedCreature, UntranslatedCreature } from '@planar/shared';

type Skeleton = () => UntranslatedCreature;
export const getSkeleton = async (serverUrl: string, ghostDir: string, creatureId: string): Promise<string> => {
  const skeletonResponse = await postApiGhostCreatureByCreatureIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { creatureId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

type Translation = (untranslatedNpcDialogue: UntranslatedCreature) => TranslatedCreature;
export const getTranslation = async (serverUrl: string, ghostDir: string, creatureId: string, gameLanguage: GameLanguage): Promise<string> => {
  const translationResponse = await postApiGhostCreatureByCreatureIdByGameLanguage({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { creatureId, gameLanguage },
  });
  if (translationResponse.error) {
    console.error(translationResponse.error);
    throw new Error(translationResponse.error.error.message);
  }
  else {
    return translationResponse.data.data.content;
  }
};

export type LoadTranslatedCreatureProps = Readonly<{
  creatureId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
}>;
export const loadTranslatedCreature = async ({
  creatureId,
  serverUrl,
  ghostDir,
  gameLanguage,
}: LoadTranslatedCreatureProps,
): Promise<TranslatedCreature> => {
  const dbCreature = await getDbCreature(creatureId);
  let skeleton: Skeleton;
  let translation: Translation;

  if (dbCreature) {
    skeleton = ((0, eval)(dbCreature.skeleton));
    translation = ((0, eval)(dbCreature.translation));
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, creatureId);
    const translationContent = await getTranslation(serverUrl, ghostDir, creatureId, gameLanguage);
    await setDbCreature(creatureId, skeletonContent, translationContent);
    skeleton = ((0, eval)(skeletonContent));
    translation = ((0, eval)(translationContent));
  }

  const untranslated = skeleton();
  const translated = translation(untranslated);
  return translated;
};

export const getCurrentDialogues = async (serverUrl: string, creatureId: string): Promise<string[]> => {
  const currentDialoguesResponse = await getApiMapCreatureToDialoguesByCreatureId({
    client,
    baseURL: serverUrl,
    path: { creatureId },
  });

  if (currentDialoguesResponse.error) {
    console.error(currentDialoguesResponse.error);
    throw new Error(currentDialoguesResponse.error.error.message);
  }
  else {
    return currentDialoguesResponse.data;
  }
};
