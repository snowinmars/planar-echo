import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Header } from '../../v1.types/1.header.js';

const parseHeaderV1 = (reader: BufferReader, signature: 'tlk', version: 'v1'): Header => {
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

export default parseHeaderV1;
