import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  musId,
  ghostDir,
}: Command): Promise<Result> => {
  const musSkeletonFile = join(ghostDir, 'ghost', 'mus', 'dist', `${musId}.js`);
  const found = await fileExists(musSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${musId}' is not found at '${musSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(musSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${musSkeletonFile}*/\n${content}` },
  };
};
