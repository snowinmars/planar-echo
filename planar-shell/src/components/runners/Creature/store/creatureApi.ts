import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostCreatureByCreatureIdSkeleton,
  getApiMapCreatureToDialoguesByCreatureId,
} from '@/swagger/client';
import { getDbCreature, setDbCreature } from '@/shared/indexedDb';

import type {
  UntranslatedCreatureV10,
  UntranslatedCreatureV11,
} from '@planar/shared';

type UntranslatedCreature = UntranslatedCreatureV10 | UntranslatedCreatureV11;
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

export type LoadUntranslatedCreatureProps = Readonly<{
  creatureId: string;
  serverUrl: string;
  ghostDir: string;
}>;
export const loadUntranslatedCreature = async ({
  creatureId,
  serverUrl,
  ghostDir,
}: LoadUntranslatedCreatureProps,
): Promise<UntranslatedCreature> => {
  const dbCreature = await getDbCreature(creatureId);
  let skeleton: Skeleton;

  if (dbCreature) {
    skeleton = ((0, eval)(dbCreature.skeleton));
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, creatureId);
    await setDbCreature(creatureId, skeletonContent);
    skeleton = ((0, eval)(skeletonContent));
  }

  return skeleton();
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
