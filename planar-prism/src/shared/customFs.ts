import { jsonParse, jsonStringify } from './json.js';
import {
  mkdir,
  rm,
  writeFile,
  readFile,
  access,
  constants as fsConstants,
} from 'fs/promises';

import type { Maybe } from './maybe.js';

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

export const saveToFile = async (path: string, item: unknown): Promise<void> => {
  await writeFile(path, jsonStringify(item), { encoding: 'utf8' });
};
export const loadFromFile = async <T>(path: string): Promise<T> => {
  const json = await readFile(path, { encoding: 'utf8' });
  return jsonParse(json);
};
