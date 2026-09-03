import { extendMap } from './7.parseItems.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawAreItemV10 } from './7.parseItems.types.js';

const parseItem = (reader: BufferReader): RawAreItemV10 => {
  const resref = reader.string(8);
  const expiryTime = reader.ushort();
  const quantity1 = reader.ushort();
  const quantity2 = reader.ushort();
  const quantity3 = reader.ushort();
  const flags = reader.map.uint(extendMap.itemFlags.parseFlags);

  const rawAreItemV10: RawAreItemV10 = {
    resref,
    expiryTime,
    quantity1,
    quantity2,
    quantity3,
    flags,
  };

  return rawAreItemV10;
};

type ParseItemsProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseItems = ({
  reader,
  count,
}: ParseItemsProps): RawAreItemV10[] => {
  const items: RawAreItemV10[] = [];

  for (let i = 0; i < count; i++) items.push(parseItem(reader));

  return items;
};
