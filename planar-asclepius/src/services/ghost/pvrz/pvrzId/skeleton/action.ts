import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  pvrzId,
  ghostDir,
}: Command): Promise<Result> => {
  const pvrzSkeletonFile = join(ghostDir, 'ghost', 'pvrz', 'dist', `${pvrzId}.js`);
  const found = await fileExists(pvrzSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${pvrzId}' is not found at '${pvrzSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(pvrzSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${pvrzSkeletonFile}*/\n${content}` },
  };
};
