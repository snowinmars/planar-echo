import { join } from 'path';
import { readFile } from 'fs/promises';
import { inflateSync } from 'zlib';
import { isBamV1 } from '@/steps/4.biffs2json/pstee/bam/isBamV1.js';
import { pvrzIndexFromSab } from '@/shared/pool/index.js';
import { encodeRgbaPng } from './algo/encodeRgbaPng.js';
import { blitRgbaFrame, cropAndBlit } from './algo/cropAndBlit.js';
import { decodeBamV1Frames, fixBamPalette } from './algo/decodeBamV1Frames.js';
import { writeAssetFile } from './writeAssetFile.js';

import type { ParseOneProps, ParseOneResult, PackedPvrz, AssetOk } from '@/shared/pool/index.js';
import type { RawBam } from '@/steps/4.biffs2json/pstee/bam/index.js';
import type { RawBamV2 } from '@/steps/4.biffs2json/pstee/bam/v2/parseBamV2.types.js';
import type { RawPvrRgbaImage } from './algo/pvrz/index.js';

const inflateBamcIfNeeded = (raw: Buffer): Buffer => {
  const signature = raw.subarray(0, 4).toString('ascii');
  if (signature === 'bamc') return Buffer.from(inflateSync(raw.subarray(12)));
  return raw;
};

const encodeAtlas = async (
  atlasWidth: number,
  atlasHeight: number,
  frames: Readonly<{ width: number; height: number; atlasX: number; atlasY: number; rgba?: Buffer }>[],
): Promise<Buffer> => {
  if (atlasWidth <= 0 || atlasHeight <= 0) {
    return encodeRgbaPng(1, 1, Buffer.alloc(4, 0));
  }

  const canvas = Buffer.alloc(atlasWidth * atlasHeight * 4, 0);
  for (const frame of frames) {
    if (!frame.rgba) continue;
    blitRgbaFrame({
      canvas,
      canvasWidth: atlasWidth,
      canvasHeight: atlasHeight,
      rgba: frame.rgba,
      width: frame.width,
      height: frame.height,
      atlasX: frame.atlasX,
      atlasY: frame.atlasY,
    });
  }

  return encodeRgbaPng(atlasWidth, atlasHeight, canvas);
};

const renderBamV2Frame = (
  resourceName: string,
  frame: RawBamV2['frames'][number],
  blocks: RawBamV2['blocks'],
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>,
): Buffer => {
  if (frame.width <= 0 || frame.height <= 0) return Buffer.alloc(0);

  const canvas = Buffer.alloc(frame.width * frame.height * 4, 0);
  const end = frame.dataBlockIndex + frame.dataBlockCount;

  for (let i = frame.dataBlockIndex; i < end; i++) {
    const block = blocks[i];
    if (!block) throw new Error(`Missing bam V2 data block '${i}' for resource '${resourceName}'`);

    const image = pvrzRgbaIndex.get(block.pvrzResourceName);
    if (!image) throw new Error(`Missing pvrz '${block.pvrzResourceName}' in BAM '${resourceName}'`);

    cropAndBlit({
      canvas,
      canvasWidth: frame.width,
      canvasHeight: frame.height,
      image,
      sourceX: block.sourceX,
      sourceY: block.sourceY,
      width: block.width,
      height: block.height,
      targetX: block.targetX,
      targetY: block.targetY,
    });
  }

  return canvas;
};

export const writeOneBam = async ({
  resourceName,
  decompiledRoot,
  assetsRoot,
  context,
  payload,
}: ParseOneProps): Promise<ParseOneResult<AssetOk>> => {
  const bam = payload as RawBam;

  if (isBamV1(bam)) {
    const raw = await readFile(join(decompiledRoot, resourceName));
    const src = inflateBamcIfNeeded(raw);
    const paletteBytes = 256 * 4;
    const palette = fixBamPalette(src.subarray(bam.header.paletteOffset, bam.header.paletteOffset + paletteBytes));
    const decoded = decodeBamV1Frames({
      src,
      frames: bam.frames,
      palette,
      rleIndex: bam.header.rleIndex,
    });
    const image = await encodeAtlas(
      bam.atlasWidth,
      bam.atlasHeight,
      bam.frames.map((frame, i) => ({
        width: frame.width,
        height: frame.height,
        atlasX: frame.atlasX,
        atlasY: frame.atlasY,
        rgba: decoded[i]!.rgba,
      })),
    );
    await writeAssetFile(assetsRoot, 'bam', `${resourceName}.png`, image);
    await writeAssetFile(assetsRoot, 'bam', `${resourceName}.palette`, palette);
    await writeAssetFile(assetsRoot, 'bam', `${resourceName}.indices`, Buffer.concat(decoded.map(x => x.indices)));
    return { value: { ok: true } };
  }

  const packed = context as PackedPvrz;
  const pvrzRgbaIndex = pvrzIndexFromSab(packed.sab, packed.table);
  const image = await encodeAtlas(
    bam.atlasWidth,
    bam.atlasHeight,
    bam.frames.map(frame => ({
      width: frame.width,
      height: frame.height,
      atlasX: frame.atlasX,
      atlasY: frame.atlasY,
      rgba: renderBamV2Frame(resourceName, frame, bam.blocks, pvrzRgbaIndex),
    })),
  );
  await writeAssetFile(assetsRoot, 'bam', `${resourceName}.png`, image);
  return { value: { ok: true } };
};
