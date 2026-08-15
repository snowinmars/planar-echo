import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  dlgId,
  ghostDir,
}: Command): Promise<Result> => {
  const dlgSkeletonFile = join(ghostDir, 'ghost', 'dlg', 'dist', `${dlgId}.js`);
  const found = await fileExists(dlgSkeletonFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${dlgId}' is not found at '${dlgSkeletonFile}'`,
      },
    };
  };

  const content = await readFile(dlgSkeletonFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${dlgSkeletonFile}*/\n${content}` },
  };
};
