import { jsonParse, jsonStringify } from '@planar/shared';
import {
  mkdir,
  rm,
  writeFile,
  readFile,
  access,
  constants as fsConstants,
} from 'fs/promises';

import type { Maybe } from '@planar/shared';

export const mkdirsIfNotExists = async (entryPathes: string[], recreate = false): Promise<void> => {
  for (const entryPath of entryPathes) await mkdirIfNotExists(entryPath, recreate);
};

export const mkdirIfNotExists = async (entryPath: string, recreate = false): Promise<void> => {
  const exists = await entryExists(entryPath);
  if (recreate && exists) await rm(entryPath, { recursive: true });
  if (!exists) await mkdir(entryPath, { recursive: true });
};

export const entryExists = async (entryPath: Maybe<string>): Promise<boolean> => {
  if (!entryPath) return false;
  try {
    await access(entryPath, fsConstants.F_OK);
    return true;
  }
  catch {
    return false;
  }
};

export const saveToFile = async (path: string, item: unknown, asIs = false): Promise<void> => {
  await writeFile(path, asIs ? item as string : jsonStringify(item), { encoding: 'utf8' });
};
export const loadFromFile = async <T>(path: string, asIs = false): Promise<T> => {
  const json = await readFile(path, { encoding: 'utf8' });
  return asIs ? json as T : jsonParse(json);
};
