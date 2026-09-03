import { spawn } from 'child_process';
import { stat } from 'fs/promises';
import { normalize } from 'path';

import logger from '@/shared/logger.js';

import type { Command, Result } from './types.js';

const opener = (): { cmd: string; args: (dir: string) => string[] } => {
  if (process.platform === 'win32') return { cmd: 'explorer', args: dir => [dir] };
  if (process.platform === 'darwin') return { cmd: 'open', args: dir => [dir] };
  return { cmd: 'xdg-open', args: dir => [dir] };
};

const spawnOpener = (dir: string): Promise<void> => {
  const { cmd, args } = opener();

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args(dir), { detached: true, stdio: 'ignore' });
    child.once('error', reject);
    child.once('spawn', () => {
      child.unref();
      resolve();
    });
  });
};

export default async ({
  dir,
}: Command): Promise<Result> => {
  const normalized = normalize(dir);

  try {
    const fileStat = await stat(normalized);
    if (!fileStat.isDirectory()) {
      return {
        ok: false,
        error: {
          code: 'NOT_A_DIRECTORY',
          message: `Not a directory: '${normalized}'`,
          status: 400,
        },
      };
    }
  }
  catch (e: unknown) {
    const code = e && typeof e === 'object' && 'code' in e ? e.code : undefined;
    if (code === 'ENOENT') {
      return {
        ok: false,
        error: {
          code: 'DIRECTORY_NOT_FOUND',
          message: `Directory is not found at: '${normalized}'`,
          status: 404,
        },
      };
    }
    logger.error(e);
    return {
      ok: false,
      error: {
        code: 'OPEN_FAILED',
        message: `Failed to stat directory: '${e?.toString()}'`,
        status: 500,
      },
    };
  }

  try {
    await spawnOpener(normalized);
    return { ok: true };
  }
  catch (e: unknown) {
    logger.error(e);
    return {
      ok: false,
      error: {
        code: 'OPEN_FAILED',
        message: `Failed to open directory: '${e?.toString()}'`,
        status: 500,
      },
    };
  }
};
