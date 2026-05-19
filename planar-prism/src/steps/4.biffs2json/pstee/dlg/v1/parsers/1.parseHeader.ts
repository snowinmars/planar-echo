import { extendMap } from './1.parseHeader.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawHeader } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader): RawHeader => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  /* eslint-disable @stylistic/no-multi-spaces */
  const statesCount             = reader.uint();
  const statesOffset            = reader.uint();
  const responsesCount          = reader.uint();
  const responsesOffset         = reader.uint();
  const stateTriggersOffset     = reader.uint();
  const stateTriggersCount      = reader.uint();
  const responsesTriggersOffset = reader.uint();
  const responseTriggersCount   = reader.uint();
  const actionsOffset           = reader.uint();
  const actionsCount            = reader.uint();
  const threatResponse          = reader.map.uint(extendMap.threatResponse.parseFlags);
  /* eslint-enable */

  return {
    signature: 'dlg',
    version: 'v1.0',
    statesCount,
    statesOffset,
    responsesCount,
    responsesOffset,
    stateTriggersOffset,
    stateTriggersCount,
    responsesTriggersOffset,
    responseTriggersCount,
    actionsOffset,
    actionsCount,
    threatResponse,
  };
};
