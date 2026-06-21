import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  itemId,
  ghostDir,
}: Command): Promise<Result> => {
  const itemSkeletonDir = join(ghostDir, 'ghost', 'items', 'dist', `${itemId}.js`);
  const found = await fileExists(itemSkeletonDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${itemId}' is not found at '${itemSkeletonDir}'`,
      },
    };
  };

  const content = await readFile(itemSkeletonDir, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${itemSkeletonDir}*/\n${content}` },
  };
}; ;
