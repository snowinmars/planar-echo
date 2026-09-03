import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawBamV2CycleEntry } from './3.parseCycles.types.js';

type ParseCyclesProps = Readonly<{
  reader: BufferReader;
  cyclesCount: number;
}>;

export const parseCycles = ({
  reader,
  cyclesCount,
}: ParseCyclesProps): RawBamV2CycleEntry[] => {
  const cycles: RawBamV2CycleEntry[] = [];

  for (let i = 0; i < cyclesCount; i++) {
    const framesCount = reader.ushort();
    const firstFrame = reader.ushort();
    const frameIndices: number[] = [];

    for (let f = 0; f < framesCount; f++) frameIndices.push(firstFrame + f);

    cycles.push({
      index: i,
      framesCount,
      firstFrame,
      frameIndices,
    });
  }

  return cycles;
};
