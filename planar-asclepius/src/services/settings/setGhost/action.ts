import { fileExists } from '@planar/shared/node';
import { setGhostDir } from '../storage.js';

import type { Command, Result } from './types.js';

export default async ({ ghostDir }: Command): Promise<Result> => {
  const found = await fileExists(ghostDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'DIRECTORY_NOT_FOUND',
        status: 404,
        message: `Ghost directory is not found by path '${ghostDir}'`,
      },
    };
  };

  return {
    ok: true,
    data: {
      ghostDir: setGhostDir(ghostDir),
    },
  };
};
