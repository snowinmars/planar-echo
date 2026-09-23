import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  resourceName,
  resourceType,
  ghostDir,
}: Command): Promise<Result> => {
  const file = join(ghostDir, 'ghost', resourceType, 'dist', `${resourceName}.js`);

  const found = await fileExists(file);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${resourceName}' is not found at '${file}'`,
      },
    };
  }

  const content = await readFile(file, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${file}*/\n${content}` },
  };
};
