import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  idsId,
  ghostDir,
}: Command): Promise<Result> => {
  const idsSkeletonFile = join(ghostDir, 'ghost', 'ids', 'dist', `${idsId}.js`);
  const found = await fileExists(idsSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${idsId}' is not found at '${idsSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(idsSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${idsSkeletonFile}*/\n${content}` },
  };
};
