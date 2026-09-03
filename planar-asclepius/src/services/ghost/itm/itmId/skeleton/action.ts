import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  itmId,
  ghostDir,
}: Command): Promise<Result> => {
  const itmSkeletonFile = join(ghostDir, 'ghost', 'itm', 'dist', `${itmId}.js`);
  const found = await fileExists(itmSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${itmId}' is not found at '${itmSkeletonFile}'`,
      },
    };
  };

  const content = await readFile(itmSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${itmSkeletonFile}*/\n${content}` },
  };
};
