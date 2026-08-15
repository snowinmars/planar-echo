import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostItmByItmIdSkeleton,
  getApiMapItmToDlgsByItmId,
} from '@/swagger/client';
import { getDbItm, setDbItm } from '@/shared/indexedDb';

import type { GhostItm } from '@planar/shared';

type Skeleton = () => GhostItm;
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
  let skeleton: Skeleton;

  if (dbItm) {
    skeleton = ((0, eval)(dbItm.skeleton));
  }
  else {
    const skeletonContent = await getSkeleton(serverUrl, ghostDir, itmId);
    await setDbItm(itmId, skeletonContent);
    skeleton = ((0, eval)(skeletonContent));
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
