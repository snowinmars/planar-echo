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
  ghostPath,
}: Command): Promise<Result> => {
  const ghost = normalize(ghostPath);

  const weiduExeExists = await fileExists(ghost);
  if (!weiduExeExists) return {
    ok: false,
    error: {
      code: 'DIRECTORY_NOT_FOUND',
      message: `Ghost folder is not found at: '${ghost}'`,
      status: 404,
    },
  };

  const isEmpty = await isDirectoryEmpty(ghost);
  if (!isEmpty) return {
    ok: false,
    error: {
      code: 'DIRECTORY_NOT_EMPTY',
      message: `Ghost folder should be empty: '${ghost}'`,
      status: 406,
    },
  };

  return { ok: true };
}; ;
