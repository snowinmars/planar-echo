import type { Maybe } from '../maybe.js';

export type GhostTisHeader = Readonly<{
  signature: 'tis';
  version: 'v1';
  tileCount: number;
  tileSize: number;
  headerSize: number;
  tileDimension: number;
}>;

export type GhostTisAtlasWidthSource = 'wed' | 'fallback';

export type GhostTisTileMeta = Readonly<{
  index: number;
}>;

export type GhostTisPalette = Readonly<{
  resourceName: string;
  header: GhostTisHeader;
  variant: 'palette';
  columns: number;
  rows: number;
  atlasWidthSource: GhostTisAtlasWidthSource;
  imageName: string;
  paletteName: string;
  indicesName: string;
  tiles: GhostTisTileMeta[];
}>;

export type GhostTisPvrzTile = Readonly<{
  index: number;
  page: number;
  x: number;
  y: number;
  pvrzResourceName?: Maybe<string>;
}>;

export type GhostTisPvrz = Readonly<{
  resourceName: string;
  header: GhostTisHeader;
  variant: 'pvrz';
  columns: number;
  rows: number;
  atlasWidthSource: GhostTisAtlasWidthSource;
  imageName: string;
  tiles: GhostTisPvrzTile[];
}>;

export type GhostTis = GhostTisPalette | GhostTisPvrz;
