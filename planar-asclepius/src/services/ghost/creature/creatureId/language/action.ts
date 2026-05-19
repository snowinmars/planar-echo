import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  creatureId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedCreaturePath = join(ghostDir, 'ghost', 'creatures', 'dist', `${creatureId}.cre.${gameLanguage}.js`);
  const found = await fileExists(translatedCreaturePath);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${creatureId}' is not found at '${translatedCreaturePath}'`,
      },
    };
  };

  const content = await readFile(translatedCreaturePath, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedCreaturePath}*/\n${content}` },
  };
};
