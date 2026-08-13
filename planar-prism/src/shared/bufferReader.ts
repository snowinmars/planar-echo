import { isNothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

/*
 * I have choice: pick two of the following:
 *   cool syntax like reader.uint()
 *   no fork()
 *   no this
 * The following is a compromise.
 */
const maxInt8 = 127 as const;
const maxUint8 = maxInt8 * 2 + 1;
const maxInt16 = 32767 as const;
const maxUint16 = maxInt16 * 2 + 1;
const maxInt32 = 2147483647 as const;
const maxUint32 = maxInt32 * 2 + 1;
const maxLong64 = 9223372036854775807n as const;
const maxUlong64 = maxLong64 * 2n + 1n;

const int8Bytes = 1;
const int16Bytes = 2;
const int32Bytes = 4;
const int64Bytes = 8;

type ReadNumberFunction = (maxToZero?: boolean) => number;
type ReadBigIntFunction = (maxToZero?: boolean) => bigint;
type ReadNumberMapFunction = <T>(map: BufferReaderNumberMapFunction<T>) => T;
type ReadBigintMapFunction = <T>(map: BufferReaderBigIntMapFunction<T>) => T;
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
type BigIntBucket<T> = Readonly<{
  long: T;
  ulong: T;
}>;
type BufferReaderNumberMapFunction<T> = (x: number) => T;
type BufferReaderBigIntMapFunction<T> = (x: bigint) => T;
type BufferReaderStringMapFunction<T> = (x: string) => T;

export type BufferReader = Readonly<{
  buffer: Buffer;
  offset: number;
  offsetHex: string;
  length: number;
  customBytes: (length: number) => number[];
  fork: (newOffset?: Maybe<number>) => BufferReader;
  blob: (start: number, end?: Maybe<number>) => Buffer;
  readLineByLine: (trim?: boolean, toLower?: boolean, ignoreEmptyLines?: boolean, encoding?: BufferEncoding) => IterableIterator<string>;
  string: (length: number, asIs?: Maybe<boolean>, encoding?: Maybe<BufferEncoding>) => string;
  map: Readonly<{
    string: <T>(length: number, map: BufferReaderStringMapFunction<T>, asIs?: Maybe<boolean>, encoding?: Maybe<BufferEncoding>) => T;
  }> & NumberBucket<ReadNumberMapFunction> & BigIntBucket<ReadBigintMapFunction>;
  boolean: NumberBucket<ReadBooleanFunction> & BigIntBucket<ReadBooleanFunction>;
  skip: Readonly<{
    custom: (bytes: number) => void;
  }> & NumberBucket<ReadSkipFunction> & BigIntBucket<ReadSkipFunction>;
}> & NumberBucket<ReadNumberFunction> & BigIntBucket<ReadBigIntFunction>;

const numberAsBoolean = (x: number, sourceName: Maybe<string> = null): boolean => {
  switch (x) {
    case 0: return false;
    case 1: return true;
    default: throw new Error(`Property '${x}' is out of boolean 0..1 range for '${sourceName ?? 'unspecified source'}'`);
  }
};

const bigintAsBoolean = (x: bigint, sourceName: Maybe<string> = null): boolean => {
  switch (x) {
    case 0n: return false;
    case 1n: return true;
    default: throw new Error(`Property '${x}' is out of boolean 0..1 range for '${sourceName ?? 'unspecified source'}'`);
  }
};

type ReaderView = { _r: BufferReaderImpl };

const mapViewProto = {
  byte<T>(this: ReaderView, map: BufferReaderNumberMapFunction<T>): T { return map(this._r.byte()); },
  ubyte<T>(this: ReaderView, map: BufferReaderNumberMapFunction<T>): T { return map(this._r.ubyte()); },
  short<T>(this: ReaderView, map: BufferReaderNumberMapFunction<T>): T { return map(this._r.short()); },
  ushort<T>(this: ReaderView, map: BufferReaderNumberMapFunction<T>): T { return map(this._r.ushort()); },
  int<T>(this: ReaderView, map: BufferReaderNumberMapFunction<T>): T { return map(this._r.int()); },
  uint<T>(this: ReaderView, map: BufferReaderNumberMapFunction<T>): T { return map(this._r.uint()); },
  long<T>(this: ReaderView, map: BufferReaderBigIntMapFunction<T>): T { return map(this._r.long()); },
  ulong<T>(this: ReaderView, map: BufferReaderBigIntMapFunction<T>): T { return map(this._r.ulong()); },
  string<T>(this: ReaderView, length: number, map: BufferReaderStringMapFunction<T>, asIs: Maybe<boolean> = false, encoding: Maybe<BufferEncoding> = 'utf-8'): T {
    return map(this._r.string(length, asIs, encoding));
  },
};

const booleanViewProto = {
  byte(this: ReaderView, sourceName: Maybe<string> = null): boolean { return numberAsBoolean(this._r.byte(), sourceName); },
  ubyte(this: ReaderView, sourceName: Maybe<string> = null): boolean { return numberAsBoolean(this._r.ubyte(), sourceName); },
  short(this: ReaderView, sourceName: Maybe<string> = null): boolean { return numberAsBoolean(this._r.short(), sourceName); },
  ushort(this: ReaderView, sourceName: Maybe<string> = null): boolean { return numberAsBoolean(this._r.ushort(), sourceName); },
  int(this: ReaderView, sourceName: Maybe<string> = null): boolean { return numberAsBoolean(this._r.int(), sourceName); },
  uint(this: ReaderView, sourceName: Maybe<string> = null): boolean { return numberAsBoolean(this._r.uint(), sourceName); },
  long(this: ReaderView, sourceName: Maybe<string> = null): boolean { return bigintAsBoolean(this._r.long(), sourceName); },
  ulong(this: ReaderView, sourceName: Maybe<string> = null): boolean { return bigintAsBoolean(this._r.ulong(), sourceName); },
};

const skipViewProto = {
  byte(this: ReaderView): void { this._r.skipCustom(int8Bytes); },
  ubyte(this: ReaderView): void { this._r.skipCustom(int8Bytes); },
  short(this: ReaderView): void { this._r.skipCustom(int16Bytes); },
  ushort(this: ReaderView): void { this._r.skipCustom(int16Bytes); },
  int(this: ReaderView): void { this._r.skipCustom(int32Bytes); },
  uint(this: ReaderView): void { this._r.skipCustom(int32Bytes); },
  long(this: ReaderView): void { this._r.skipCustom(int64Bytes); },
  ulong(this: ReaderView): void { this._r.skipCustom(int64Bytes); },
  custom(this: ReaderView, bytes: number): void { this._r.skipCustom(bytes); },
};

class BufferReaderImpl {
  readonly #buffer: Buffer;
  #offset: number;

  readonly map: BufferReader['map'];
  readonly boolean: BufferReader['boolean'];
  readonly skip: BufferReader['skip'];

  constructor(buffer: Buffer, initialOffset: number = 0) {
    this.#buffer = buffer;
    this.#offset = initialOffset;

    const mapView = Object.create(mapViewProto) as ReaderView & BufferReader['map'];
    mapView._r = this;
    this.map = mapView;

    const booleanView = Object.create(booleanViewProto) as ReaderView & BufferReader['boolean'];
    booleanView._r = this;
    this.boolean = booleanView;

    const skipView = Object.create(skipViewProto) as ReaderView & BufferReader['skip'];
    skipView._r = this;
    this.skip = skipView;
  }

  get buffer(): Buffer {
    return this.#buffer;
  }

  get offset(): number {
    return this.#offset;
  }

  get offsetHex(): string {
    return `0x${this.#offset.toString(16)}`;
  }

  get length(): number {
    return this.#buffer.length;
  }

  skipCustom(bytes: number): void {
    this.#offset += bytes;
  }

  byte(maxToZero = false): number {
    const value = this.#buffer.readInt8(this.#offset);
    this.#offset += int8Bytes;
    if (maxToZero && value === maxInt8) return 0;
    return value;
  }

  ubyte(maxToZero = false): number {
    const value = this.#buffer.readUInt8(this.#offset);
    this.#offset += int8Bytes;
    if (maxToZero && value === maxUint8) return 0;
    return value;
  }

  short(maxToZero = false): number {
    const value = this.#buffer.readInt16LE(this.#offset);
    this.#offset += int16Bytes;
    if (maxToZero && value === maxInt16) return 0;
    return value;
  }

  ushort(maxToZero = false): number {
    const value = this.#buffer.readUInt16LE(this.#offset);
    this.#offset += int16Bytes;
    if (maxToZero && value === maxUint16) return 0;
    return value;
  }

  int(maxToZero = false): number {
    const value = this.#buffer.readInt32LE(this.#offset);
    this.#offset += int32Bytes;
    if (maxToZero && value === maxInt32) return 0;
    return value;
  }

  uint(maxToZero = false): number {
    const value = this.#buffer.readUInt32LE(this.#offset);
    this.#offset += int32Bytes;
    if (maxToZero && value === maxUint32) return 0;
    return value;
  }

  long(maxToZero = false): bigint {
    const value = this.#buffer.readBigInt64LE(this.#offset);
    this.#offset += int64Bytes;
    if (maxToZero && value === maxLong64) return 0n;
    return value;
  }

  ulong(maxToZero = false): bigint {
    const value = this.#buffer.readBigUInt64LE(this.#offset);
    this.#offset += int64Bytes;
    if (maxToZero && value === maxUlong64) return 0n;
    return value;
  }

  string(length: number, asIs: Maybe<boolean> = false, encoding: Maybe<BufferEncoding> = 'utf-8'): string {
    const raw = this.#buffer.toString(encoding ?? 'utf-8', this.#offset, this.#offset + length);
    this.#offset += length;
    return asIs ? raw : raw.replace(/\0/g, '').trim().toLowerCase().replaceAll('\r\n', '\n');
  }

  customBytes(length: number): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < length; i++) {
      bytes.push(this.ubyte());
    }
    return bytes;
  }

  fork(newOffset: Maybe<number> = null): BufferReader {
    return new BufferReaderImpl(this.#buffer, newOffset ?? this.#offset);
  }

  blob(start: number, end?: Maybe<number>): Buffer {
    return this.#buffer.subarray(start, isNothing(end) ? undefined : end);
  }

  readLineByLine(trim = true, toLower = true, ignoreEmptyLines = true, encoding: BufferEncoding = 'utf-8'): IterableIterator<string> {
    let initialOffset = this.#offset;
    let currentPos = this.#offset;
    const separator = '\n'.charCodeAt(0);
    const formValue = (x: string): string => {
      let v = x.replace(/\r$/, '');
      if (trim) v = v.trim();
      if (toLower) v = v.toLowerCase();
      return v.replaceAll('\r\n', '\n');
    };

    const self = this; // eslint-disable-line @typescript-eslint/no-this-alias

    return {
      [Symbol.iterator](): IterableIterator<string> {
        return this;
      },

      next(): IteratorResult<string> {
        while (currentPos < self.#buffer.length) {
          if (self.#buffer[currentPos] === separator) {
            const line = self.#buffer.toString(encoding, initialOffset, currentPos);
            initialOffset = currentPos + 1;
            currentPos++;
            self.#offset = currentPos;
            const value = formValue(line);
            if (ignoreEmptyLines && !value) continue;
            return { value, done: false };
          }

          currentPos++;
        }

        if (initialOffset < self.#buffer.length) {
          const line = self.#buffer.toString(encoding, initialOffset, self.#buffer.length);
          initialOffset = self.#buffer.length;
          currentPos = self.#buffer.length;
          self.#offset = self.#buffer.length;
          const value = formValue(line);
          if (!ignoreEmptyLines || value) return { value, done: false };
        }

        return { value: undefined, done: true };
      },
    };
  }
}

export const createReader = (buffer: Buffer, initialOffset: number = 0): BufferReader => new BufferReaderImpl(buffer, initialOffset);

export default createReader;
