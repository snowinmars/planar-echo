import 'mocha';
import { expect } from 'chai';
import createReader from './bufferReader.js';

import type { BufferReader } from './bufferReader.js';

const bufferFromBytes = (...bytes: number[]): Buffer => Buffer.from(bytes);

describe('BufferReader', () => {
  describe('ctor', () => {
    it('should create empty instance', () => {
      const reader = createReader(bufferFromBytes(0));

      expect(reader.offset).to.equal(0);
      expect(reader.offsetHex).to.equal('0x0');
      expect(reader.forkedOffsets).to.deep.equal([]);
      expect(reader.forkedOffsetsHex).to.deep.equal([]);
      expect(reader.totalOffset).to.equal(0);
      expect(reader.totalOffsetHex).to.equal('0x0');
    });

    it('sould handle initialOffset properly', () => {
      const reader = createReader(bufferFromBytes(0), 3, [5, 17]);

      expect(reader.offset).to.equal(3);
      expect(reader.offsetHex).to.equal('0x3');
      expect(reader.forkedOffsets).to.deep.equal([5, 17]);
      expect(reader.forkedOffsetsHex).to.deep.equal(['0x5', '0x11']);
      expect(reader.totalOffset).to.equal(3 + 5 + 17);
      expect(reader.totalOffsetHex).to.equal('0x19');
    });
  });

  describe('byte / int8', () => {
    let reader: BufferReader;

    beforeEach(() => {
      reader = createReader(bufferFromBytes(
        0x7f, // 127
        0x1, // 1
        0xff, // -1
        0x80, // -128
      ));
    });

    it('read value', () => {
      expect(reader.byte()).to.equal(127);
      expect(reader.offset).to.equal(1);
    });

    it('read value with maxToZero', () => {
      expect(reader.byte(true)).to.equal(0);
    });

    it('read value without maxToZero', () => {
      reader.byte();
      expect(reader.byte(true)).to.equal(1);
    });

    it('offset increments', () => {
      expect(reader.offset).to.equal(0);

      expect(reader.byte()).to.equal(127);
      expect(reader.offset).to.equal(1);

      expect(reader.byte()).to.equal(1);
      expect(reader.offset).to.equal(2);

      expect(reader.byte()).to.equal(-1);
      expect(reader.offset).to.equal(3);

      expect(reader.byte()).to.equal(-128);
      expect(reader.offset).to.equal(4);
    });

    it('out of range access is forbidden', function () {
      const r = createReader(bufferFromBytes(0));
      r.byte();
      expect(() => r.byte()).to.throw(RangeError);
    });
  });

  describe('ubyte / uint8', function () {
    let reader: BufferReader;

    beforeEach(function () {
      reader = createReader(bufferFromBytes(
        0xff, // 255
        0x1, // 1
        0x0, // 0
        0xfe, // 254
      ));
    });

    it('read value', () => {
      expect(reader.ubyte()).to.equal(255);
      expect(reader.offset).to.equal(1);
    });

    it('read value with maxToZero', () => {
      expect(reader.ubyte(true)).to.equal(0);
    });

    it('read value without maxToZero', () => {
      reader.ubyte();
      expect(reader.ubyte(true)).to.equal(1);
    });

    it('offset increments', () => {
      expect(reader.offset).to.equal(0);

      expect(reader.ubyte()).to.equal(255);
      expect(reader.offset).to.equal(1);

      expect(reader.ubyte()).to.equal(1);
      expect(reader.offset).to.equal(2);

      expect(reader.ubyte()).to.equal(0);
      expect(reader.offset).to.equal(3);

      expect(reader.ubyte()).to.equal(254);
      expect(reader.offset).to.equal(4);
    });

    it('out of range access is forbidden', function () {
      const r = createReader(bufferFromBytes(0));
      r.ubyte();
      expect(() => r.ubyte()).to.throw(RangeError);
    });
  });

  describe('short / int16 LE', () => {
    let reader: BufferReader;

    beforeEach(() => {
      reader = createReader(bufferFromBytes(
        0xff, 0x7f, // 32767
        0x1, 0x0, // 1
        0x0, 0x0, // 0
        0x00, 0x80, // -32768
      ));
    });

    it('read value', () => {
      expect(reader.short()).to.equal(32767);
      expect(reader.offset).to.equal(2);
    });

    it('read value with maxToZero', () => {
      expect(reader.short(true)).to.equal(0);
    });

    it('read value without maxToZero', () => {
      reader.short();
      expect(reader.short(true)).to.equal(1);
    });

    it('offset increments', () => {
      expect(reader.offset).to.equal(0);

      expect(reader.short()).to.equal(32767);
      expect(reader.offset).to.equal(2);

      expect(reader.short()).to.equal(1);
      expect(reader.offset).to.equal(4);

      expect(reader.short()).to.equal(0);
      expect(reader.offset).to.equal(6);

      expect(reader.short()).to.equal(-32768);
      expect(reader.offset).to.equal(8);
    });

    it('out of range access is forbidden', function () {
      const r = createReader(bufferFromBytes(0, 0));
      r.short();
      expect(() => r.short()).to.throw(RangeError);
    });
  });

  describe('ushort / uint16 LE', function () {
    let reader: BufferReader;

    beforeEach(function () {
      reader = createReader(bufferFromBytes(
        0xff, 0xff, // 65535
        0x1, 0x0, // 1
        0x0, 0x0, // 0
        0xfe, 0xff, // 65534
      ));
    });

    it('read value', () => {
      expect(reader.ushort()).to.equal(65535);
      expect(reader.offset).to.equal(2);
    });

    it('read value with maxToZero', () => {
      expect(reader.ubyte(true)).to.equal(0);
    });

    it('read value without maxToZero', () => {
      reader.ushort();
      expect(reader.ubyte(true)).to.equal(1);
    });

    it('offset increments', () => {
      expect(reader.offset).to.equal(0);

      expect(reader.ushort()).to.equal(65535);
      expect(reader.offset).to.equal(2);

      expect(reader.ushort()).to.equal(1);
      expect(reader.offset).to.equal(4);

      expect(reader.ushort()).to.equal(0);
      expect(reader.offset).to.equal(6);

      expect(reader.ushort()).to.equal(65534);
      expect(reader.offset).to.equal(8);
    });

    it('out of range access is forbidden', function () {
      const r = createReader(bufferFromBytes(0, 0));
      r.ushort();
      expect(() => r.ushort()).to.throw(RangeError);
    });
  });

  describe('int / int32 LE', function () {
    let reader: BufferReader;

    beforeEach(function () {
      reader = createReader(bufferFromBytes(
        0xff, 0xff, 0xff, 0x7f, // 2147483647
        0x1, 0x0, 0x0, 0x0, // 1
        0x0, 0x0, 0x0, 0x0, // 0
        0x00, 0x0, 0x0, 0x80, // -2147483648
      ));
    });

    it('read value', () => {
      expect(reader.int()).to.equal(2147483647);
      expect(reader.offset).to.equal(4);
    });

    it('read value with maxToZero', () => {
      expect(reader.int(true)).to.equal(0);
    });

    it('read value without maxToZero', () => {
      reader.int();
      expect(reader.int(true)).to.equal(1);
    });

    it('offset increments', () => {
      expect(reader.offset).to.equal(0);

      expect(reader.int()).to.equal(2147483647);
      expect(reader.offset).to.equal(4);

      expect(reader.int()).to.equal(1);
      expect(reader.offset).to.equal(8);

      expect(reader.int()).to.equal(0);
      expect(reader.offset).to.equal(12);

      expect(reader.int()).to.equal(-2147483648);
      expect(reader.offset).to.equal(16);
    });

    it('out of range access is forbidden', function () {
      const r = createReader(bufferFromBytes(0, 0, 0, 0));
      r.int();
      expect(() => r.int()).to.throw(RangeError);
    });
  });

  describe('uint / uint32 LE', function () {
    let reader: BufferReader;

    beforeEach(function () {
      reader = createReader(bufferFromBytes(
        0xff, 0xff, 0xff, 0xff, // 4294967295
        0x1, 0x0, 0x0, 0x0, // 1
        0x0, 0x0, 0x0, 0x0, // 0
        0xfe, 0xff, 0xff, 0xff, // 4294967294
      ));
    });

    it('read value', () => {
      expect(reader.uint()).to.equal(4294967295);
      expect(reader.offset).to.equal(4);
    });

    it('read value with maxToZero', () => {
      expect(reader.uint(true)).to.equal(0);
    });

    it('read value without maxToZero', () => {
      reader.uint();
      expect(reader.uint(true)).to.equal(1);
    });

    it('offset increments', () => {
      expect(reader.offset).to.equal(0);

      expect(reader.uint()).to.equal(4294967295);
      expect(reader.offset).to.equal(4);

      expect(reader.uint()).to.equal(1);
      expect(reader.offset).to.equal(8);

      expect(reader.uint()).to.equal(0);
      expect(reader.offset).to.equal(12);

      expect(reader.uint()).to.equal(4294967294);
      expect(reader.offset).to.equal(16);
    });

    it('out of range access is forbidden', function () {
      const r = createReader(bufferFromBytes(0, 0, 0, 0));
      r.uint();
      expect(() => r.uint()).to.throw(RangeError);
    });
  });

  describe('skip', function () {
    let reader: BufferReader;
    beforeEach(function () {
      reader = createReader(bufferFromBytes(...Array.from({ length: 32 }, (_, i) => i)));
    });

    it('byte should shift by 1', function () {
      reader.skip.byte();
      expect(reader.offset).to.equal(1);
    });

    it('ubyte should shift by 1', function () {
      reader.skip.ubyte();
      expect(reader.offset).to.equal(1);
    });

    it('short should shift by 2', function () {
      reader.skip.short();
      expect(reader.offset).to.equal(2);
    });

    it('ushort should shift by 2', function () {
      reader.skip.ushort();
      expect(reader.offset).to.equal(2);
    });

    it('int should shift by 4', function () {
      reader.skip.int();
      expect(reader.offset).to.equal(4);
    });

    it('uint should shift by 4', function () {
      reader.skip.uint();
      expect(reader.offset).to.equal(4);
    });

    it('custom should shift by N', function () {
      reader.skip.custom(7);
      expect(reader.offset).to.equal(7);
    });

    it('combined case', () => {
      expect(reader.offset).to.equal(0);

      reader.skip.byte();
      expect(reader.offset).to.equal(1);

      reader.skip.short();
      expect(reader.offset).to.equal(3);

      reader.skip.int();
      expect(reader.offset).to.equal(7);

      reader.skip.ubyte();
      expect(reader.offset).to.equal(8);

      reader.skip.ushort();
      expect(reader.offset).to.equal(10);

      reader.skip.uint();
      expect(reader.offset).to.equal(14);

      reader.skip.custom(7);
      expect(reader.offset).to.equal(21);
    });
  });

  describe('string', function () {
    let buffer: Buffer<ArrayBuffer>;
    let reader: BufferReader;

    beforeEach(() => {
      buffer = Buffer.from('  ПриВет\0\r\nWorld  ', 'utf-8');
      reader = createReader(buffer);
    });

    it('read value without asIs', function () {
      const s = reader.string(buffer.length, false, 'utf-8');
      expect(s).to.equal('привет\nworld');
      expect(reader.offset).to.equal(buffer.length);
    });

    it('read value with asIs', function () {
      const s = reader.string(buffer.length, true, 'utf-8');
      expect(s).to.equal('  ПриВет\r\nWorld  ');
      expect(reader.offset).to.equal(buffer.length);
    });

    it('read empty value', function () {
      const s = reader.string(0, true, 'ascii');
      expect(s).to.equal('');
      expect(reader.offset).to.equal(0);
    });
  });

  describe('map', function () {
    let reader: BufferReader;

    beforeEach(() => {
      reader = createReader(bufferFromBytes(
        0x01, 0x80, 0x0, 0x0,
        0x1, 0x0, 0x0, 0x0,
        0x0, 0x0, 0x0, 0x0,
        0x0, 0x0, 0x0, 0x80,
      ));
    });

    it('read byte value', function () {
      expect(reader.map.byte(x => x)).to.equal(1);
      expect(reader.offset).to.equal(1);

      expect(reader.map.byte(x => x)).to.equal(-128);
      expect(reader.offset).to.equal(2);

      expect(reader.map.byte(x => x)).to.equal(0);
      expect(reader.offset).to.equal(3);

      expect(reader.map.byte(x => x)).to.equal(0);
      expect(reader.offset).to.equal(4);
    });

    it('read ubyte value', function () {
      expect(reader.map.ubyte(x => x)).to.equal(1);
      expect(reader.offset).to.equal(1);

      expect(reader.map.ubyte(x => x)).to.equal(128);
      expect(reader.offset).to.equal(2);

      expect(reader.map.ubyte(x => x)).to.equal(0);
      expect(reader.offset).to.equal(3);

      expect(reader.map.ubyte(x => x)).to.equal(0);
      expect(reader.offset).to.equal(4);
    });

    it('read short value', function () {
      expect(reader.map.short(x => x)).to.equal(-32767);
      expect(reader.offset).to.equal(2);

      expect(reader.map.short(x => x)).to.equal(0);
      expect(reader.offset).to.equal(4);

      expect(reader.map.short(x => x)).to.equal(1);
      expect(reader.offset).to.equal(6);

      expect(reader.map.short(x => x)).to.equal(0);
      expect(reader.offset).to.equal(8);
    });

    it('read ushort value', function () {
      expect(reader.map.ushort(x => x)).to.equal(32769);
      expect(reader.offset).to.equal(2);

      expect(reader.map.ushort(x => x)).to.equal(0);
      expect(reader.offset).to.equal(4);

      expect(reader.map.ushort(x => x)).to.equal(1);
      expect(reader.offset).to.equal(6);

      expect(reader.map.ushort(x => x)).to.equal(0);
      expect(reader.offset).to.equal(8);
    });

    it('read int value', function () {
      expect(reader.map.int(x => x)).to.equal(32769);
      expect(reader.offset).to.equal(4);

      expect(reader.map.int(x => x)).to.equal(1);
      expect(reader.offset).to.equal(8);

      expect(reader.map.int(x => x)).to.equal(0);
      expect(reader.offset).to.equal(12);

      expect(reader.map.int(x => x)).to.equal(-2147483648);
      expect(reader.offset).to.equal(16);
    });

    it('read uint value', function () {
      expect(reader.map.uint(x => x)).to.equal(32769);
      expect(reader.offset).to.equal(4);

      expect(reader.map.uint(x => x)).to.equal(1);
      expect(reader.offset).to.equal(8);

      expect(reader.map.uint(x => x)).to.equal(0);
      expect(reader.offset).to.equal(12);

      expect(reader.map.uint(x => x)).to.equal(2147483648);
      expect(reader.offset).to.equal(16);
    });
  });

  describe('boolean', function () {
    it('read byte value', function () {
      const reader = createReader(bufferFromBytes(
        0x0,
        0x1,
        0x2,
      ));

      expect(reader.boolean.byte()).to.equal(false);
      expect(reader.offset).to.equal(1);

      expect(reader.boolean.byte()).to.equal(true);
      expect(reader.offset).to.equal(2);

      expect(() => reader.boolean.byte()).to.throw();
    });

    it('read ubyte value', function () {
      const reader = createReader(bufferFromBytes(
        0x0,
        0x1,
        0x2,
      ));

      expect(reader.boolean.ubyte()).to.equal(false);
      expect(reader.offset).to.equal(1);

      expect(reader.boolean.ubyte()).to.equal(true);
      expect(reader.offset).to.equal(2);

      expect(() => reader.boolean.ubyte()).to.throw();
    });

    it('read short value', function () {
      const reader = createReader(bufferFromBytes(
        0x0, 0x0,
        0x1, 0x0,
        0x2, 0x0,
      ));

      expect(reader.boolean.short()).to.equal(false);
      expect(reader.offset).to.equal(2);

      expect(reader.boolean.short()).to.equal(true);
      expect(reader.offset).to.equal(4);

      expect(() => reader.boolean.short()).to.throw();
    });

    it('read ushort value', function () {
      const reader = createReader(bufferFromBytes(
        0x0, 0x0,
        0x1, 0x0,
        0x2, 0x0,
      ));

      expect(reader.boolean.ushort()).to.equal(false);
      expect(reader.offset).to.equal(2);

      expect(reader.boolean.ushort()).to.equal(true);
      expect(reader.offset).to.equal(4);

      expect(() => reader.boolean.ushort()).to.throw();
    });

    it('read int value', function () {
      const reader = createReader(bufferFromBytes(
        0x0, 0x0, 0x0, 0x0,
        0x1, 0x0, 0x0, 0x0,
        0x2, 0x0, 0x0, 0x0,
      ));

      expect(reader.boolean.int()).to.equal(false);
      expect(reader.offset).to.equal(4);

      expect(reader.boolean.int()).to.equal(true);
      expect(reader.offset).to.equal(8);

      expect(() => reader.boolean.int()).to.throw();
    });

    it('read uint value', function () {
      const reader = createReader(bufferFromBytes(
        0x0, 0x0, 0x0, 0x0,
        0x1, 0x0, 0x0, 0x0,
        0x2, 0x0, 0x0, 0x0,
      ));

      expect(reader.boolean.uint()).to.equal(false);
      expect(reader.offset).to.equal(4);

      expect(reader.boolean.uint()).to.equal(true);
      expect(reader.offset).to.equal(8);

      expect(() => reader.boolean.uint()).to.throw();
    });

    it('разные типы (short, int) корректно работают', function () {
      const buf = Buffer.alloc(2);

      buf.writeInt16LE(1, 0);
      const r = createReader(buf);
      expect(r.boolean.short()).to.equal(true);
    });
  });

  describe('customBytes', function () {
    it('read value', function () {
      const reader = createReader(bufferFromBytes(
        0x7F, // 127
        0xFF, // -1
        0x80, // -128
      ));
      const bytes = reader.customBytes(3);
      expect(bytes).to.deep.equal([127, -1, -128]);
      expect(reader.offset).to.equal(3);
    });
  });

  describe('fork', function () {
    it('offset', function () {
      const buf = bufferFromBytes(1, 2, 3);
      const parent = createReader(buf);
      parent.byte(); // parent offset = 1
      const child = parent.fork();

      expect(child.buffer).to.equal(buf);
      expect(parent.offset).to.equal(1);
      expect(child.offset).to.equal(1);
      expect(parent.forkedOffsets).to.deep.equal([]);
      expect(child.forkedOffsets).to.deep.equal([1]);

      expect(parent.byte()).to.equal(2);
      expect(parent.offset).to.equal(2);
      expect(child.offset).to.equal(1);

      expect(child.byte()).to.equal(2);
      expect(parent.offset).to.equal(2);
      expect(child.offset).to.equal(2);
    });

    it('newOffset', function () {
      const buf = bufferFromBytes(1, 2, 3);
      const parent = createReader(buf);
      parent.byte(); // parent offset = 1
      const child = parent.fork(2);

      expect(child.buffer).to.equal(buf);
      expect(parent.offset).to.equal(1);
      expect(child.offset).to.equal(2);
      expect(parent.forkedOffsets).to.deep.equal([]);
      expect(child.forkedOffsets).to.deep.equal([2]);

      expect(parent.byte()).to.equal(2);
      expect(parent.offset).to.equal(2);
      expect(child.offset).to.equal(2);

      expect(child.byte()).to.equal(3);
      expect(parent.offset).to.equal(2);
      expect(child.offset).to.equal(3);
    });
  });

  describe('readLineByLine', function () {
    it('read value with linux newline end', function () {
      const buf = Buffer.from('  Hello\n  WORLD\n', 'ascii');
      const reader = createReader(buf);
      const lines = Array.from(reader.readLineByLine(true, true, true, 'ascii'));

      expect(lines).to.deep.equal(['hello', 'world']);
      expect(reader.offset).to.equal(buf.length);
    });

    it('read value without linux newline end', function () {
      const buf = Buffer.from('  Hello\n  WORLD ', 'ascii');
      const reader = createReader(buf);
      const lines = Array.from(reader.readLineByLine(true, true, true, 'ascii'));

      expect(lines).to.deep.equal(['hello', 'world']);
      expect(reader.offset).to.equal(buf.length);
    });

    it('read value with windows newline end', function () {
      const buf = Buffer.from('  Hello\r\n  WORLD\r\n', 'ascii');
      const reader = createReader(buf);
      const lines = Array.from(reader.readLineByLine(true, true, true, 'ascii'));

      expect(lines).to.deep.equal(['hello', 'world']);
      expect(reader.offset).to.equal(buf.length);
    });

    it('read value without windows newline end', function () {
      const buf = Buffer.from('  Hello\r\n  WORLD ', 'ascii');
      const reader = createReader(buf);
      const lines = Array.from(reader.readLineByLine(true, true, true, 'ascii'));

      expect(lines).to.deep.equal(['hello', 'world']);
      expect(reader.offset).to.equal(buf.length);
    });

    describe('readLineByLine with all flag combinations', () => {
      // trim_toLower_ignoreEmpty
      const expectedOutputs: Record<string, string[]> = {
        true_true_true: ['hello', 'world'],
        true_true_false: ['', '', 'hello', '', '', '', 'world', ''],
        true_false_true: ['Hello', 'WORLD'],
        true_false_false: ['', '', 'Hello', '', '', '', 'WORLD', ''],
        false_true_true: ['  ', ' hello ', ' ', ' world '],
        false_true_false: ['  ', '', ' hello ', '', ' ', '', ' world ', ''],
        false_false_true: ['  ', ' Hello ', ' ', ' WORLD '],
        false_false_false: ['  ', '', ' Hello ', '', ' ', '', ' WORLD ', ''],
      };

      Object.entries(expectedOutputs).forEach(([key, expected]) => {
        const [trim, toLower, ignoreEmpty] = key.split('_').map(s => s === 'true');

        it(`trim=${trim}, toLower=${toLower}, ignoreEmpty=${ignoreEmpty}`, () => {
          const reader = createReader(Buffer.from('  \n\n Hello \n\n \n\n WORLD \n\n', 'ascii'));
          const lines = Array.from(reader.readLineByLine(trim, toLower, ignoreEmpty, 'ascii'));
          expect(lines).to.deep.equal(expected);
        });
      });
    });
  });
});
