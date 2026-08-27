import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostBam,
  postApiGhostBamByBamIdSkeleton,
} from '@/swagger/client';

import { evalGhostFactory, type GhostBam } from '@planar/shared';

export type LoadGhostBamProps = Readonly<{
  bamId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostBam = async ({
  bamId,
  serverUrl,
  ghostDir,
}: LoadGhostBamProps): Promise<GhostBam> => {
  const response = await postApiGhostBamByBamIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { bamId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = evalGhostFactory<GhostBam>(response.data.data.content);
  return skeleton();
};

export const listGhostBam = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostBam({
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
