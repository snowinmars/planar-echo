import type { BufferReader } from '@/shared/bufferReader.js';
import type { Header } from './1.parseHeaderV1.types.js';

type ParseHeaderV1Props = Readonly<{
  reader: BufferReader;
  signature: 'tlk';
  version: 'v1';
}>;
export const parseHeaderV1 = ({
  reader,
  signature,
  version,
}: ParseHeaderV1Props): Header => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const language     = reader.short ();
  const stringCount  = reader.uint  ();
  const stringOffset = reader.uint  ();
  /* eslint-enable */

  return {
    signature,
    version,
    language,
    stringCount,
    stringOffset,
  };
};
