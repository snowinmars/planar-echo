import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  itmId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedItmFile = join(ghostDir, 'ghost', 'itm', 'dist', `${itmId}.${gameLanguage}.js`);
  const found = await fileExists(translatedItmFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${itmId}' is not found at '${translatedItmFile}'`,
      },
    };
  };

  const content = await readFile(translatedItmFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedItmFile}*/\n${content}` },
  };
};
