import { extendMap } from './6.parseCreatureItemsV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { ItemV10 } from './6.parseCreatureItemsV10.types.js';

const parse = (reader: BufferReader): ItemV10 => {
  const item = reader.string(8);
  const duration = reader.ushort();
  const quantityCharges1 = reader.short();
  const quantityCharges2 = reader.short();
  const quantityCharges3 = reader.short();
  const flags = reader.map.uint(extendMap.flags.parseFlags);

  return {
    item,
    duration,
    quantityCharges1,
    quantityCharges2,
    quantityCharges3,
    flags,
  };
};

type ParseCreatureItemsV10Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseCreatureItemsV10 = ({
  reader,
  count,
}: ParseCreatureItemsV10Props): ItemV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const creatureItemSize = 20;
  return Array.from<never, ItemV10>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * creatureItemSize)));
};
