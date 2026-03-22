import { dirname, normalize } from 'path';
import fileExists from '../../../../shared/fileExists';
import listBiffs from './listBiffs';

import type { Command, Result } from './types';

export default async ({
  weiduExePath,
  chitinKeyPath,
  lang,
}: Command): Promise<Result> => {
  const weiduExe = normalize(weiduExePath);
  const chitinKey = normalize(chitinKeyPath);

  const chitinKeyExists = await fileExists(chitinKey);
  if (!chitinKeyExists) return {
    ok: false,
    error: {
      code: 'FILE_NOT_FOUND',
      message: `CHITIN.key is not found at: ${chitinKey}`,
      status: 404,
    },
  };

  const gameFolder = dirname(chitinKey);
  const biffs = await listBiffs({ weiduExe, gameFolder, lang });
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
