import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  mosId,
  ghostDir,
}: Command): Promise<Result> => {
  const mosSkeletonFile = join(ghostDir, 'ghost', 'mos', 'dist', `${mosId}.js`);
  const found = await fileExists(mosSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${mosId}' is not found at '${mosSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(mosSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${mosSkeletonFile}*/\n${content}` },
  };
};
