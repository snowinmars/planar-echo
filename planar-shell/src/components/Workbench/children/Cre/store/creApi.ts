import { evalGhostFactory } from '@planar/shared';

import { getDbCre, setDbCre } from '@/shared/indexedDb';
import {
  getApiGhostByResourceTypeByResourceNameSkeleton,
  getApiMapCreToDlgsByCreId,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostCre } from '@planar/shared';

export type LoadGhostCreProps = Readonly<{
  creId: string;
  serverUrl: string;
}>;
export const loadGhostCre = async ({
  creId,
  serverUrl,
}: LoadGhostCreProps,
): Promise<GhostCre> => {
  const dbCre = await getDbCre(creId);
  let skeleton: () => GhostCre;

  if (dbCre) {
    skeleton = evalGhostFactory<GhostCre>(dbCre.skeleton);
  }
  else {
    const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
      client,
      baseURL: serverUrl,
      path: { resourceType: 'cre', resourceName: creId },
      throwOnError: true,
    });
    const skeletonContent = skeletonResponse.data.data.content;
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
    throwOnError: true,
  });

  return currentDlgsResponse.data;
};
