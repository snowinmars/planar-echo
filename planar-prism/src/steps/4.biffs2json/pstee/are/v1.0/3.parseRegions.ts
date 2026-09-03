import { nothing } from '@planar/shared';

import { extendMap } from './3.parseRegions.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawAreRegionV10 } from './3.parseRegions.types.js';
import type { RawAreVertexV10 } from './8.parseVertices.types.js';

type ParseRegionProps = Readonly<{
  reader: BufferReader;
  vertices: readonly RawAreVertexV10[];
}>;
const parseRegion = ({
  reader,
  vertices,
}: ParseRegionProps): RawAreRegionV10 => {
  const name = reader.nullTerminatedString(32);
  const type = reader.map.ushort(extendMap.regionType.parse);
  const boundingBoxLeft = reader.short();
  const boundingBoxTop = reader.short();
  const boundingBoxRight = reader.short();
  const boundingBoxBottom = reader.short();
  const verticesCount = reader.ushort();
  const firstVertexIndex = reader.uint();
  const triggerValue = reader.uint();
  const cursorIndex = reader.uint();
  const destinationArea = reader.string(8);
  const entranceName = reader.string(32);
  const flags = reader.map.uint(extendMap.regionFlags.parseFlags);
  const infoPointTextRef = reader.int();
  const trapDetectionDifficulty = reader.ushort();
  const trapRemovalDifficulty = reader.ushort();
  const trapped = reader.ushort() === 1;
  const trapDetected = reader.ushort() === 1;
  const launchX = reader.ushort();
  const launchY = reader.ushort();
  const key = reader.string(8);
  const script = reader.string(8);
  const activationX = reader.ushort();
  const activationY = reader.ushort();
  reader.skip.custom(36);
  const sound = reader.string(8);
  const speakerX = reader.ushort();
  const speakerY = reader.ushort();
  const speakerNameRef = reader.uint();
  const dialog = reader.string(8);

  const verticesSlice = vertices.slice(firstVertexIndex, firstVertexIndex + verticesCount);

  const rawAreRegionV10: RawAreRegionV10 = {
    name,
    type,
    boundingBox: {
      left: boundingBoxLeft,
      top: boundingBoxTop,
      right: boundingBoxRight,
      bottom: boundingBoxBottom,
    },
    vertices: verticesSlice,
    triggerValue,
    cursorIndex,
    destinationArea,
    entranceName,
    flags,
    infoPointTextRef: infoPointTextRef ? infoPointTextRef : nothing(),
    trapDetectionDifficulty,
    trapRemovalDifficulty,
    trapped,
    trapDetected,
    trapLaunchAt: {
      x: launchX,
      y: launchY,
    },
    key: key ? key : nothing(),
    script: script ? script : nothing(),
    activation: {
      x: activationX,
      y: activationY,
    },
    sound,
    speaker: {
      x: speakerX,
      y: speakerY,
    },
    speakerNameRef,
    dialog,
  };

  return rawAreRegionV10;
};

type ParseRegionsProps = Readonly<{
  reader: BufferReader;
  count: number;
  vertices: RawAreVertexV10[];
}>;
export const parseRegions = ({
  reader,
  count,
  vertices,
}: ParseRegionsProps): RawAreRegionV10[] => {
  const regions: RawAreRegionV10[] = [];

  for (let i = 0; i < count; i++) regions.push(parseRegion({
    reader,
    vertices,
  }));

  return regions;
};
