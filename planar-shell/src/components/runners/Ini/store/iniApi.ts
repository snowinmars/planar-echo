import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostIni,
  postApiGhostIniByIniIdSkeleton,
} from '@/swagger/client';

import type { GhostIni } from '@planar/shared';

type Skeleton = () => GhostIni;

export type LoadGhostIniProps = Readonly<{
  iniId: string;
  serverUrl: string;
  ghostDir: string;
}>;

export const loadGhostIni = async ({
  iniId,
  serverUrl,
  ghostDir,
}: LoadGhostIniProps): Promise<GhostIni> => {
  const response = await postApiGhostIniByIniIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { iniId },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const skeleton = ((0, eval)(response.data.data.content)) as Skeleton;
  return skeleton();
};

export const listGhostIni = async (serverUrl: string, ghostDir: string): Promise<string[]> => {
  const { error, data } = await postApiGhostIni({
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
