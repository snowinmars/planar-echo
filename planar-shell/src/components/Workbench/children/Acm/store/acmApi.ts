import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostAcm,
  postApiGhostAcmByAcmIdSkeleton,
} from '@/swagger/client';

import type { GhostAcm } from '@planar/shared';

type Skeleton = () => GhostAcm;

export type LoadGhostAcmProps = Readonly<{
  acmId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostAcm = async ({
  acmId,
  serverUrl,
  ghostDir,
}: LoadGhostAcmProps): Promise<GhostAcm> => {
  const response = await postApiGhostAcmByAcmIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { acmId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostAcm = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostAcm({
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
