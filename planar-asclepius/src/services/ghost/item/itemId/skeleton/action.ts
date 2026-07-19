import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  itemId,
  ghostDir,
}: Command): Promise<Result> => {
  const itemSkeletonFile = join(ghostDir, 'ghost', 'items', 'dist', `${itemId}.js`);
  const found = await fileExists(itemSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${itemId}' is not found at '${itemSkeletonFile}'`,
      },
    };
  };

  const content = await readFile(itemSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${itemSkeletonFile}*/\n${content}` },
  };
};
