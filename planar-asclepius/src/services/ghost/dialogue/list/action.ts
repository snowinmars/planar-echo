import { join } from 'path';
import { readdir } from 'fs/promises';
import { fileExists } from '@planar/shared/node';

import type { Command, Result } from './types.js';

const skeletonExtention = '.dlg.js';
const skeletonExtensionLength = skeletonExtention.length;
export default async ({ ghostDir, partialName }: Command): Promise<Result> => {
  const ghostPath = join(ghostDir, 'ghost', 'dialogues', 'dist');
  const found = await fileExists(ghostPath);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'DIRECTORY_NOT_FOUND',
        status: 404,
        message: `Available dialogues are not found by path '${ghostPath}'`,
      },
    };
  };

  const filesEntries = await readdir(ghostPath, { encoding: 'utf8', recursive: false, withFileTypes: true });

  const files = filesEntries
    .filter((x) => {
      const isEngine = x.name.startsWith('_');
      const isSkeleton = x.name.endsWith(skeletonExtention);
      const matchFilter = partialName ? x.name.includes(partialName) : true;
      return x.isFile() && !isEngine && isSkeleton && matchFilter;
    })
    .map(x => x.name.slice(0, -skeletonExtensionLength));

  return {
    ok: true,
    data: files,
  };
};
