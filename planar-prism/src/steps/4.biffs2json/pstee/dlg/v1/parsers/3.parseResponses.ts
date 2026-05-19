import { nothing, type Maybe } from '@planar/shared';
import { normalizeRef } from '@/shared/numbers.js';
import { extendMap } from './3.parseResponses.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawResponse } from './3.parseResponses.types.js';

const parse = (reader: BufferReader, index: number): RawResponse => {
  const flags = reader.map.uint(extendMap.flags.parseFlags);

  let textRef: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has associated text')) textRef = nothing();

  let journalRef: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has journal entry')) journalRef = nothing();

  let triggerIndex: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has trigger')) triggerIndex = nothing();

  let actionIndex: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has action')) actionIndex = nothing();

  let nextDialog: Maybe<string> = reader.string(8);
  let nextDialogState: Maybe<number> = reader.uint();
  if (flags.includes('terminates dialog')) {
    nextDialog = nothing();
    nextDialogState = nothing();
  }

  return {
    index,
    flags,
    textRef,
    journalRef,
    triggerIndex,
    actionIndex,
    nextDialog,
    nextDialogState,
  };
};

type ParseResponsesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseResponses = ({
  reader,
  count,
}: ParseResponsesProps): RawResponse[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const knownResponseSize = 32;
  return Array.from<never, RawResponse>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownResponseSize), i));
};
