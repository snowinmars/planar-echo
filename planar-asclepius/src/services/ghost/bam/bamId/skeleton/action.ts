import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  bamId,
  ghostDir,
}: Command): Promise<Result> => {
  const bamSkeletonFile = join(ghostDir, 'ghost', 'bam', 'dist', `${bamId}.js`);
  const found = await fileExists(bamSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${bamId}' is not found at '${bamSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(bamSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${bamSkeletonFile}*/\n${content}` },
  };
};
