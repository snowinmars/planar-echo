import { readdir } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import { skeletonExt } from '@/services/ghost/skeletonExt.js';

import type { Command, Result } from './types.js';

const jsExtensionLength = '.js'.length;

export default async ({ ghostDir, resourceType, partialName }: Command): Promise<Result> => {
  const dist = join(ghostDir, 'ghost', resourceType, 'dist');

  const found = await fileExists(dist);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'DIRECTORY_NOT_FOUND',
        status: 404,
        message: `Available ${resourceType} are not found by path '${dist}'`,
      },
    };
  }

  const filesEntries = await readdir(dist, { encoding: 'utf8', recursive: false, withFileTypes: true });
  const skeletonExtension = skeletonExt(resourceType);

  const files = filesEntries
    .filter((x) => {
      const isEngine = x.name.startsWith('_');
      const isSkeleton = x.name.endsWith(skeletonExtension);
      const matchFilter = partialName ? x.name.includes(partialName) : true;
      return x.isFile() && !isEngine && isSkeleton && matchFilter;
    })
    .map(x => x.name.slice(0, -jsExtensionLength));

  return {
    ok: true,
    data: files,
  };
};
