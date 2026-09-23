import { readdir } from 'fs/promises';
import { join } from 'path';

import { ghostTypes } from '@planar/shared';
import { fileExists } from '@planar/shared/node';

import { skeletonExt } from '@/services/ghost/skeletonExt.js';

import type {
  Command,
  GhostSearchHit,
  Result,
} from './types.js';

const jsExtensionLength = '.js'.length;
const minQueryLength = 2;
const resultCap = 20;

export default async ({ ghostDir, partialName }: Command): Promise<Result> => {
  const ghostRoot = join(ghostDir, 'ghost');

  const found = await fileExists(ghostRoot);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'DIRECTORY_NOT_FOUND',
        status: 404,
        message: `Ghost directory is not found by path '${ghostRoot}'`,
      },
    };
  }

  const isQueryTooShort = partialName && partialName.length < minQueryLength;
  if (isQueryTooShort) {
    return {
      ok: true,
      data: [],
    };
  }

  const data: GhostSearchHit[] = [];

  mainLoop: for (const type of ghostTypes) {
    const concreteGhostDir = join(ghostRoot, type, 'dist');
    const typeFound = await fileExists(concreteGhostDir);
    if (!typeFound) continue;

    const skeletonExtension = skeletonExt(type);
    const filesEntries = await readdir(concreteGhostDir, { encoding: 'utf8', recursive: false, withFileTypes: true });

    for (const x of filesEntries) {
      const isEngine = x.name.startsWith('_');
      const isSkeleton = x.name.endsWith(skeletonExtension);
      const matchFilter = partialName ? x.name.includes(partialName) : true;
      const isMatch = x.isFile() && !isEngine && isSkeleton && matchFilter;
      if (!isMatch) continue;

      data.push({
        type,
        id: x.name.slice(0, -jsExtensionLength),
      });

      const hasEnoughHits = data.length >= resultCap;
      if (hasEnoughHits) break mainLoop;
    }
  }

  return {
    ok: true,
    data: data.sort((a, b) => a.id.localeCompare(b.id)),
  };
};
