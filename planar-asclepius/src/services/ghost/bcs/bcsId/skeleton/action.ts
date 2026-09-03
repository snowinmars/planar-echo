import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  bcsId,
  ghostDir,
}: Command): Promise<Result> => {
  const bcsSkeletonFile = join(ghostDir, 'ghost', 'bcs', 'dist', `${bcsId}.js`);
  const found = await fileExists(bcsSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${bcsId}' is not found at '${bcsSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(bcsSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${bcsSkeletonFile}*/\n${content}` },
  };
};
