import { evalGhostFactory } from '@planar/shared';

import { getDbItm, setDbItm } from '@/shared/indexedDb';
import {
  getApiMapItmToDlgsByItmId,
  postApiGhostItmByItmIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostItm } from '@planar/shared';

export const getSkeleton = async (serverUrl: string, ghostDir: string, itmId: string): Promise<string> => {
  const skeletonResponse = await postApiGhostItmByItmIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostDir },
    path: { itmId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

export type LoadGhostItmProps = Readonly<{
  itmId: string;
  serverUrl: string;
  ghostDir: string;
}>;
export const loadGhostItm = async ({
  itmId,
  serverUrl,
  ghostDir,
}: LoadGhostItmProps,
): Promise<GhostItm> => {
  const dbItm = await getDbItm(itmId);
  let skeleton: () => GhostItm;

  if (dbItm) {
    skeleton = evalGhostFactory<GhostItm>(dbItm.skeleton);
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, itmId);
    await setDbItm(itmId, skeletonContent);
    skeleton = evalGhostFactory<GhostItm>(skeletonContent);
  }

  return skeleton();
};

export const getCurrentDlgs = async (serverUrl: string, itmId: string): Promise<string[]> => {
  const currentDlgsResponse = await getApiMapItmToDlgsByItmId({
    client,
    baseURL: serverUrl,
    path: { itmId },
  });

  if (currentDlgsResponse.error) {
    console.error(currentDlgsResponse.error);
    throw new Error(currentDlgsResponse.error.error.message);
  }
  else {
    return currentDlgsResponse.data;
  }
};
