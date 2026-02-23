import { readString, readShort, readUint } from '../../../pipes/readers.js';
import type { TlkHeader, TlkItem, TlkEntry } from '../types.js';

const readHeader = (buffer: Buffer, offset: number): TlkHeader => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const signature    = readString(buffer, offset, 4).trim();
  const version      = readString(buffer, offset +  4, 4).trim();
  const language     = readShort (buffer, offset +  8);
  const stringCount  = readUint  (buffer, offset + 10);
  const stringOffset = readUint  (buffer, offset + 14);
  /* eslint-enable */

  return {
    signature,
    version,
    language,
    stringCount,
    stringOffset,
  };
};

const readTlkString = (i: number, buffer: Buffer, offset: number): TlkItem => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const flags        = readShort (buffer, offset);
  const soundResRef  = readString(buffer, offset +  2, 8).trim();
  const volume       = readUint  (buffer, offset + 10);
  const pitch        = readUint  (buffer, offset + 14);
  const stringOffset = readUint  (buffer, offset + 18);
  const length       = readUint  (buffer, offset + 22);
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

const readTlkBuffer = (buffer: Buffer): TlkEntry => {
  const header = readHeader(buffer, 0);

  if (header.signature !== 'TLK') throw new Error(`Unsupported signature: '${header.signature}'`);
  if (header.version !== 'V1') throw new Error(`Unsupported version: '${header.version}'`);

  const itemsMap = new Map<number, TlkItem>();
  const headerLengthBytes = 18;
  const tlkStringLengthBytes = 26;
  const stringBlockStart = header.stringOffset;

  for (let i = 0; i < header.stringCount; i++) {
    const offset = headerLengthBytes + i * tlkStringLengthBytes;
    const item = readTlkString(i, buffer, offset);

    let text = '';
    if (item.length > 0) {
      text = readString(buffer, stringBlockStart + item.offset, item.length, 'utf8').trim();
    }

    itemsMap.set(item.index, {
      ...item,
      text,
    });
  }

  return {
    header,
    itemsMap,
  };
};

export default readTlkBuffer;
