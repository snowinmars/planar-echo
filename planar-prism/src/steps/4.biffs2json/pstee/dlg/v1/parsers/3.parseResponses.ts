import { nothing } from '@planar/shared';

import { normalizeRef } from '@/shared/numbers.js';

import { extendMap } from './3.parseResponses.types.js';

import type { Maybe } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawDlgResponse } from './3.parseResponses.types.js';

const parse = (reader: BufferReader, index: number): RawDlgResponse => {
  const flags = reader.map.uint(extendMap.flags.parseFlags);

  let textRef: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has associated text')) textRef = nothing();

  let journalRef: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has journal entry')) journalRef = nothing();

  let triggerIndex: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has trigger')) triggerIndex = nothing();

  let actionIndex: Maybe<number> = normalizeRef(reader.uint());
  if (!flags.includes('has action')) actionIndex = nothing();

  let nextDlg: Maybe<string> = reader.string(8);
  let nextDlgState: Maybe<number> = reader.uint();
  if (flags.includes('terminates dialog')) {
    nextDlg = nothing();
    nextDlgState = nothing();
  }

  return {
    index,
    flags,
    textRef,
    journalRef,
    triggerIndex,
    actionIndex,
    nextDlg,
    nextDlgState,
  };
};

type ParseResponsesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseResponses = ({
  reader,
  count,
}: ParseResponsesProps): RawDlgResponse[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const r = reader.fork();
  return Array.from<never, RawDlgResponse>({ length: count }, (_, i) => parse(r, i));
};
