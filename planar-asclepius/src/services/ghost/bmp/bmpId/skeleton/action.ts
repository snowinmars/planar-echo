import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  bmpId,
  ghostDir,
}: Command): Promise<Result> => {
  const bmpSkeletonFile = join(ghostDir, 'ghost', 'bmp', 'dist', `${bmpId}.js`);
  const found = await fileExists(bmpSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${bmpId}' is not found at '${bmpSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(bmpSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${bmpSkeletonFile}*/\n${content}` },
  };
};
