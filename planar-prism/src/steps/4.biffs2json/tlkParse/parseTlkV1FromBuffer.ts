import { createReader } from '../../../pipes/readers.js';

import type { TlkHeader, TlkItem, Tlk } from './types.js';
import type { BufferReader } from '../../../pipes/readers.js';

const readHeader = (reader: BufferReader, signature: string, version: string): TlkHeader => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const language     = reader.short ();
  const stringCount  = reader.uint  ();
  const stringOffset = reader.uint  ();
  /* eslint-enable */

  return {
    signature,
    version,
    language,
    stringCount,
    stringOffset,
  };
};

const readTlkString = (i: number, reader: BufferReader): TlkItem => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const flags        = reader.short ();
  const soundResRef  = reader.string(8);
  const volume       = reader.uint  ();
  const pitch        = reader.uint  ();
  const stringOffset = reader.uint  ();
  const length       = reader.uint  ();
  /* eslint-enable */

  return {
    index: i,
    flags,
    soundResRef,
    volume,
    pitch,
    offset: stringOffset,
    length,
    text: '',
  };
};

const readItems = (reader: BufferReader, header: TlkHeader): Map<number, TlkItem> => {
  const itemsMap = new Map<number, TlkItem>();
  const headerLengthBytes = 18;
  const tlkStringLengthBytes = 26;
  const stringBlockStart = header.stringOffset;

  for (let i = 0; i < header.stringCount; i++) {
    const offset = headerLengthBytes + i * tlkStringLengthBytes;
    const item = readTlkString(i, reader.fork(offset));

    let text = '';
    if (item.length > 0) {
      text = reader.fork(stringBlockStart + item.offset).string(item.length, false, 'utf8');
    }

    itemsMap.set(item.index, {
      ...item,
      text,
    });
  }

  return itemsMap;
};

const parseTlkV1FromBuffer = (buffer: Buffer): Tlk => {
  const reader = createReader(buffer);

  const signature = reader.string(4);
  const version = reader.string(4);

  if (signature !== 'tlk') throw new Error(`Unsupported signature: '${signature}'`);
  if (version !== 'v1') throw new Error(`Unsupported version: '${version}'`);

  const header = readHeader(reader, signature, version);

  const itemsMap = readItems(reader, header);

  return {
    header,
    itemsMap,
  };
};

export default parseTlkV1FromBuffer;
