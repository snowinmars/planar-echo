import type { Maybe } from '../maybe.js';

export type GhostBmpBitsPerPixel = 1 | 4 | 8 | 16 | 24 | 32;
export type GhostBmpCompression = 'bi_rgb' | 'bi_rle8' | 'bi_rle4' | 'bi_bitfields';

export type GhostBmpV1Header = Readonly<{
  signature: 'bm';
  version: 'v1';
  fileSize: number;
  rasterDataOffset: number;
  infoHeaderSize: number;
  width: number;
  height: number;
  topDown: boolean;
  planesCount: number;
  bitsPerPixel: GhostBmpBitsPerPixel;
  compression: GhostBmpCompression;
  imageSize: number;
  horizontalResolution: number;
  verticalResolution: number;
  usedColors: number;
  importantColors: number;
}>;

export type GhostBmpV5Header = Readonly<{
  signature: 'bm';
  version: 'v5';
  fileSize: number;
  rasterDataOffset: number;
  infoHeaderSize: number;
  width: number;
  height: number;
  topDown: boolean;
  planesCount: number;
  bitsPerPixel: GhostBmpBitsPerPixel;
  compression: GhostBmpCompression;
  horizontalResolution: number;
  verticalResolution: number;
  imageSize: number;
  usedColors: number;
  importantColors: number;
  redMask: number;
  greenMask: number;
  blueMask: number;
  alphaMask: number;
  colorSpaceType: number;
  redX: number;
  redY: number;
  redZ: number;
  greenX: number;
  greenY: number;
  greenZ: number;
  blueX: number;
  blueY: number;
  blueZ: number;
  gammaRed: number;
  gammaGreen: number;
  gammaBlue: number;
  intent: number;
  profileData: number;
  profileSize: number;
}>;

export type GhostBmpPaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entries: number;
  colorKey: 'green';
}>;

export type GhostBmpIndicesLayout = Readonly<{
  format: 'uint8-index';
  width: number;
  height: number;
}>;

export type GhostBmpV1 = Readonly<{
  resourceName: string;
  header: GhostBmpV1Header;
  imageName: string;
  paletteLayout?: Maybe<GhostBmpPaletteLayout>;
  indicesLayout?: Maybe<GhostBmpIndicesLayout>;
}>;

export type GhostBmpV5 = Readonly<{
  resourceName: string;
  header: GhostBmpV5Header;
  imageName: string;
  paletteLayout?: Maybe<GhostBmpPaletteLayout>;
  indicesLayout?: Maybe<GhostBmpIndicesLayout>;
}>;

export type GhostBmp = GhostBmpV1 | GhostBmpV5;
