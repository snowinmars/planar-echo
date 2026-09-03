import { evalGhostFactory } from '@planar/shared';

import { getDbCre, setDbCre } from '@/shared/indexedDb';
import {
  getApiMapCreToDlgsByCreId,
  postApiGhostCreByCreIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostCre } from '@planar/shared';

export const getSkeleton = async (serverUrl: string, ghostDir: string, creId: string): Promise<string> => {
  const skeletonResponse = await postApiGhostCreByCreIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { creId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

export type LoadGhostCreProps = Readonly<{
  creId: string;
  serverUrl: string;
  ghostDir: string;
}>;
export const loadGhostCre = async ({
  creId,
  serverUrl,
  ghostDir,
}: LoadGhostCreProps,
): Promise<GhostCre> => {
  const dbCre = await getDbCre(creId);
  let skeleton: () => GhostCre;

  if (dbCre) {
    skeleton = evalGhostFactory<GhostCre>(dbCre.skeleton);
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, creId);
    await setDbCre(creId, skeletonContent);
    skeleton = evalGhostFactory<GhostCre>(skeletonContent);
  }

  return skeleton();
};

export const getCurrentDlgs = async (serverUrl: string, creId: string): Promise<string[]> => {
  const currentDlgsResponse = await getApiMapCreToDlgsByCreId({
    client,
    baseURL: serverUrl,
    path: { creId },
  });

  if (currentDlgsResponse.error) {
    console.error(currentDlgsResponse.error);
    throw new Error(currentDlgsResponse.error.error.message);
  }
  else {
    return currentDlgsResponse.data;
  }
};
