import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import logger from '@/shared/logger.js';

import type { Command, Result, TlkItem } from './types.js';
import type { GameLanguage } from '@planar/shared';

const tlks: Map<GameLanguage, string[]> = new Map<GameLanguage, string[]>();

// this solutions consumes ~5 700 000 bytes, but makes my life really shine
// in theory, there is a bug here: if load this cache from ghostDir1
//   and request it from ghostDir2, then it will return data from the loaded ghostDir1
// But it is ok for me right now
const loadTlk = async (tlkFile: string): Promise<string[]> => {
  const content = await readFile(tlkFile, { encoding: 'utf-8' });
  const tlkObject = JSON.parse(content) as Record<string, string>;

  // in original keys are sorted, but who knows, also there are non-number props in the json
  const keys = Object.keys(tlkObject)
    .map((x) => {
      const v = parseInt(x);
      return isNaN(v) ? -1 : v; // TODO [snow]: -1 is a hack
    })
    .sort((l, r) => l - r);

  const maxKey = keys[keys.length - 1]!;
  const tlk = Array<string>(maxKey);

  for (let i = 0; i <= maxKey; i++) {
    const value = tlkObject[i];
    const hasText = value && value !== '<NO TEXT>' && value !== 'n/a';
    if (hasText) tlk[i] = value;
  }

  return tlk;
};

export default async ({
  tlkRefs,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const tlkFile = join(ghostDir, 'ghost', 'tlk', `${gameLanguage}.json`);
  const found = await fileExists(tlkFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Tlk file for language '${gameLanguage}' is not found at '${tlkFile}'`,
      },
    };
  };

  const hasTlk = tlks.has(gameLanguage);
  if (!hasTlk) {
    const tlk = await loadTlk(tlkFile);
    if (!tlk) return {
      ok: false,
      error: {
        code: 'TLK_NOT_FOUND',
        status: 404,
        message: `Tlk file for language '${gameLanguage}' cannot be loaded from '${tlkFile}'`,
      },
    };

    logger.info(`Load '${tlk.length}' tlk items for language '${gameLanguage}'`);
    tlks.set(gameLanguage, tlk);
  }

  const tlk = tlks.get(gameLanguage)!;

  const page = Array<TlkItem>(tlkRefs.length);

  for (let i = 0; i < tlkRefs.length; i++) {
    const tlkRef = tlkRefs[i]!;
    const line = tlk[tlkRef]!;

    if (!line) return {
      ok: false,
      error: {
        code: 'TLK_REF_NOT_FOUND',
        status: 404,
        message: `Tlk '${tlkRef}' for language '${gameLanguage}' is not in '${tlkFile}'`,
      },
    };

    page[i] = {
      ref: tlkRef,
      line,
    };
  }

  return {
    ok: true,
    data: { content: page },
  };
};
