import { normalizeRef } from '@/shared/numbers.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawDlgState } from './2.parseStates.types.js';

const parse = (reader: BufferReader, index: number): RawDlgState => {
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
}: ParseStatesProps): RawDlgState[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const r = reader.fork();
  return Array.from<never, RawDlgState>({ length: count }, (_, i) => parse(r, i));
};
