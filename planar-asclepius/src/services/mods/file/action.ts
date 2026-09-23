import { existsSync, statSync } from 'fs';
import { join, resolve } from 'path';

import type { Command, Result } from './types.js';

export default ({ path, modsRuntimeDir }: Command): Promise<Result> => {
  const parts = path.replace(/^[\\/]/u, '').split(/[\\/]/u).filter(Boolean);

  const last = parts[parts.length - 1];
  const allowed = last === 'client.js' || last === 'mod.json';

  if (!allowed) {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'FORBIDDEN_FILE',
        message: `Refused to serve '${path}'`,
        status: 403,
      },
    });
  }

  const fullPath = resolve(join(modsRuntimeDir, ...parts));

  const traversal = !fullPath.startsWith(resolve(modsRuntimeDir));
  if (traversal) {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'DIRECTORY_TRAVERSE',
        message: `Prevent attempt to traverse directory '${modsRuntimeDir}' using '${path}'`,
        status: 403,
      },
    });
  }

  const found = existsSync(fullPath) && statSync(fullPath).isFile();
  if (!found)
    return Promise.resolve({
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        message: `File was not found in modsDir by path '${path}'`,
        status: 404,
      },
    });

  return Promise.resolve({
    ok: true,
    data: {
      fullPath,
    },
  });
};
