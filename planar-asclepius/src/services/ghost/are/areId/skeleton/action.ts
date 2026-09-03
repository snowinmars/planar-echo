import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  areId,
  ghostDir,
}: Command): Promise<Result> => {
  const areSkeletonFile = join(ghostDir, 'ghost', 'are', 'dist', `${areId}.js`);
  const found = await fileExists(areSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${areId}' is not found at '${areSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(areSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${areSkeletonFile}*/\n${content}` },
  };
};
