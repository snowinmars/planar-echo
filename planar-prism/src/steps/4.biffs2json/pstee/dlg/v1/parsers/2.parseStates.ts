import { normalizeRef } from '@/shared/numbers.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawState } from './2.parseStates.types.js';

const parse = (reader: BufferReader, index: number): RawState => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const textRef            = normalizeRef(reader.uint());
  const firstResponseIndex = reader.uint();
  const responsesCount     = reader.uint();
  const triggerIndex       = normalizeRef(reader.uint());
  /* eslint-enable */

  return {
    index,
    textRef,
    firstResponseIndex,
    responsesCount,
    triggerIndex,
  };
};

type ParseStatesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseStates = ({
  reader,
  count,
}: ParseStatesProps): RawState[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const knownStateSize = 16;
  return Array.from<never, RawState>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownStateSize), i));
};
