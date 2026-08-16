export type GhostPvrPixelFormat
  = | 'dxt1'
    | 'dxt5';

export type GhostPvr = Readonly<{
  resourceName: string;
  signature: 0x03525650;
  flags: 0 | 1;
  pixelFormat: GhostPvrPixelFormat;
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
