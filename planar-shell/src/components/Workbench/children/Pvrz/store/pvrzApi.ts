import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostPvrz,
  postApiGhostPvrzByPvrzIdSkeleton,
} from '@/swagger/client';

import { evalGhostFactory, type GhostPvr } from '@planar/shared';

export type LoadGhostPvrzProps = Readonly<{
  pvrzId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostPvrz = async ({
  pvrzId,
  serverUrl,
  ghostDir,
}: LoadGhostPvrzProps): Promise<GhostPvr> => {
  const response = await postApiGhostPvrzByPvrzIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { pvrzId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = evalGhostFactory<GhostPvr>(response.data.data.content);
  return skeleton();
};

export const listGhostPvrz = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostPvrz({
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
