import { evalGhostFactory } from '@planar/shared';

import {
  postApiGhostTis,
  postApiGhostTisByTisIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostTis } from '@planar/shared';

export type LoadGhostTisProps = Readonly<{
  tisId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostTis = async ({
  tisId,
  serverUrl,
  ghostDir,
}: LoadGhostTisProps): Promise<GhostTis> => {
  const response = await postApiGhostTisByTisIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { tisId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = evalGhostFactory<GhostTis>(response.data.data.content);
  return skeleton();
};

export const listGhostTis = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostTis({
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
