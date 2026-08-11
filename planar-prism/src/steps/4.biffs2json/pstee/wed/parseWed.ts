import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseWedV13 } from './v1.3/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Wed } from './types.js';

export const parseWed = (
  paths: Paths,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<Wed> => iterate<DecompiledBiff, Wed>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'wed') throw new Error(`Unsupported signature '${signature}' for wed resource '${resourceName}'`);
    if (version !== 'v1.3') throw new Error(`Not implemented '${version}' for resource '${resourceName}'`);

    const wed = parseWedV13({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'wed_raw2json',
      params: {
        version,
        resourceName,
      },
    });

    return wed;
  },
);

export const findWedForTis = (
  wedIndex: Map<string, Wed>,
  tisResourceName: string,
  tileCount: number,
): Wed | undefined => {
  const wedResourceName = tisResourceName.replace('tis', 'wed');
  const sameName = wedIndex.get(wedResourceName);
  if (sameName) {
    const overlay0 = sameName.overlays[0];
    if (overlay0 && tileCount >= overlay0.width * overlay0.height) return sameName;
  }

  for (const wed of wedIndex.values()) {
    const overlay0 = wed.overlays[0];
    if (!overlay0) continue;
    if (overlay0.tileset !== wedResourceName) continue;
    if (tileCount >= overlay0.width * overlay0.height) return wed;
  }

  return undefined;
};
