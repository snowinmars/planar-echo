import { getPrismDir } from '../../settings/storage.js';
import { join, resolve } from 'path';
import { existsSync, statSync } from 'fs';

import type { Command, Result } from './types.js';

export default ({ path }: Command): Promise<Result> => {
  const prismDir = getPrismDir();

  const fullPath = resolve(join(prismDir, path));
  if (!fullPath.startsWith(prismDir)) {
    // this if should never fire, but I want to double check for now
    return Promise.resolve({
      ok: false,
      error: {
        code: 'DIRECTORY_TRAVERSE',
        message: `Prevent attempt to traverse directory '${prismDir}' using '${path}'`,
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
      message: `File was not found in prismDir by path '${path}'`,
      status: 404,
    },
  });
};
