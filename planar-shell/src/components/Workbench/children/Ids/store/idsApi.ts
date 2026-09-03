import { evalGhostFactory } from '@planar/shared';

import {
  postApiGhostIds,
  postApiGhostIdsByIdsIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostIds } from '@planar/shared';

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

  const skeleton = evalGhostFactory<GhostIds>(response.data.data.content);
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
