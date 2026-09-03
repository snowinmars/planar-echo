import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  effId,
  ghostDir,
}: Command): Promise<Result> => {
  const effSkeletonFile = join(ghostDir, 'ghost', 'eff', 'dist', `${effId}.js`);
  const found = await fileExists(effSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${effId}' is not found at '${effSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(effSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${effSkeletonFile}*/\n${content}` },
  };
};
