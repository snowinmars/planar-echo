import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  itemId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedItemDir = join(ghostDir, 'ghost', 'items', 'dist', `${itemId}.${gameLanguage}.js`);
  const found = await fileExists(translatedItemDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${itemId}' is not found at '${translatedItemDir}'`,
      },
    };
  };

  const content = await readFile(translatedItemDir, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedItemDir}*/\n${content}` },
  };
};
