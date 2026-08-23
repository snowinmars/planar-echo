import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostSrc,
  postApiGhostSrcBySrcIdSkeleton,
} from '@/swagger/client';

import type { GhostSrc } from '@planar/shared';

type Skeleton = () => GhostSrc;

export type LoadGhostSrcProps = Readonly<{
  srcId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostSrc = async ({
  srcId,
  serverUrl,
  ghostDir,
}: LoadGhostSrcProps): Promise<GhostSrc> => {
  const response = await postApiGhostSrcBySrcIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { srcId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostSrc = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostSrc({
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
