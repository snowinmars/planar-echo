import { evalGhostFactory } from '@planar/shared';

import {
  postApiGhostWav,
  postApiGhostWavByWavIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostWav } from '@planar/shared';

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

  const skeleton = evalGhostFactory<GhostWav>(response.data.data.content);
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
