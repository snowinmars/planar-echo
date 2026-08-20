import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  iniId,
  ghostDir,
}: Command): Promise<Result> => {
  const iniSkeletonFile = join(ghostDir, 'ghost', 'ini', 'dist', `${iniId}.js`);
  const found = await fileExists(iniSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${iniId}' is not found at '${iniSkeletonFile}'`,
      },
    };
  }

  const content = await readFile(iniSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${iniSkeletonFile}*/\n${content}` },
  };
};
