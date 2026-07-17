import { fileExists } from '@planar/shared/node';
import { setPrismDir } from '../storage.js';

import type { Command, Result } from './types.js';

export default async ({ prismDir }: Command): Promise<Result> => {
  const found = await fileExists(prismDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'DIRECTORY_NOT_FOUND',
        status: 404,
        message: `Prism directory is not found by path '${prismDir}'`,
      },
    };
  };

  return {
    ok: true,
    data: {
      prismDir: setPrismDir(prismDir),
    },
  };
};
