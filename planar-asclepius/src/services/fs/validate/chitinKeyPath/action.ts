import { dirname, normalize, basename } from 'path';
import { fileExists } from '@planar/shared/node';
import listBiffs from './listBiffs.js';

import type { Command, Result } from './types.js';

export default async ({
  weiduExePath,
  chitinKeyPath,
  gameLanguage,
}: Command): Promise<Result> => {
  const weiduExe = normalize(weiduExePath);
  const chitinKey = normalize(chitinKeyPath);

  // TODO [snow]: if user enter chitin.key instead of weidu.exe, it ignores it. Should I validate it?

  const chitinKeyExists = await fileExists(chitinKey);
  if (!chitinKeyExists) return {
    ok: false,
    error: {
      code: 'FILE_NOT_FOUND',
      message: `CHITIN.key is not found at: ${chitinKey}`,
      status: 404,
    },
  };

  const correctName = basename(chitinKey).toLowerCase() === 'chitin.key';
  if (!correctName) return {
    ok: false,
    error: {
      code: 'FILE_NOT_FOUND',
      message: `CHITIN.key is not found at: ${chitinKey}`,
      status: 404,
    },
  };

  const gameFolder = dirname(chitinKey);
  const biffs = await listBiffs({ weiduExe, gameFolder, gameLanguage });
  if (!biffs.length) return {
    ok: false,
    error: {
      code: 'NO_BIFFS',
      message: `No biff files found in ${gameFolder}`,
      status: 404,
    },
  };

  return { ok: true, data: { biffsCount: biffs.length } };
}; ;
