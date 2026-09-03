import { existsSync, statSync } from 'fs';
import { join, resolve } from 'path';

import { getGhostDir } from '../../settings/storage.js';

import type { Command, Result } from './types.js';

export default ({ path }: Command): Promise<Result> => {
  const ghostDir = getGhostDir();
  const assetsRoot = resolve(join(ghostDir, 'assets'));

  const fullPath = resolve(join(assetsRoot, path));
  if (!fullPath.startsWith(assetsRoot)) {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'DIRECTORY_TRAVERSE',
        message: `Prevent attempt to traverse directory '${assetsRoot}' using '${path}'`,
        status: 403,
      },
    });
  }

  if (existsSync(fullPath) && statSync(fullPath).isFile()) return Promise.resolve({
    ok: true,
    data: {
      fullPath,
    },
  });

  return Promise.resolve({
    ok: false,
    error: {
      code: 'FILE_NOT_FOUND',
      message: `File was not found in assets by path '${path}'`,
      status: 404,
    },
  });
};
