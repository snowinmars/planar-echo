import { nothing } from '@planar/shared';
import { offsetMap } from '../../v1.types/3.response.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type { RawResponse } from '../../v1.types/3.response.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

const parse = (reader: BufferReader, index: number, meta: Meta<Signature, Versions>): RawResponse => {
  const flags = reader.map.uint(offsetMap.flags.parseFlags);

  const textRef = flags.includes('has associated text')
    ? normalizeRef(reader.uint(), meta.emptyInt)
    : nothing();

  const journalRef = flags.includes('has journal entry')
    ? normalizeRef(reader.uint(), meta.emptyInt)
    : nothing();

  const triggerIndex = flags.includes('has trigger')
    ? normalizeRef(reader.uint(), meta.emptyInt)
    : nothing();

  const actionIndex = flags.includes('has action')
    ? reader.uint()
    : nothing();

  const [nextDialog, nextDialogState] = flags.includes('terminates dialog')
    ? [nothing(), nothing()]
    : [reader.string(8), reader.uint()];

  return {
    index,
    flags,
    textRef,
    journalRef,
    triggerIndex,
    actionIndex,
    nextDialog,
    nextDialogState,
    // following properties may be overrided in the patches after this step
    textTlk: nothing(),
    journalTlk: nothing(),
  };
};

const parseResponses = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): RawResponse[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const knownResponseSize = 32;
  return Array.from<never, RawResponse>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownResponseSize), i, meta));
};

export default parseResponses;
