import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared';
import type { Command, Result } from './types';

export default async ({
  dialogueId,
  ghostDir,
}: Command): Promise<Result> => {
  const dialogueSkeletonPath = join(ghostDir, 'ghost', 'dialogues', `${dialogueId}DialogueSkeleton.ghost`);
  const found = await fileExists(dialogueSkeletonPath);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${dialogueId}' is not found at '${dialogueSkeletonPath}'`,
      },
    };
  };

  const content = await readFile(dialogueSkeletonPath, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content },
  };
}; ;
