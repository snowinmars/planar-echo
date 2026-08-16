import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostMos,
  postApiGhostMosByMosIdSkeleton,
} from '@/swagger/client';

import type { GhostMos } from '@planar/shared';

type Skeleton = () => GhostMos;

export type LoadGhostMosProps = Readonly<{
  mosId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostMos = async ({
  mosId,
  serverUrl,
  ghostDir,
}: LoadGhostMosProps): Promise<GhostMos> => {
  const response = await postApiGhostMosByMosIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { mosId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostMos = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostMos({
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
