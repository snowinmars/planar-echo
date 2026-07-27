import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostDialogueByDialogueIdSkeleton,
  postApiGhostTlkByGameLanguage,
} from '@/swagger/client';
import { getDbDialogue, setDbDialogue } from '@/shared/indexedDb';
import { createDialogueLogic } from '@/engine/dialogueLogic';

import type { NpcDialogue } from '@planar/shared';
import type {
  DialogueRepository,
  GetSkeletonProps,
  LoadDialogueTreeProps,
  LoadTlkLinesProps,
  Skeleton,
  TlkItems,
} from './dialogueRepository.types';

const getSkeleton = async ({
  serverUrl,
  ghostDir,
  dialogueId,
}: GetSkeletonProps): Promise<string> => {
  const skeletonResponse = await postApiGhostDialogueByDialogueIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir },
    path: { dialogueId },
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

const loadDialogueTree = async ({
  dialogueId,
  serverUrl,
  ghostDir,
  narrative,
  character,
}: LoadDialogueTreeProps,
): Promise<NpcDialogue> => {
  const dbDialogue = await getDbDialogue(dialogueId);
  let skeleton: Skeleton;

  if (dbDialogue) {
    skeleton = ((0, eval)(dbDialogue.skeleton));
  }
  else {
    const skeletonContent = await getSkeleton({
      serverUrl,
      ghostDir,
      dialogueId,
    });
    await setDbDialogue(dialogueId, skeletonContent);
    skeleton = ((0, eval)(skeletonContent));
  }

  const logic = createDialogueLogic({ narrative, character });
  return skeleton(logic);
};

export const dialogueRepository: DialogueRepository = {
  loadTlkLines,
  loadDialogueTree,
};
