import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  twodaId,
  ghostDir,
}: Command): Promise<Result> => {
  const twodaSkeletonFile = join(ghostDir, 'ghost', 'twoda', 'dist', `${twodaId}.js`);
  const found = await fileExists(twodaSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${twodaId}' is not found at '${twodaSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(twodaSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${twodaSkeletonFile}*/\n${content}` },
  };
};
