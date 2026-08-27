import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostBcs,
  postApiGhostBcsByBcsIdSkeleton,
} from '@/swagger/client';

import { evalGhostFactory, type GhostBcs } from '@planar/shared';

export type LoadGhostBcsProps = Readonly<{
  bcsId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostBcs = async ({
  bcsId,
  serverUrl,
  ghostDir,
}: LoadGhostBcsProps): Promise<GhostBcs> => {
  const response = await postApiGhostBcsByBcsIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { bcsId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = evalGhostFactory<GhostBcs>(response.data.data.content);
  return skeleton();
};

export const listGhostBcs = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostBcs({
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
