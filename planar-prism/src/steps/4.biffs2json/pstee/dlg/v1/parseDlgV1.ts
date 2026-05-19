import { parseHeader } from './parsers/index.js';
import { parseStates } from './parsers/index.js';
import { parseResponses } from './parsers/index.js';
import { parseFunction } from './parsers/index.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawDlg } from '../types.js';

type ParseDlgV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseDlgV1 = ({
  reader,
  resourceName,
}: ParseDlgV1Props): RawDlg => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm#formDLGV1_Action

  const header = parseHeader(reader);

  const states = parseStates ({
    reader: reader.fork(header.statesOffset),
    count: header.statesCount,
  });

  const responses = parseResponses({
    reader: reader.fork(header.responsesOffset),
    count: header.responsesCount,
  });

  const stateTriggers = parseFunction ({
    reader: reader.fork(header.stateTriggersOffset),
    count: header.stateTriggersCount,
  });

  const responsesTriggers = parseFunction ({
    reader: reader.fork(header.responsesTriggersOffset),
    count: header.responseTriggersCount,
  });

  const responsesActions = parseFunction ({
    reader: reader.fork(header.actionsOffset),
    count: header.actionsCount,
  });

  return {
    resourceName: resourceName,
    header,
    states,
    responses,
    stateTriggers,
    responsesTriggers,
    responsesActions,
  };
};
