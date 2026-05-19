import { nothing } from '@planar/shared';
import { extendMap, tlkItemLengthBytes } from './2.parseItemsV1.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { TlkItem } from './2.parseItemsV1.types.js';

const parseTlkItem = (i: number, reader: BufferReader): Omit<TlkItem, 'text'> => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const flags         = reader.map.ushort(extendMap.flags.parseFlags);
  const soundResRef   = reader.string(8) || nothing();
  const volume        = reader.uint();
  const pitch         = reader.uint();
  const stringsOffset = reader.uint();
  const stringsLength = reader.uint();
  /* eslint-enable */

  return {
    index: i,
    flags,
    soundResRef,
    volume,
    pitch,
    stringsOffset,
    stringsLength,
  };
};

type ParseItemV1Props = Readonly<{
  reader: BufferReader;
  headerLengthBytes: number;
  stringOffset: number;
  stringCount: number;
}>;
export const parseItemsV1 = ({
  reader,
  headerLengthBytes,
  stringOffset,
  stringCount,
}: ParseItemV1Props): Map<number, TlkItem> => {
  const itemsMap = new Map<number, TlkItem>();

  const stringBlockStart = stringOffset;

  for (let i = 0; i < stringCount; i++) {
    const offset = headerLengthBytes + i * tlkItemLengthBytes;
    const item = parseTlkItem(i, reader.fork(offset));
    const text = item.stringsLength > 0 ? reader.fork(stringBlockStart + item.stringsOffset).string(item.stringsLength, true).trim() : '';

    itemsMap.set(item.index, {
      ...item,
      text,
    });
  }

  return itemsMap;
};
