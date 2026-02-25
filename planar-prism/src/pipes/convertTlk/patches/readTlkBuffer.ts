import { createReader } from '../../../pipes/readers.js';

import type { TlkHeader, TlkItem, TlkEntry } from '../types.js';
import type { BufferReader } from '../../../pipes/readers.js';

const readHeader = (reader: BufferReader): TlkHeader => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const signature    = reader.string(4);
  const version      = reader.string(4);
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

const readTlkBuffer = (buffer: Buffer): TlkEntry => {
  const reader = createReader(buffer);

  const header = readHeader(reader);

  if (header.signature !== 'tlk') throw new Error(`Unsupported signature: '${header.signature}'`);
  if (header.version !== 'v1') throw new Error(`Unsupported version: '${header.version}'`);

  const itemsMap = readItems(reader, header);

  return {
    header,
    itemsMap,
  };
};

export default readTlkBuffer;
