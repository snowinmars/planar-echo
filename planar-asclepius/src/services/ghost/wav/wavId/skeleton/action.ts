import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  wavId,
  ghostDir,
}: Command): Promise<Result> => {
  const wavSkeletonFile = join(ghostDir, 'ghost', 'wav', 'dist', `${wavId}.js`);
  const found = await fileExists(wavSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${wavId}' is not found at '${wavSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(wavSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${wavSkeletonFile}*/\n${content}` },
  };
};
