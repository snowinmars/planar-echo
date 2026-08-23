import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostTwoda,
  postApiGhostTwodaByTwodaIdSkeleton,
} from '@/swagger/client';

import type { GhostTwoda } from '@planar/shared';

type Skeleton = () => GhostTwoda;

export type LoadGhostTwodaProps = Readonly<{
  twodaId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostTwoda = async ({
  twodaId,
  serverUrl,
  ghostDir,
}: LoadGhostTwodaProps): Promise<GhostTwoda> => {
  const response = await postApiGhostTwodaByTwodaIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { twodaId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostTwoda = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostTwoda({
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
