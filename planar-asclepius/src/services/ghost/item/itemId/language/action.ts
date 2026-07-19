import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  itemId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedItemFile = join(ghostDir, 'ghost', 'items', 'dist', `${itemId}.${gameLanguage}.js`);
  const found = await fileExists(translatedItemFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${itemId}' is not found at '${translatedItemFile}'`,
      },
    };
  };

  const content = await readFile(translatedItemFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedItemFile}*/\n${content}` },
  };
};
