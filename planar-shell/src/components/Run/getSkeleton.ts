import { client } from '@/swagger/client/client.gen';
import { postApiGhostDialogueByDialogueIdSkeleton } from '@/swagger/client';

import type { UntranslatedNpcDialogue } from '@planar/shared';

type Skeleton = <T>(dialogueLogic: T) => UntranslatedNpcDialogue;
export const getSkeleton = async (serverUrl: string, ghostPath: string, dialogueId: string): Promise<Skeleton> => {
  const skeletonResponse = await postApiGhostDialogueByDialogueIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostPath },
    path: { dialogueId: dialogueId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return eval(skeletonResponse.data.data.content) as Skeleton;
  }
};
