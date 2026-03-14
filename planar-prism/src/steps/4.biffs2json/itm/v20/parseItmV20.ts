import parseHeader from './1.parseHeader.js';
import parseExtendedHeaders from './2.parseExtendedHeader.js';
import parseFeatureBlocks from './3.parseFeatureBlock.js';

import type { BufferReader } from '../../../../pipes/readers.js';
import type { ItmV20, Signature, Versions } from '../types.js';
import type { Meta } from '../../types.js';

const parseItmV20 = (reader: BufferReader, meta: Meta<Signature, Versions>): ItmV20 => {
  const header = parseHeader(reader, meta);
  const extendedHeaders = parseExtendedHeaders(reader.fork(header.offsetToExtendedHeaders), header.countOfExtendedHeaders, header.offsetToFeatureBlocks);
  const featureBlocks = parseFeatureBlocks(reader.fork(header.offsetToFeatureBlocks), header.countOfEquippingFeatureBlocks);

  return {
    resourceName: meta.resourceName,
    header,
    extendedHeaders,
    featureBlocks,
  };
};

export default parseItmV20;
