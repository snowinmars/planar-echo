import { join } from 'path';

import { nothing } from '@planar/shared';
import { execConsole } from '@planar/shared/node';

import { forceInstallMods } from '@/helpers/forceInstallMods.js';

import type { Result } from './types.js';

const yarnFile = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

export const installDefaults = async (from: string, to: string): Promise<Result> => {
  try {
    await execConsole(
      {
        file: yarnFile,
        args: ['build'],
        cwd: join(from, '..'), // mods/dist/.. = mods/
      },
      () => nothing(),
      true,
    );
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    return {
      ok: false,
      error: {
        code: 'BUILD_FAILED',
        message,
        status: 500,
      } };
  }

  const data = await forceInstallMods(from, to);

  return { ok: true, data };
};
