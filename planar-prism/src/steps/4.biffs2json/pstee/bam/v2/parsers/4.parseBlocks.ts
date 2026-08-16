import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBamV2DataBlock } from './4.parseBlocks.types.js';

type ParseBlocksProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  dataBlockCount: number;
}>;
export const parseBlocks = ({
  reader,
  resourceName,
  dataBlockCount,
}: ParseBlocksProps): RawBamV2DataBlock[] => {
  const blocks: RawBamV2DataBlock[] = [];

  for (let i = 0; i < dataBlockCount; i++) {
    const page = reader.int();

    if (page < 0 || page >= 100000) throw new Error(`Invalid pvrz page '${page}' in bam block '${i}' for resource '${resourceName}'`);

    const pvrzResourceName = `mos${page.toString().padStart(4, '0')}.pvrz`;

    blocks.push({
      index: i,
      page,
      pvrzResourceName,
      sourceX: reader.uint(),
      sourceY: reader.uint(),
      width: reader.uint(),
      height: reader.uint(),
      targetX: reader.uint(),
      targetY: reader.uint(),
    });
  }

  return blocks;
};
