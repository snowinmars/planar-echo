import { fileExists } from '@planar/shared/node';

import { readModsManifests } from '@/helpers/readModsManifests.js';

import type { Result } from './types.js';

export default async (path: string): Promise<Result> => {
  const found = await fileExists(path);
  if (!found) return {
    ok: false,
    error: {
      code: 'DIRECTORY_NOT_FOUND',
      status: 404,
      message: `Mods directory '${path}' not found`,
    },
  };

  const manifests = await readModsManifests(path);

  return {
    ok: true,
    data: {
      manifests,
    },
  };
};
