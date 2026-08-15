import type { Maybe } from '@planar/shared';
import type { RawTisAtlasWidthSource } from '../../parseTiss.types.js';
import type { RawTisHeader } from '../1.parseHeader.types.js';

export type RawTisPvrzParseResult = Readonly<{
  tis: RawTisPvrz;
  png: Buffer;
}>;

export type RawTisTile = Readonly<{
  index: number;
  page: number;
  x: number;
  y: number;
  pvrzResourceName: Maybe<string>;
}>;

export type RawTisPvrz = Readonly<{
  resourceName: string;
  header: RawTisHeader;
  variant: 'pvrz';
  columns: number;
  rows: number;
  atlasWidthSource: RawTisAtlasWidthSource;
  imageName: string;
  tiles: RawTisTile[];
}>;
