import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostEff,
  postApiGhostEffByEffIdSkeleton,
} from '@/swagger/client';

import type { GhostEff } from '@planar/shared';

type Skeleton = () => GhostEff;

export type LoadGhostEffProps = Readonly<{
  effId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostEff = async ({
  effId,
  serverUrl,
  ghostDir,
}: LoadGhostEffProps): Promise<GhostEff> => {
  const response = await postApiGhostEffByEffIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { effId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostEff = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostEff({
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
