import { createDlgLogic } from '@/engine/dlgLogic';
import { getDbDlg, setDbDlg } from '@/shared/indexedDb';
import {
  getApiGhostByResourceTypeByResourceNameSkeleton,
  getApiGhostTlkByGameLanguage,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostDlg } from '@planar/shared';

import type {
  DlgRepository,
  LoadDlgTreeProps,
  LoadTlkLinesProps,
  Skeleton,
  TlkItems,
} from './dlgRepository.types';

const loadTlkLines = async ({
  serverUrl,
  gameLanguage,
  tlkRefs,
}: LoadTlkLinesProps): Promise<TlkItems> => {
  const response = await getApiGhostTlkByGameLanguage({
    client,
    baseURL: serverUrl,
    path: { gameLanguage },
    query: { tlkRefs },
    throwOnError: true,
  });

  const content = response.data.data.content;
  return new Map(content.map(({ ref, line }) => [ref, line]));
};

const loadDlgTree = async ({
  dlgId,
  serverUrl,
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
    const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
      client,
      baseURL: serverUrl,
      path: { resourceType: 'dlg', resourceName: dlgId },
      throwOnError: true,
    });
    const skeletonContent = skeletonResponse.data.data.content;
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
