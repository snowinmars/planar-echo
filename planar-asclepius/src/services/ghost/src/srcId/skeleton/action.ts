import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  srcId,
  ghostDir,
}: Command): Promise<Result> => {
  const srcSkeletonFile = join(ghostDir, 'ghost', 'src', 'dist', `${srcId}.js`);
  const found = await fileExists(srcSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${srcId}' is not found at '${srcSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(srcSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${srcSkeletonFile}*/\n${content}` },
  };
};
