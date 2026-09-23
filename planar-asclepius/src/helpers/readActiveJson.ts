import { readFile } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import type { ActiveJsonMods, Maybe } from '@planar/shared';

export const readActiveJson = async (path: string): Promise<Maybe<ActiveJsonMods>> => {
  const activeJson = join(path, 'active.json');

  if (!await fileExists(activeJson)) return undefined;

  const raw = await readFile(activeJson, 'utf8');
  return JSON.parse(raw) as ActiveJsonMods;
};
