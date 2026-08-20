import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostBmp,
  postApiGhostBmpByBmpIdSkeleton,
} from '@/swagger/client';

import type { GhostBmp } from '@planar/shared';

type Skeleton = () => GhostBmp;

export type LoadGhostBmpProps = Readonly<{
  bmpId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostBmp = async ({
  bmpId,
  serverUrl,
  ghostDir,
}: LoadGhostBmpProps): Promise<GhostBmp> => {
  const response = await postApiGhostBmpByBmpIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { bmpId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostBmp = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostBmp({
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
