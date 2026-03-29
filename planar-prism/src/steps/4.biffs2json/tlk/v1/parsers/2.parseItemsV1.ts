import { nothing } from '@planar/shared';
import { offsetMap } from '../../v1.types/2.item.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Item } from '../../v1.types/2.item.js';
import type { Header } from '../../v1.types/1.header.js';

const parseTlkString = (i: number, reader: BufferReader): Item => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const flags        = reader.map.ushort(offsetMap.flags.parseFlags);
  const soundResRef  = reader.string(8);
  const volume       = reader.uint  ();
  const pitch        = reader.uint  ();
  const stringOffset = reader.uint  ();
  const length       = reader.uint  ();
  /* eslint-enable */

  return {
    index: i,
    flags,
    soundResRef: soundResRef || nothing(),
    volume,
    pitch,
    offset: stringOffset,
    length,
    text: '',
  };
};

const parseItemsV1 = (reader: BufferReader, header: Header): Map<number, Item> => {
  const itemsMap = new Map<number, Item>();

  const headerLengthBytes = 18;
  const tlkStringLengthBytes = 26;
  const stringBlockStart = header.stringOffset;

  for (let i = 0; i < header.stringCount; i++) {
    const offset = headerLengthBytes + i * tlkStringLengthBytes;
    const item = parseTlkString(i, reader.fork(offset));

    let text = '';
    if (item.length > 0) {
      text = reader.fork(stringBlockStart + item.offset).string(item.length, true, 'utf8').trim();
    }

    itemsMap.set(item.index, {
      ...item,
      text,
    });
  }

  return itemsMap;
};

export default parseItemsV1;
