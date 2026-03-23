import { offsetMap } from './../../v10.types/6.item.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type { ItemV10 } from '../../v10.types/6.item.js';

const parse = (reader: BufferReader): ItemV10 => {
  const resourceName = reader.string(8);
  const time1 = reader.byte();
  const time2 = reader.byte();
  const quantityCharges1 = reader.short();
  const quantityCharges2 = reader.short();
  const quantityCharges3 = reader.short();
  const flags = reader.map.uint(offsetMap.flags.parseFlags);

  return {
    resourceName,
    time1,
    time2,
    quantityCharges1,
    quantityCharges2,
    quantityCharges3,
    flags,
  };
};

const parseCreatureItemsV10 = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): ItemV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const creatureItemSize = 20;
  return Array.from<never, ItemV10>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * creatureItemSize)));
};

export default parseCreatureItemsV10;
