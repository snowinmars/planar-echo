import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  acmId,
  ghostDir,
}: Command): Promise<Result> => {
  const acmSkeletonFile = join(ghostDir, 'ghost', 'acm', 'dist', `${acmId}.js`);
  const found = await fileExists(acmSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${acmId}' is not found at '${acmSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(acmSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${acmSkeletonFile}*/\n${content}` },
  };
};
