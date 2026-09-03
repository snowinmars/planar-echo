import type { Maybe } from '@planar/shared';

import type { RawBmpV5Header } from './parsers/1.parseHeader.types.js';

export type RawBmpV5PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entries: number;
  colorKey: 'green';
}>;

export type RawBmpV5IndicesLayout = Readonly<{
  format: 'uint8-index';
  width: number;
  height: number;
}>;

export type RawBmpV5 = Readonly<{
  resourceName: string;
  header: RawBmpV5Header;
  imageName: string;
  paletteLayout?: Maybe<RawBmpV5PaletteLayout>;
  indicesLayout?: Maybe<RawBmpV5IndicesLayout>;
}>;

export type RawBmpV5Artifacts = Readonly<{
  bmp: RawBmpV5;
  image: Buffer;
  palette?: Maybe<Buffer>;
  indices?: Maybe<Buffer>;
}>;
