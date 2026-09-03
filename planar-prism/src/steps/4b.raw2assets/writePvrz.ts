import { readFile } from 'fs/promises';
import { join } from 'path';
import { inflateSync } from 'zlib';

import { bufferForTransfer } from '@/shared/pool/index.js';

import { decodePvrToRgba } from './algo/pvrz/index.js';

import type { ParseOneProps, ParseOneResult } from '@/shared/pool/index.js';
import type { RawPvr } from '@/steps/4.biffs2json/pstee/pvrz/index.js';

export type PvrzAssetResult = Readonly<{
  ok: true;
  resourceName: string;
  width: number;
  height: number;
  data: Buffer;
}>;

export const writeOnePvrz = async ({
  resourceName,
  decompiledRoot,
  payload,
}: ParseOneProps): Promise<ParseOneResult<PvrzAssetResult>> => {
  const pvr = payload as RawPvr;
  const buffer = await readFile(join(decompiledRoot, resourceName));
  const inflated = Buffer.from(inflateSync(buffer.subarray(4)));
  const pixelData = inflated.subarray(pvr.pixelDataOffset);
  const rgba = decodePvrToRgba(pvr, pixelData);
  const pixels = bufferForTransfer(rgba.data);

  return {
    value: {
      ok: true,
      resourceName,
      width: rgba.width,
      height: rgba.height,
      data: pixels.buf,
    },
    transfer: [pixels.transfer],
  };
};
