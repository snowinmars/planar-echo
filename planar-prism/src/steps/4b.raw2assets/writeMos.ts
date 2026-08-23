import { join } from 'path';
import { readFile } from 'fs/promises';
import { isMosV1 } from '@/steps/4.biffs2json/pstee/mos/isMosV1.js';
import { pvrzIndexFromSab } from '@/shared/pool/index.js';
import { encodeRgbaPng } from './algo/encodeRgbaPng.js';
import { cropAndBlit } from './algo/cropAndBlit.js';
import { renderMosV1Png } from './algo/renderMosV1.js';
import { writeAssetFile } from './writeAssetFile.js';

import type { ParseOneProps, ParseOneResult, PackedPvrz, AssetOk } from '@/shared/pool/index.js';
import type { RawMos } from '@/steps/4.biffs2json/pstee/mos/index.js';

export const writeOneMos = async ({
  resourceName,
  decompiledRoot,
  assetsRoot,
  context,
  payload,
}: ParseOneProps): Promise<ParseOneResult<AssetOk>> => {
  const mos = payload as RawMos;

  if (isMosV1(mos)) {
    const buffer = await readFile(join(decompiledRoot, resourceName));
    const stride = mos.paletteLayout.blockStride;
    const paletteEnd = mos.header.paletteOffset + mos.paletteLayout.blocksCount * stride;
    const palette = buffer.subarray(mos.header.paletteOffset, paletteEnd);
    const indicesChunks = mos.blocks.map((block) =>
      buffer.subarray(block.pixelDataOffset, block.pixelDataOffset + block.width * block.height),
    );
    const image = await renderMosV1Png({
      width: mos.header.width,
      height: mos.header.height,
      palette,
      paletteBlockStride: stride,
      blocks: mos.blocks,
      indicesChunks,
    });
    await writeAssetFile(assetsRoot, 'mos', `${resourceName}.png`, image);
    await writeAssetFile(assetsRoot, 'mos', `${resourceName}.palette`, palette);
    await writeAssetFile(assetsRoot, 'mos', `${resourceName}.indices`, Buffer.concat(indicesChunks));
    return { value: { ok: true } };
  }

  const packed = context as PackedPvrz;
  const pvrzRgbaIndex = pvrzIndexFromSab(packed.sab, packed.table);
  const canvas = Buffer.alloc(mos.header.width * mos.header.height * 4, 0);

  for (const block of mos.blocks) {
    const image = pvrzRgbaIndex.get(block.pvrzResourceName);
    if (!image) throw new Error(`Missing PVRZ '${block.pvrzResourceName}' in mos '${resourceName}'`);
    cropAndBlit({
      canvas,
      canvasWidth: mos.header.width,
      canvasHeight: mos.header.height,
      image,
      sourceX: block.sourceX,
      sourceY: block.sourceY,
      width: block.width,
      height: block.height,
      targetX: block.targetX,
      targetY: block.targetY,
    });
  }

  await writeAssetFile(
    assetsRoot,
    'mos',
    `${resourceName}.png`,
    await encodeRgbaPng(mos.header.width, mos.header.height, canvas),
  );
  return { value: { ok: true } };
};
