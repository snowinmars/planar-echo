import { nothing } from '../../../../../shared/maybe.js';

import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { RawState } from '../../v1.types/2.states.js';
import type { Signature, Versions } from '../../types.js';

const normalizeRef = (value: number, emptyInt: number): number => value === emptyInt ? -1 : value;

const parse = (reader: BufferReader, index: number, meta: Meta<Signature, Versions>): RawState => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const textRef            = normalizeRef(reader.uint(), meta.emptyInt);
  const firstResponseIndex = reader.uint();
  const responsesCount     = reader.uint();
  const triggerIndex       = normalizeRef(reader.uint(), meta.emptyInt);
  /* eslint-enable */

  return {
    index,
    textRef,
    firstResponseIndex,
    responsesCount,
    triggerIndex,
    // following properties may be overrided in the patches after this step
    textTlk: nothing(),
    stateOrigins: [],
    weightStates: [],
  };
};

const parseStates = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): RawState[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const knownStateSize = 16;
  return Array.from<never, RawState>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownStateSize), i, meta));
};

export default parseStates;
