import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostIds,
  postApiGhostIdsByIdsIdSkeleton,
} from '@/swagger/client';

import type { GhostIds } from '@planar/shared';

type Skeleton = () => GhostIds;

export type LoadGhostIdsProps = Readonly<{
  idsId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostIds = async ({
  idsId,
  serverUrl,
  ghostDir,
}: LoadGhostIdsProps): Promise<GhostIds> => {
  const response = await postApiGhostIdsByIdsIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { idsId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostIds = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostIds({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
  });

  if (error) {
    console.error(error);
    throw new Error(error.error.message);
  }

  return data;
};
