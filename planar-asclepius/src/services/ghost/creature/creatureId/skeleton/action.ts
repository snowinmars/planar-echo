import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  creatureId,
  ghostDir,
}: Command): Promise<Result> => {
  const creatureSkeletonFile = join(ghostDir, 'ghost', 'creatures', 'dist', `${creatureId}.js`);
  const found = await fileExists(creatureSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${creatureId}' is not found at '${creatureSkeletonFile}'`,
      },
    };
  };

  const content = await readFile(creatureSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${creatureSkeletonFile}*/\n${content}` },
  };
};
