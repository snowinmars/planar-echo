import type { Maybe } from '@planar/shared';
import type { TisHeader } from './v1/1.parseHeader.types.js';

export type AtlasWidthSource = 'wed' | 'fallback';

export type PaletteTisTileMeta = Readonly<{
  index: number;
}>;

export type PvrzTisTile = Readonly<{
  index: number;
  page: number;
  x: number;
  y: number;
  pvrzResourceName: Maybe<string>;
}>;

export type PaletteTis = Readonly<{
  resourceName: string;
  header: TisHeader;
  variant: 'palette';
  columns: number;
  rows: number;
  atlasWidthSource: AtlasWidthSource;
  imageName: string;
  paletteName: string;
  indicesName: string;
  tiles: PaletteTisTileMeta[];
}>;

export type PvrzTis = Readonly<{
  resourceName: string;
  header: TisHeader;
  variant: 'pvrz';
  columns: number;
  rows: number;
  atlasWidthSource: AtlasWidthSource;
  imageName: string;
  tiles: PvrzTisTile[];
}>;

export type Tis = PaletteTis | PvrzTis;
