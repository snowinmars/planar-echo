import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostWed,
  postApiGhostWedByWedIdSkeleton,
} from '@/swagger/client';

import type { GhostWed } from '@planar/shared';

type Skeleton = () => GhostWed;

export type LoadGhostWedProps = Readonly<{
  wedId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostWed = async ({
  wedId,
  serverUrl,
  ghostDir,
}: LoadGhostWedProps): Promise<GhostWed> => {
  const response = await postApiGhostWedByWedIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { wedId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostWed = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostWed({
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
