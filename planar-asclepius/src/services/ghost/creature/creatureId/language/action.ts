import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  creatureId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedCreatureDir = join(ghostDir, 'ghost', 'creatures', 'dist', `${creatureId}.${gameLanguage}.js`);
  const found = await fileExists(translatedCreatureDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${creatureId}' is not found at '${translatedCreatureDir}'`,
      },
    };
  };

  const content = await readFile(translatedCreatureDir, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedCreatureDir}*/\n${content}` },
  };
};
