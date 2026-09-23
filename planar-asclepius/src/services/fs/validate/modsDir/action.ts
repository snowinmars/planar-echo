import { normalize } from 'path';

import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

export default async ({
  modsDir,
}: Command): Promise<Result> => {
  const mods = normalize(modsDir);

  const modsExists = await fileExists(mods);

  if (!modsExists) return {
    ok: false,
    error: {
      code: 'DIRECTORY_NOT_FOUND',
      message: `Mods directory is not found at: '${mods}'`,
      status: 404,
    },
  };

  return { ok: true };
};
