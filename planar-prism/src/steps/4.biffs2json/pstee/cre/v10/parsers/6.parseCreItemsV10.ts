import { extendMap } from './6.parseCreItemsV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawCreItemV10 } from './6.parseCreItemsV10.types.js';

const parse = (reader: BufferReader): RawCreItemV10 => {
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

type ParseCreItemsV10Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseCreItemsV10 = ({
  reader,
  count,
}: ParseCreItemsV10Props): RawCreItemV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const r = reader.fork();
  return Array.from<never, RawCreItemV10>({ length: count }, () => parse(r));
};
