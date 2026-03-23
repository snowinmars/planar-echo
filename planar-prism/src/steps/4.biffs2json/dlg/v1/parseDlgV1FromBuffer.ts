import parseHeader from './parsers/1.parseHeader.js';
import parseStates from './parsers/2.parseStates.js';
import parseResponses from './parsers/3.parseResponses.js';
import parseFunction from './parsers/4.parseFunctions.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../types.js';
import type { RawDlg, Signature, Versions } from '../types.js';

const parseIdsV1FromBuffer = (reader: BufferReader, meta: Meta<Signature, Versions>): RawDlg => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm#formDLGV1_Action

  const header = parseHeader(reader, meta);

  /* eslint-disable @stylistic/no-multi-spaces,@stylistic/comma-spacing */
  const states            = parseStates   (reader.fork(header.statesOffset)           , header.statesCount          , meta);
  const responses         = parseResponses(reader.fork(header.responsesOffset)        , header.responsesCount       , meta);
  const stateTriggers     = parseFunction (reader.fork(header.stateTriggersOffset)    , header.stateTriggersCount   , meta);
  const responsesTriggers = parseFunction (reader.fork(header.responsesTriggersOffset), header.responseTriggersCount, meta);
  const responsesActions  = parseFunction (reader.fork(header.actionsOffset)          , header.actionsCount         , meta);
  /* eslint-enable */

  return {
    resourceName: meta.resourceName,
    header,
    states,
    responses,
    stateTriggers,
    responsesTriggers,
    responsesActions,
    stateIndicesOrderedByWeight: [], // may be overrided in the attachWeights patch
  };
};

export default parseIdsV1FromBuffer;
