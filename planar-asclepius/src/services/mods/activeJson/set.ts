import { previewActiveJson } from '@/helpers/previewActiveJson.js';
import { writeActiveJson } from '@/helpers/writeActiveJson.js';

import type { ActiveJsonMods } from '@planar/shared';

import type { Result } from './set.types.js';

export default async (path: string, activeJson: ActiveJsonMods): Promise<Result> => {
  const errors = await previewActiveJson(path, activeJson);

  const invalid = errors.length > 0;
  if (invalid) return { ok: false, errors };

  await writeActiveJson(path, activeJson);

  return { ok: true };
};
