import { evalGhostFactory } from '@planar/shared';

import {
  postApiGhostSrc,
  postApiGhostSrcBySrcIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostSrc } from '@planar/shared';

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

  const skeleton = evalGhostFactory<GhostSrc>(response.data.data.content);
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
