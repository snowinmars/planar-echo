import { evalGhostFactory } from '@planar/shared';

import { getDbItm, setDbItm } from '@/shared/indexedDb';
import {
  getApiGhostByResourceTypeByResourceNameSkeleton,
  getApiMapItmToDlgsByItmId,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostItm } from '@planar/shared';

export type LoadGhostItmProps = Readonly<{
  itmId: string;
  serverUrl: string;
}>;
export const loadGhostItm = async ({
  itmId,
  serverUrl,
}: LoadGhostItmProps,
): Promise<GhostItm> => {
  const dbItm = await getDbItm(itmId);
  let skeleton: () => GhostItm;

  if (dbItm) {
    skeleton = evalGhostFactory<GhostItm>(dbItm.skeleton);
  }
  else {
    const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
      client,
      baseURL: serverUrl,
      path: { resourceType: 'itm', resourceName: itmId },
      throwOnError: true,
    });
    const skeletonContent = skeletonResponse.data.data.content;
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
    throwOnError: true,
  });

  return currentDlgsResponse.data;
};
