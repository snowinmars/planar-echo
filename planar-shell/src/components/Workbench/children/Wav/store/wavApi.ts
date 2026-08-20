import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostWav,
  postApiGhostWavByWavIdSkeleton,
} from '@/swagger/client';

import type { GhostWav } from '@planar/shared';

type Skeleton = () => GhostWav;

export type LoadGhostWavProps = Readonly<{
  wavId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostWav = async ({
  wavId,
  serverUrl,
  ghostDir,
}: LoadGhostWavProps): Promise<GhostWav> => {
  const response = await postApiGhostWavByWavIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { wavId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostWav = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostWav({
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
