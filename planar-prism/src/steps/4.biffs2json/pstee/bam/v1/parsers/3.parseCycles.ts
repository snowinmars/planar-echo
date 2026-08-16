import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBamV1CycleEntry } from './3.parseCycles.types.js';

type ParseCyclesProps = Readonly<{
  cycleReader: BufferReader;
  lookupReader: BufferReader;
  cyclesCount: number;
}>;

export const parseCycles = ({
  cycleReader,
  lookupReader,
  cyclesCount,
}: ParseCyclesProps): RawBamV1CycleEntry[] => {
  const cyclesMeta: { framesCount: number; firstLookup: number }[] = [];
  let lookupSize = 0;

  for (let i = 0; i < cyclesCount; i++) {
    const count = cycleReader.ushort();
    const first = cycleReader.ushort();
    cyclesMeta.push({ framesCount: count, firstLookup: first });
    const end = first + count;
    if (end > lookupSize) lookupSize = end;
  }

  const lookup: number[] = [];
  for (let i = 0; i < lookupSize; i++) lookup.push(lookupReader.ushort());

  return cyclesMeta.map((cycle, index) => ({
    index,
    framesCount: cycle.framesCount,
    firstLookup: cycle.firstLookup,
    frameIndices: lookup.slice(cycle.firstLookup, cycle.firstLookup + cycle.framesCount),
  }));
};
