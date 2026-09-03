import type { Maybe } from '@planar/shared';

import type { RawBmpV1Header } from './parsers/1.parseHeader.types.js';

export type RawBmpV1PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entries: number;
  colorKey: 'green';
}>;

export type RawBmpV1IndicesLayout = Readonly<{
  format: 'uint8-index';
  width: number;
  height: number;
}>;

export type RawBmpV1 = Readonly<{
  resourceName: string;
  header: RawBmpV1Header;
  imageName: string;
  paletteLayout?: Maybe<RawBmpV1PaletteLayout>;
  indicesLayout?: Maybe<RawBmpV1IndicesLayout>;
}>;

export type RawBmpV1Artifacts = Readonly<{
  bmp: RawBmpV1;
  image: Buffer;
  palette?: Maybe<Buffer>;
  indices?: Maybe<Buffer>;
}>;
