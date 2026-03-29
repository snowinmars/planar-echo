import { normalize } from 'path';
import { fileExists } from '@planar/shared/node';
import logger from '@/shared/logger.js';
import getVersion from './getVersion.js';

import type { Command, Result } from './types.js';

export default async ({
  weiduExePath,
}: Command): Promise<Result> => {
  const weiduExe = normalize(weiduExePath);

  const weiduExeExists = await fileExists(weiduExe);
  if (!weiduExeExists) return {
    ok: false,
    error: {
      code: 'FILE_NOT_FOUND',
      message: `weidu.exe is not found at: '${weiduExe}'`,
      status: 404,
    },
  };

  try {
    const version = await getVersion({ weiduExe });
    return { ok: true, data: { version } };
  }
  catch (e: unknown) {
    logger.error(e);
    return {
      ok: false,
      error: {
        code: 'WEIDU_ERROR',
        message: `weidu.exe error: '${e?.toString()}'`,
        status: 400,
      },
    };
  }
}; ;
