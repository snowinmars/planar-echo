import { join } from 'path';
import { readdir } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import { ghostTypes } from '@planar/shared';

import type {
  Command,
  GhostSearchHit,
  Result,
} from './types.js';
import type { GhostType } from '@planar/shared';

const jsExtensionLength = '.js'.length;
const minQueryLength = 2;
const resultCap = 20;

const skeletonExt = (type: GhostType): string => type === 'twoda' ? '.2da.js' : `.${type}.js`;

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

  const isQueryTooShort = partialName.length < minQueryLength;
  if (isQueryTooShort) {
    return {
      ok: true,
      data: [],
    };
  }

  const data: GhostSearchHit[] = [];

  typeLoop: for (const type of ghostTypes) {
    const concreteGhostDir = join(ghostRoot, type, 'dist');
    const typeFound = await fileExists(concreteGhostDir);
    if (!typeFound) {
      continue;
    }

    const skeletonExtension = skeletonExt(type);
    const filesEntries = await readdir(concreteGhostDir, { encoding: 'utf8', recursive: false, withFileTypes: true });

    for (const x of filesEntries) {
      const isEngine = x.name.startsWith('_');
      const isSkeleton = x.name.endsWith(skeletonExtension);
      const matchFilter = x.name.includes(partialName);
      const isMatch = x.isFile() && !isEngine && isSkeleton && matchFilter;
      if (!isMatch) {
        continue;
      }

      data.push({
        type,
        id: x.name.slice(0, -jsExtensionLength),
      });

      const hasEnoughHits = data.length >= resultCap;
      if (hasEnoughHits) {
        break typeLoop;
      }
    }
  }

  data.sort((a, b) => a.id.localeCompare(b.id));

  return {
    ok: true,
    data,
  };
};
