import {
  access,
  constants as fsConstants,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'fs/promises';

import { jsonParse, jsonStringify } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export const mkdirsIfNotExists = async (entryPaths: string[], recreate = false): Promise<void> => {
  for (const entryPath of entryPaths) await mkdirIfNotExists(entryPath, recreate);
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
export const saveBinaryToFile = async (path: string, data: Buffer): Promise<void> => {
  await writeFile(path, data);
};
export const loadFromFile = async <T>(path: string, asIs = false): Promise<T> => {
  const json = await readFile(path, { encoding: 'utf8' });
  return asIs ? json as T : jsonParse(json);
};
