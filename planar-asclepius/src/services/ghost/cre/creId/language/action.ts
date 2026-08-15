import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  creId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedCreFile = join(ghostDir, 'ghost', 'cre', 'dist', `${creId}.${gameLanguage}.js`);
  const found = await fileExists(translatedCreFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${creId}' is not found at '${translatedCreFile}'`,
      },
    };
  };

  const content = await readFile(translatedCreFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedCreFile}*/\n${content}` },
  };
};
