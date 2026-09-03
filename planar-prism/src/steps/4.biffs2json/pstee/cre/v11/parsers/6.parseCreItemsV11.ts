import { extendMap } from './6.parseCreItemsV11.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawCreItemV11 } from './6.parseCreItemsV11.types.js';

const parse = (reader: BufferReader): RawCreItemV11 => {
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

type ParseCreItemsV11Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseCreItemsV11 = ({
  reader,
  count,
}: ParseCreItemsV11Props): RawCreItemV11[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const r = reader.fork();
  return Array.from<never, RawCreItemV11>({ length: count }, () => parse(r));
};
