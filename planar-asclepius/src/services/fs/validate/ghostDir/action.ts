import { normalize } from 'path';
import { fileExists } from '@planar/shared/node';
import { readdir } from 'fs/promises';

import type { Command, Result } from './types.js';

function isDirectoryEmpty(path: string) {
  return readdir(path).then((files) => {
    return files.length === 0;
  });
}

export default async ({
  ghostDir,
}: Command): Promise<Result> => {
  const ghost = normalize(ghostDir);

  const weiduExeExists = await fileExists(ghost);
  if (!weiduExeExists) return {
    ok: false,
    error: {
      code: 'DIRECTORY_NOT_FOUND',
      message: `Ghost directory is not found at: '${ghost}'`,
      status: 404,
    },
  };

  const isEmpty = await isDirectoryEmpty(ghost);
  if (!isEmpty) return {
    ok: false,
    error: {
      code: 'DIRECTORY_NOT_EMPTY',
      message: `Ghost directory should be empty: '${ghost}'`,
      status: 406,
    },
  };

  return { ok: true };
};
