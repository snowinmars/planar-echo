import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostMus,
  postApiGhostMusByMusIdSkeleton,
} from '@/swagger/client';

import type { GhostMus } from '@planar/shared';

type Skeleton = () => GhostMus;

export type LoadGhostMusProps = Readonly<{
  musId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostMus = async ({
  musId,
  serverUrl,
  ghostDir,
}: LoadGhostMusProps): Promise<GhostMus> => {
  const response = await postApiGhostMusByMusIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { musId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostMus = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostMus({
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
