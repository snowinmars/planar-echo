import { nothing, type Maybe } from '@planar/shared';
import { offsetMap } from '../../v1.types/3.response.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type { RawResponse } from '../../v1.types/3.response.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

const parse = (reader: BufferReader, index: number, meta: Meta<Signature, Versions>): RawResponse => {
  const flags = reader.map.uint(offsetMap.flags.parseFlags);

  let textRef: Maybe<number> = normalizeRef(reader.uint(), meta.emptyInt);
  if (!flags.includes('has associated text')) textRef = nothing();

  let journalRef: Maybe<number> = normalizeRef(reader.uint(), meta.emptyInt);
  if (!flags.includes('has journal entry')) journalRef = nothing();

  let triggerIndex: Maybe<number> = normalizeRef(reader.uint(), meta.emptyInt);
  if (!flags.includes('has trigger')) triggerIndex = nothing();

  let actionIndex: Maybe<number> = normalizeRef(reader.uint(), meta.emptyInt);
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

const parseResponses = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): RawResponse[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const knownResponseSize = 32;
  return Array.from<never, RawResponse>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownResponseSize), i, meta));
};

export default parseResponses;
