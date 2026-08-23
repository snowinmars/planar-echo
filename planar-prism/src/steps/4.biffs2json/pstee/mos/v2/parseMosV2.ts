import { parseHeader } from './parsers/1.parseHeader.js';
import { nothing } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawMosV2, RawMosV2Block } from './parseMosV2.types.js';
import type { Maybe } from '@planar/shared';

const pvrzFileNameForMosPage = (page: number): Maybe<string> => {
  if (page < 0 || page >= 100000) return nothing();
  return `mos${page.toString().padStart(4, '0')}.pvrz`;
};

type ParseMosV2JsonProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseMosV2Json = ({
  reader,
  resourceName,
}: ParseMosV2JsonProps): RawMosV2 => {
  const header = parseHeader(reader, resourceName);
  const blocks: RawMosV2Block[] = [];
  const blockReader = reader.fork(header.blocksOffset);

  for (let blockIdx = 0; blockIdx < header.blockCount; blockIdx++) {
    const page = blockReader.int();
    const sourceX = blockReader.uint();
    const sourceY = blockReader.uint();
    const width = blockReader.uint();
    const height = blockReader.uint();
    const targetX = blockReader.uint();
    const targetY = blockReader.uint();

    const pvrzResourceName = pvrzFileNameForMosPage(page);
    if (!pvrzResourceName) throw new Error(`Invalid PVRZ page '${page}' in block '${blockIdx}' for resource '${resourceName}'`);

    blocks.push({
      index: blockIdx,
      page,
      pvrzResourceName,
      sourceX,
      sourceY,
      width,
      height,
      targetX,
      targetY,
    });
  }

  return {
    resourceName,
    signature: 'mos',
    variant: 'v2',
    header,
    imageName: `${resourceName}.png`,
    blocks,
  };
};
