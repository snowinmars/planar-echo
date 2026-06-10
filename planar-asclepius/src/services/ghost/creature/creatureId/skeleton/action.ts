import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  creatureId,
  ghostDir,
}: Command): Promise<Result> => {
  const creatureSkeletonPath = join(ghostDir, 'ghost', 'creatures', 'dist', `${creatureId}.js`);
  const found = await fileExists(creatureSkeletonPath);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${creatureId}' is not found at '${creatureSkeletonPath}'`,
      },
    };
  };

  const content = await readFile(creatureSkeletonPath, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${creatureSkeletonPath}*/\n${content}` },
  };
}; ;
