import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostItemByItemIdSkeleton,
  postApiGhostItemByItemIdByGameLanguage,
  getApiMapItemToDialoguesByItemId,
} from '@/swagger/client';
import { getDbItem, setDbItem } from '@/shared/indexedDb';

import type { GameLanguage, TranslatedItem, UntranslatedItem } from '@planar/shared';

type Skeleton = () => UntranslatedItem;
export const getSkeleton = async (serverUrl: string, ghostDir: string, itemId: string): Promise<string> => {
  const skeletonResponse = await postApiGhostItemByItemIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { itemId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

type Translation = (untranslatedNpcDialogue: UntranslatedItem) => TranslatedItem;
export const getTranslation = async (serverUrl: string, ghostDir: string, itemId: string, gameLanguage: GameLanguage): Promise<string> => {
  const translationResponse = await postApiGhostItemByItemIdByGameLanguage({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { itemId, gameLanguage },
  });
  if (translationResponse.error) {
    console.error(translationResponse.error);
    throw new Error(translationResponse.error.error.message);
  }
  else {
    return translationResponse.data.data.content;
  }
};

export type LoadTranslatedItemProps = Readonly<{
  itemId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
}>;
export const loadTranslatedItem = async ({
  itemId,
  serverUrl,
  ghostDir,
  gameLanguage,
}: LoadTranslatedItemProps,
): Promise<TranslatedItem> => {
  const dbItem = await getDbItem(itemId);
  let skeleton: Skeleton;
  let translation: Translation;

  if (dbItem) {
    skeleton = ((0, eval)(dbItem.skeleton));
    translation = ((0, eval)(dbItem.translation));
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, itemId);
    const translationContent = await getTranslation(serverUrl, ghostDir, itemId, gameLanguage);
    await setDbItem(itemId, skeletonContent, translationContent);
    skeleton = ((0, eval)(skeletonContent));
    translation = ((0, eval)(translationContent));
  }

  const untranslated = skeleton();
  const translated = translation(untranslated);
  return translated;
};

export const getCurrentDialogues = async (serverUrl: string, itemId: string): Promise<string[]> => {
  const currentDialoguesResponse = await getApiMapItemToDialoguesByItemId({
    client,
    baseURL: serverUrl,
    path: { itemId },
  });

  if (currentDialoguesResponse.error) {
    console.error(currentDialoguesResponse.error);
    throw new Error(currentDialoguesResponse.error.error.message);
  }
  else {
    return currentDialoguesResponse.data;
  }
};
