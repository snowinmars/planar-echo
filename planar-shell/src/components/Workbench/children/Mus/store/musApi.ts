import { evalGhostFactory } from '@planar/shared';

import {
  postApiGhostMus,
  postApiGhostMusByMusIdSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostMus } from '@planar/shared';

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

  const skeleton = evalGhostFactory<GhostMus>(response.data.data.content);
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
