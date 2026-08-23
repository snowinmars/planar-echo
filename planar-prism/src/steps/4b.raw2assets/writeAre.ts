import { join } from 'path';
import { readFile } from 'fs/promises';
import { writeAssetFile } from './writeAssetFile.js';

import type { ParseOneProps, ParseOneResult, AssetOk } from '@/shared/pool/index.js';
import type { RawAre } from '@/steps/4.biffs2json/pstee/are/index.js';

export const writeOneAre = async ({
  resourceName,
  decompiledRoot,
  assetsRoot,
  payload,
}: ParseOneProps): Promise<ParseOneResult<AssetOk>> => {
  const are = payload as RawAre;
  const size = are.header.exploredBitmaskSize;
  if (size === 0) return { value: { ok: true } };

  const buffer = await readFile(join(decompiledRoot, resourceName));
  const start = are.header.exploredBitmaskOffset;
  const explored = buffer.subarray(start, start + size);
  await writeAssetFile(assetsRoot, 'are', `${resourceName}.explored`, explored);
  return { value: { ok: true } };
};
