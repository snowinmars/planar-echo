import { offsetMap } from '../../v1.types/1.header.js';
import { nothing } from '../../../../../shared/maybe.js';

import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Meta } from '../../../types.js';
import { type RawHeader } from '../../v1.types/1.header.js';
import type { Signature, Versions } from '../../types.js';

const parseHeader = (reader: BufferReader, meta: Meta<Signature, Versions>): RawHeader => {
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

  const threatResponse          = meta.isBg1 ? reader.map.uint(offsetMap.threatResponse.parseFlags) : nothing();
  /* eslint-enable */

  return {
    signature: meta.signature,
    version: meta.version,
    statesCount,
    statesOffset,
    responsesCount,
    responsesOffset,
    stateTriggersCount,
    stateTriggersOffset,
    responseTriggersCount,
    responsesTriggersOffset,
    actionsCount,
    actionsOffset,
    threatResponse,
  };
};

export default parseHeader;
