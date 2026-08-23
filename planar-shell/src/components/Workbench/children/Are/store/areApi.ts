import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostAre,
  postApiGhostAreByAreIdSkeleton,
} from '@/swagger/client';

import type { GhostAre } from '@planar/shared';

type Skeleton = () => GhostAre;

export type LoadGhostAreProps = Readonly<{
  areId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostAre = async ({
  areId,
  serverUrl,
  ghostDir,
}: LoadGhostAreProps): Promise<GhostAre> => {
  const response = await postApiGhostAreByAreIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { areId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostAre = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostAre({
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
