import type { BufferReader } from '@/shared/bufferReader.js';

type ParseTileOffsetsProps = Readonly<{
  reader: BufferReader;
  blocksCount: number;
}>;
export const parseLookups = ({
  reader,
  blocksCount,
}: ParseTileOffsetsProps): number[] => Array.from({ length: blocksCount }, () => reader.uint());
