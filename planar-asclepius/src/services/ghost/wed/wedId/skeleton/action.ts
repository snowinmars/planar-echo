import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  wedId,
  ghostDir,
}: Command): Promise<Result> => {
  const wedSkeletonFile = join(ghostDir, 'ghost', 'wed', 'dist', `${wedId}.js`);
  const found = await fileExists(wedSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${wedId}' is not found at '${wedSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(wedSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${wedSkeletonFile}*/\n${content}` },
  };
};
