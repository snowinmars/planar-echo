import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  tisId,
  ghostDir,
}: Command): Promise<Result> => {
  const tisSkeletonFile = join(ghostDir, 'ghost', 'tis', 'dist', `${tisId}.js`);
  const found = await fileExists(tisSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${tisId}' is not found at '${tisSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(tisSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${tisSkeletonFile}*/\n${content}` },
  };
};
