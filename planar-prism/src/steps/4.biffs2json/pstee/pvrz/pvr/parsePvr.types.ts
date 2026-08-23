import type { RawPvrPixelFormat } from '../parsePvrzs.types.js';

export const PVR_SIGNATURE = 0x03525650 as const;

export type RawPvr = Readonly<{
  resourceName: string;
  signature: typeof PVR_SIGNATURE;
  flags: 0 | 1;
  pixelFormat: RawPvrPixelFormat;
  colorSpace: 0 | 1;
  channelType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  height: number;
  width: number;
  depth: number;
  numSurfaces: number;
  numFaces: number;
  mipmapCount: number;
  metadataSize: number;
  pixelDataOffset: number;
}>;
