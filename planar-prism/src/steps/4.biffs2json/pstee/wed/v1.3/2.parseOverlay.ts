import { extendMap } from './2.parseOverlay.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawWedOverlay, RawWedTilemap } from './2.parseOverlay.types.js';

type ParseTilemapProps = Readonly<{
  reader: BufferReader;
  tileIndexLookupOffset: number;
}>;
const parseTilemap = ({
  reader,
  tileIndexLookupOffset,
}: ParseTilemapProps): RawWedTilemap => {
  const tileIndexLookupStart = reader.ushort();
  const tileIndexLookupCount = reader.ushort();
  const secondaryTileIndex = reader.ushort();
  const drawOverlays = reader.map.ubyte(extendMap.drawOverlay.parseFlags);
  const animationSpeed = reader.ubyte(); // not in docs, but in NearInfinity
  reader.skip.ubyte();
  reader.skip.ubyte();

  const littleEndian16BitWordSizeInBytes = 2;
  const lookup = reader.fork(tileIndexLookupOffset + tileIndexLookupStart * littleEndian16BitWordSizeInBytes);
  const tileIndices: number[] = [];
  for (let i = 0; i < tileIndexLookupCount; i++) {
    const tileIndex = lookup.ushort();
    tileIndices.push(tileIndex);
  }

  return {
    tileIndexLookupStart,
    tileIndexLookupCount,
    secondaryTileIndex,
    drawOverlays,
    animationSpeed,
    tileIndices,
  };
};

const parseOverlay = (reader: BufferReader): RawWedOverlay => {
  const width = reader.ushort();
  const height = reader.ushort();
  const tileset = reader.string(8);
  const uniqueTileCount = reader.ushort();
  const movementType = reader.ushort();
  const tilemapOffset = reader.uint();
  const tileIndexLookupOffset = reader.uint();

  const tilemaps: RawWedTilemap[] = [];
  const tilemapReader = reader.fork(tilemapOffset);
  const cellCount = width * height;
  for (let i = 0; i < cellCount; i++) {
    const tilemap = parseTilemap({
      reader: tilemapReader,
      tileIndexLookupOffset,
    });
    tilemaps.push(tilemap);
  }

  return {
    width,
    height,
    tileset,
    uniqueTileCount,
    movementType,
    tilemapOffset,
    tileIndexLookupOffset,
    tilemaps,
  };
};

type ParseOverlaysProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseOverlays = ({
  reader,
  count,
}: ParseOverlaysProps): RawWedOverlay[] => {
  const overlays: RawWedOverlay[] = [];

  for (let i = 0; i < count; i++) {
    const overlay = parseOverlay(reader);
    overlays.push(overlay);
  }

  return overlays;
};
