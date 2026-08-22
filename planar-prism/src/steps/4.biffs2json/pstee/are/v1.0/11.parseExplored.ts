import { nothing } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { Maybe } from '@planar/shared';

type ParseExploredProps = Readonly<{
  reader: BufferReader;
  size: number;
}>;
export const parseExplored = ({
  reader,
  size,
}: ParseExploredProps): Maybe<Buffer> => size === 0 ? nothing() : reader.blob(reader.offset, reader.offset + size);
