import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostBmp,
  postApiGhostBmpByBmpIdSkeleton,
} from '@/swagger/client';

import { evalGhostFactory, type GhostBmp } from '@planar/shared';

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

  const skeleton = evalGhostFactory<GhostBmp>(response.data.data.content);
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
