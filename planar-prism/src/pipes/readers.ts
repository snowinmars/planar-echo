// export const readBit = (buffer: Buffer, offset: number): (0 | 1) => {
//   // You cannot read bit.
//   // You can read 8 bits as byte and parse them.

import { just, type Maybe } from '../shared/types.js';

//   const byteIndex = Math.floor(offset / 8);
//   const bitOffset = offset % 8;

//   const byte = buffer[byteIndex]!;
//   return getNthBit(byte, bitOffset);
// };
// export const getNthBit = (byte: number, n: number): (0 | 1) => {
//   if (byte < 0 || byte > 255) throw new Error(`getNthBit from byte expect the byte to be in the byte range, but ${byte}...`);
//   if (n < 0 || n > 8) throw new Error(`getNthBit from byte expect the N to be in the byte range, but ${n}...`);

//   const shift = (7 - n);
//   const bitValue = (byte >> shift) & 1;

//   return bitValue === 0 ? 0 : 1;
// };

type BufferReaderNumberMapFunction<T> = (x: number) => T;
type BufferReaderStringMapFunction<T> = (x: string) => T;
export type BufferReader = {
  buffer: Buffer;
  offset: number;
  short: () => number;
  uint: () => number;
  int: () => number;
  byte: () => number;
  string: (length: number, asIs: Maybe<boolean>, encoding: Maybe<BufferEncoding>) => string;
  map: Readonly<{
    short: <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T>) => T;
    uint: <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T>) => T;
    int: <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T>) => T;
    byte: <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T>) => T;
    string: <T>(length: number, map: BufferReaderStringMapFunction<T>, asIs: Maybe<boolean>, encoding: Maybe<BufferEncoding>) => T;
  }>;
  boolean: Readonly<{
    short: (sourceName: Maybe<string>) => boolean;
    uint: (sourceName: Maybe<string>) => boolean;
    int: (sourceName: Maybe<string>) => boolean;
    byte: (sourceName: Maybe<string>) => boolean;
  }>;
  skip: {
    short: () => void;
    uint: () => void;
    int: () => void;
    byte: () => void;
    custom: (bytes: number) => void;
  };
  fork: (newOffset: Maybe<number>) => BufferReader;
};

const numberAsBoolean = (x: number, sourceName: Maybe<string> = null): boolean => {
  {
    switch (x) {
      case 0: return false;
      case 1: return true;
      default: throw new Error(`Property ${x} is out of boolean 0..1 range for ${sourceName ?? 'unspecified source'}`);
    }
  }
};

export const createReader = (buffer: Buffer, initialOffset: number = 0): BufferReader => {
  let offset = initialOffset;

  const short = (): number => {
    const value = buffer.readInt16LE(offset);
    offset += 2;
    return value;
  };
  const mapShort = <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T> = null): T => {
    if (!or) return map(short());
    try {
      return map(short());
    }
    catch {
      return just(or);
    }
  };
  const booleanShort = (sourceName: Maybe<string> = null) => numberAsBoolean(short(), sourceName);

  const uint = (): number => {
    const value = buffer.readUInt32LE(offset);
    offset += 4;
    return value;
  };
  const mapUint = <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T> = null): T => {
    if (!or) return map(uint());
    try {
      return map(uint());
    }
    catch {
      return just(or);
    }
  };
  const booleanUint = (sourceName: Maybe<string> = null) => numberAsBoolean(uint(), sourceName);

  const int = (): number => {
    const value = buffer.readInt32LE(offset);
    offset += 4;
    return value;
  };
  const mapInt = <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T> = null): T => {
    if (!or) return map(int());
    try {
      return map(int());
    }
    catch {
      return just(or);
    }
  };
  const booleanInt = (sourceName: Maybe<string> = null) => numberAsBoolean(int(), sourceName);

  const byte = (): number => {
    const value = buffer.readUInt8(offset);
    offset += 1;
    return value;
  };
  const mapByte = <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T> = null): T => {
    if (!or) return map(byte());
    try {
      return map(byte());
    }
    catch {
      return just(or);
    }
  };
  const booleanByte = (sourceName: Maybe<string> = null) => numberAsBoolean(byte(), sourceName);

  const string = (length: number, asIs: Maybe<boolean> = false, encoding: Maybe<BufferEncoding> = 'ascii'): string => {
    const value = buffer.toString(encoding ?? 'ascii', offset, offset + length).replace(/\0/g, '');
    offset += length;
    return asIs ? value : value.trim().toLowerCase();
  };
  const mapString = <T>(length: number, map: BufferReaderStringMapFunction<T>, asIs: Maybe<boolean> = false, encoding: Maybe<BufferEncoding> = 'ascii'): T => map(string(length, asIs, encoding));

  const skipCustom = (bytes: number): void => {
    offset += bytes;
  };
  const skipShort = () => skipCustom(2);
  const skipUint = () => skipCustom(4);
  const skipInt = () => skipCustom(4);
  const skipByte = () => skipCustom(1);

  const fork = (newOffset: Maybe<number> = null): BufferReader => createReader(buffer, newOffset ?? offset);

  return {
    get buffer() { return buffer; },
    get offset() { return offset; },
    short,
    uint,
    int,
    byte,
    string,
    map: {
      short: mapShort,
      uint: mapUint,
      int: mapInt,
      byte: mapByte,
      string: mapString,
    },
    boolean: {
      short: booleanShort,
      uint: booleanUint,
      int: booleanInt,
      byte: booleanByte,
    },
    skip: {
      short: skipShort,
      uint: skipUint,
      int: skipInt,
      byte: skipByte,
      custom: skipCustom,
    },
    fork,
  };
};
export default createReader;
