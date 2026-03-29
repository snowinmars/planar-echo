import { just } from '@planar/shared';

import type { Maybe } from '@planar/shared';

// export const readBit = (buffer: Buffer, offset: number): (0 | 1) => {
//   // You cannot read bit.
//   // You can read 8 bits as byte and parse them.
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

type ReadFunction = () => number;
type ReadMapFunction = <T>(map: BufferReaderNumberMapFunction<T>, or?: Maybe<T>) => T;
type ReadBooleanFunction = (sourceName?: Maybe<string>) => boolean;
type ReadSkipFunction = () => void;
type NumberBucket<T> = Readonly<{
  byte: T;
  ubyte: T;
  short: T;
  ushort: T;
  int: T;
  uint: T;
}>;
type BufferReaderNumberMapFunction<T> = (x: number) => T;
type BufferReaderStringMapFunction<T> = (x: string) => T;

export type BufferReader = Readonly<{
  buffer: Buffer;
  offset: number;
  offsetHex: string;
  forkedOffsets: number[];
  forkedOffsetsHex: string[];
  totalOffset: number;
  totalOffsetHex: string;
  customBytes: (length: number) => number[];
  fork: (newOffset?: Maybe<number>) => BufferReader;
  readLineByLine: () => IterableIterator<string>;
  string: (length: number, asIs?: Maybe<boolean>, encoding?: Maybe<BufferEncoding>) => string;
  map: Readonly<{
    string: <T>(length: number, map: BufferReaderStringMapFunction<T>, asIs?: Maybe<boolean>, encoding?: Maybe<BufferEncoding>) => T;
  }> & NumberBucket<ReadMapFunction>;
  boolean: NumberBucket<ReadBooleanFunction>;
  skip: Readonly<{
    custom: (bytes: number) => void;
  }> & NumberBucket<ReadSkipFunction>;
}> & NumberBucket<ReadFunction>;

const numberAsBoolean = (x: number, sourceName: Maybe<string> = null): boolean => {
  {
    switch (x) {
      case 0: return false;
      case 1: return true;
      default: throw new Error(`Property ${x} is out of boolean 0..1 range for ${sourceName ?? 'unspecified source'}`);
    }
  }
};

export const createReader = (buffer: Buffer, initialOffset: number = 0, forkedOffsets: number[] = []): BufferReader => {
  let offset = initialOffset;

  const skipCustom = (bytes: number): void => {
    offset += bytes;
  };

  //

  const byte = (): number => {
    const value = buffer.readInt8(offset);
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
  const skipByte = () => skipCustom(1);

  //

  const ubyte = (): number => {
    const value = buffer.readUInt8(offset);
    offset += 1;
    return value;
  };
  const mapUbyte = <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T> = null): T => {
    if (!or) return map(ubyte());
    try {
      return map(ubyte());
    }
    catch {
      return just(or);
    }
  };
  const booleanUbyte = (sourceName: Maybe<string> = null) => numberAsBoolean(ubyte(), sourceName);
  const skipUbyte = () => skipCustom(1);

  //

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
  const skipShort = () => skipCustom(2);

  //

  const ushort = (): number => {
    const value = buffer.readUInt16LE(offset);
    offset += 2;
    return value;
  };
  const mapUshort = <T>(map: BufferReaderNumberMapFunction<T>, or: Maybe<T> = null): T => {
    if (!or) return map(ushort());
    try {
      return map(ushort());
    }
    catch {
      return just(or);
    }
  };
  const booleanUshort = (sourceName: Maybe<string> = null) => numberAsBoolean(ushort(), sourceName);
  const skipUshort = () => skipCustom(2);

  //

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
  const skipInt = () => skipCustom(4);

  //

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
  const skipUint = () => skipCustom(4);

  //

  const string = (length: number, asIs: Maybe<boolean> = false, encoding: Maybe<BufferEncoding> = 'ascii'): string => {
    const value = buffer.toString(encoding ?? 'ascii', offset, offset + length).replace(/\0/g, '');
    offset += length;
    return asIs ? value : value.trim().toLowerCase().replaceAll('\r\n', '\n');
  };
  const mapString = <T>(length: number, map: BufferReaderStringMapFunction<T>, asIs: Maybe<boolean> = false, encoding: Maybe<BufferEncoding> = 'ascii'): T => map(string(length, asIs, encoding));

  const customBytes = (length: number): number[] => {
    const bytes: number[] = [];
    for (let i = 0; i < length; i++) {
      const b = byte();
      bytes.push(b);
    }
    return bytes;
  };
  const fork = (newOffset: Maybe<number> = null): BufferReader => {
    const o = newOffset ?? offset;
    return createReader(buffer, o, [...forkedOffsets, o]);
  };
  const readLineByLine = (trim = true, toLower = true, encoding: BufferEncoding = 'utf-8'): IterableIterator<string> => {
    let startOffset = offset;
    let currentPos = offset;
    const separator = '\n'.charCodeAt(0); // 0xa === 10
    const formValue = (x: string): string => {
      let v = x;
      if (trim) v = v.trim();
      if (toLower) v = v.toLowerCase();
      return v.replaceAll('\r\n', '\n');
    };

    return {
      [Symbol.iterator](): IterableIterator<string> {
        return this;
      },

      next(): IteratorResult<string> {
        while (currentPos < buffer.length) {
          if (buffer[currentPos] === separator) {
            const line = buffer.toString(encoding, startOffset, currentPos);
            startOffset = currentPos + 1;
            currentPos++;
            offset = currentPos;
            return { value: formValue(line), done: false };
          }

          currentPos++;
        }

        // last line
        if (startOffset < buffer.length) {
          const line = buffer.toString(encoding, startOffset, buffer.length);
          // finalize buffer reading
          startOffset = buffer.length;
          currentPos = buffer.length;
          offset = buffer.length;
          return { value: formValue(line), done: false };
        }

        return { value: undefined, done: true };
      },
    };
  };

  return {
    get buffer() { return buffer; },
    get offset() { return offset; },
    get offsetHex() { return `0x${offset.toString(16)}`; },
    get forkedOffsets() { return forkedOffsets; },
    get forkedOffsetsHex() { return forkedOffsets.map(x => `0x${x.toString(16)}`); },
    get totalOffset() { return forkedOffsets.reduce((acc, cur) => acc + cur, offset); },
    get totalOffsetHex() { return `0x${(forkedOffsets.reduce((acc, cur) => acc + cur, offset)).toString(16)}`; },
    fork,
    customBytes,
    readLineByLine,
    byte,
    ubyte,
    short,
    ushort,
    int,
    uint,
    string,
    map: {
      byte: mapByte,
      ubyte: mapUbyte,
      short: mapShort,
      ushort: mapUshort,
      int: mapInt,
      uint: mapUint,
      string: mapString,
    },
    boolean: {
      byte: booleanByte,
      ubyte: booleanUbyte,
      short: booleanShort,
      ushort: booleanUshort,
      int: booleanInt,
      uint: booleanUint,
    },
    skip: {
      byte: skipByte,
      ubyte: skipUbyte,
      short: skipShort,
      ushort: skipUshort,
      int: skipInt,
      uint: skipUint,
      custom: skipCustom,
    },
  };
};
export default createReader;
