import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostItemByItemIdSkeleton,
  getApiMapItemToDialoguesByItemId,
} from '@/swagger/client';
import { getDbItem, setDbItem } from '@/shared/indexedDb';

import type { UntranslatedItem } from '@planar/shared';

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

export type LoadUntranslatedItemProps = Readonly<{
  itemId: string;
  serverUrl: string;
  ghostDir: string;
}>;
export const loadUntranslatedItem = async ({
  itemId,
  serverUrl,
  ghostDir,
}: LoadUntranslatedItemProps,
): Promise<UntranslatedItem> => {
  const dbItem = await getDbItem(itemId);
  let skeleton: Skeleton;

  if (dbItem) {
    skeleton = ((0, eval)(dbItem.skeleton));
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, itemId);
    await setDbItem(itemId, skeletonContent);
    skeleton = ((0, eval)(skeletonContent));
  }

  return skeleton();
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
