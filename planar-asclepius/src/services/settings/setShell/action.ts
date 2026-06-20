import { fileExists } from '@planar/shared/node';
import { setShellDir } from '../storage.js';

import type { Command, Result } from './types.js';

export default async ({ shellDir }: Command): Promise<Result> => {
  const found = await fileExists(shellDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'DIRECTORY_NOT_FOUND',
        status: 404,
        message: `Shell directory is not found by path '${shellDir}'`,
      },
    };
  };

  return {
    ok: true,
    data: {
      shellDir: setShellDir(shellDir),
    },
  };
};
