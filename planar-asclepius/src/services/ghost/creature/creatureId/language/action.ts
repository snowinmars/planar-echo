import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  creatureId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedCreatureFile = join(ghostDir, 'ghost', 'creatures', 'dist', `${creatureId}.${gameLanguage}.js`);
  const found = await fileExists(translatedCreatureFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${creatureId}' is not found at '${translatedCreatureFile}'`,
      },
    };
  };

  const content = await readFile(translatedCreatureFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedCreatureFile}*/\n${content}` },
  };
};
