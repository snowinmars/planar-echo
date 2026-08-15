import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostDlgByDlgIdSkeleton,
  postApiGhostTlkByGameLanguage,
} from '@/swagger/client';
import { getDbDlg, setDbDlg } from '@/shared/indexedDb';
import { createDlgLogic } from '@/engine/dlgLogic';

import type { GhostDlg } from '@planar/shared';
import type {
  DlgRepository,
  GetSkeletonProps,
  LoadDlgTreeProps,
  LoadTlkLinesProps,
  Skeleton,
  TlkItems,
} from './dlgRepository.types';

const getSkeleton = async ({
  serverUrl,
  ghostDir,
  dlgId,
}: GetSkeletonProps): Promise<string> => {
  const skeletonResponse = await postApiGhostDlgByDlgIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { dlgId: dlgId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

const loadTlkLines = async ({
  serverUrl,
  ghostDir,
  gameLanguage,
  tlkRefs,
}: LoadTlkLinesProps): Promise<TlkItems> => {
  const response = await postApiGhostTlkByGameLanguage({
    client,
    baseURL: serverUrl,
    body: {
      ghostDir,
      tlkRefs,
    },
    path: { gameLanguage },
  });

  if (response.error) {
    console.error(response.error);
    throw new Error(response.error.error.message);
  }

  const content = response.data.data.content;

  return new Map(content.map(({ ref, line }) => [ref, line]));
};

const loadDlgTree = async ({
  dlgId,
  serverUrl,
  ghostDir,
  narrative,
  character,
}: LoadDlgTreeProps,
): Promise<GhostDlg> => {
  const dbDlg = await getDbDlg(dlgId);
  let skeleton: Skeleton;

  if (dbDlg) {
    skeleton = ((0, eval)(dbDlg.skeleton));
  }
  else {
    const skeletonContent = await getSkeleton({
      serverUrl,
      ghostDir,
      dlgId,
    });
    await setDbDlg(dlgId, skeletonContent);
    skeleton = ((0, eval)(skeletonContent));
  }

  const logic = createDlgLogic({ narrative, character });
  return skeleton(logic);
};

export const dlgRepository: DlgRepository = {
  loadTlkLines,
  loadDlgTree,
};
