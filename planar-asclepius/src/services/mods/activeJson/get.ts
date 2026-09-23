import { readActiveJson } from '@/helpers/readActiveJson.js';

import type { Result } from './get.types.js';

export default async (path: string): Promise<Result> => {
  const activeJson = await readActiveJson(path);

  if (!activeJson) {
    return {
      ok: false,
      error: { code: 'NOT_FOUND', status: 404, message: 'active.json is missing' },
    };
  }

  return {
    ok: true,
    data: activeJson,
  };
};
