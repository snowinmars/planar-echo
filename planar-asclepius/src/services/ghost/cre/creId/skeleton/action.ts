import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  creId,
  ghostDir,
}: Command): Promise<Result> => {
  const creSkeletonFile = join(ghostDir, 'ghost', 'cre', 'dist', `${creId}.js`);
  const found = await fileExists(creSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${creId}' is not found at '${creSkeletonFile}'`,
      },
    };
  };

  const content = await readFile(creSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${creSkeletonFile}*/\n${content}` },
  };
};
