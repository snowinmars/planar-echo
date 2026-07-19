import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  dialogueId,
  ghostDir,
}: Command): Promise<Result> => {
  const dialogueSkeletonFile = join(ghostDir, 'ghost', 'dialogues', 'dist', `${dialogueId}.js`);
  const found = await fileExists(dialogueSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${dialogueId}' is not found at '${dialogueSkeletonFile}'`,
      },
    };
  };

  const content = await readFile(dialogueSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${dialogueSkeletonFile}*/\n${content}` },
  };
};
