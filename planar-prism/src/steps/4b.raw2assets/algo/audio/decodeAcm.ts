/**
 * Mostly llm generated from gemrb/nearinfinity
 */

import type { DecodedPcm } from './decodeAcm.types.js';

const ID_ACM = 0x01032897;

// TODO [snow]: what are these keys and can I publish them?
const TABLE1 = new Int8Array([
  0, 1, 2, 4, 5, 6, 8, 9, 10, 16, 17, 18, 20, 21, 22, 24, 25, 26,
  32, 33, 34, 36, 37, 38, 40, 41, 42, 0, 1, 2, 4, 5,
]);
const TABLE2 = new Int16Array([
  0, 1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26,
  27, 28, 32, 33, 34, 35, 36, 64, 65, 66, 67, 68, 72, 73, 74, 75, 76, 80, 81, 82, 83, 84, 88, 89, 90, 91, 92, 96,
  97, 98, 99, 100, 128, 129, 130, 131, 132, 136, 137, 138, 139, 140, 144, 145, 146, 147, 148, 152, 153, 154, 155,
  156, 160, 161, 162, 163, 164, 192, 193, 194, 195, 196, 200, 201, 202, 203, 204, 208, 209, 210, 211, 212, 216,
  217, 218, 219, 220, 224, 225, 226, 227, 228, 256, 257, 258, 259, 260, 264, 265, 266, 267, 268, 272, 273, 274,
  275, 276, 280, 281, 282, 283, 284, 288, 289, 290, 291, 292, 0, 1, 2,
]);
const TABLE3 = new Int16Array([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
  0x0A, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25,
  0x26, 0x27, 0x28, 0x29, 0x2A, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x40, 0x41,
  0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
  0x59, 0x5A, 0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x70, 0x71, 0x72, 0x73, 0x74,
  0x75, 0x76, 0x77, 0x78, 0x79, 0x7A, 0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x90,
  0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7,
  0xA8, 0xA9, 0xAA, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
]);

class ValueUnpacker {
  readonly #src: Buffer;
  #srcOfs: number;
  #nextBits = 0;
  #availBits = 0;
  readonly #subBlocks: number;
  readonly #sbSize: number;
  readonly #amp: Int16Array;
  readonly #middle: number;
  #block: Int32Array = new Int32Array(0);
  #blockOfs = 0;

  constructor(levels: number, subBlocks: number, src: Buffer, srcOfs: number) {
    this.#src = src;
    this.#srcOfs = srcOfs;
    this.#subBlocks = subBlocks;
    this.#sbSize = 1 << levels;
    this.#amp = new Int16Array(0x10000);
    this.#middle = 0x8000;
  }

  getOneBlock(block: Int32Array): void {
    this.#block = block;
    this.#blockOfs = 0;
    const pwr = this.#getBits(4) & 0x0f;
    const val = this.#getBits(16) & 0xffff;
    const count = 1 << pwr;

    let v = 0;
    for (let i = 0; i < count; i++) {
      this.#amp[this.#middle + i] = v;
      v = v + val;
    }

    v = -val;
    for (let i = 0; i < count; i++) {
      this.#amp[this.#middle - i - 1] = v;
      v = v - val;
    }

    for (let pass = 0; pass < this.#sbSize; pass++) {
      const idx = this.#getBits(5) & 0x1f;
      if (this.#filler(idx, pass) === 0) return;
    }
  }

  #put(i: number, pass: number, value: number): void {
    this.#block[this.#blockOfs + i * this.#sbSize + pass] = value;
  }

  #ampAt(delta: number): number {
    return this.#amp[this.#middle + delta] ?? 0;
  }

  #filler(fn: number, pass: number): number {
    switch (fn & 31) {
      case 0: return this.#zeroFill(pass);
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
        return this.#linearFill(pass, fn);
      case 17: return this.#k1Bits3(pass);
      case 18: return this.#k1Bits2(pass);
      case 19: return this.#t1Bits5(pass);
      case 20: return this.#k2Bits4(pass);
      case 21: return this.#k2Bits3(pass);
      case 22: return this.#t2Bits7(pass);
      case 23: return this.#k3Bits5(pass);
      case 24: return this.#k3Bits4(pass);
      case 26: return this.#k4Bits5(pass);
      case 27: return this.#k4Bits4(pass);
      case 29: return this.#t3Bits7(pass);
      default: return 0;
    }
  }

  #zeroFill(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) this.#put(i, pass, 0);
    return 1;
  }

  #linearFill(pass: number, idx: number): number {
    const mask = (1 << idx) - 1;
    const base = this.#middle - (1 << (idx - 1));

    for (let i = 0; i < this.#subBlocks; i++) this.#put(i, pass, this.#amp[base + (this.#getBits(idx) & mask)] ?? 0);

    return 1;
  }

  #k1Bits3(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(3);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
        i++;
        if (i === this.#subBlocks) break;
        this.#put(i, pass, 0);
      }
      else if ((this.#nextBits & 2) === 0) {
        this.#availBits -= 2;
        this.#nextBits >>>= 2;
        this.#put(i, pass, 0);
      }
      else {
        this.#put(i, pass, this.#ampAt((this.#nextBits & 4) !== 0 ? 1 : -1));
        this.#availBits -= 3;
        this.#nextBits >>>= 3;
      }
    }

    return 1;
  }

  #k1Bits2(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(2);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
      }
      else {
        this.#put(i, pass, this.#ampAt((this.#nextBits & 2) !== 0 ? 1 : -1));
        this.#availBits -= 2;
        this.#nextBits >>>= 2;
      }
    }
    return 1;
  }

  #t1Bits5(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      let val = TABLE1[this.#getBits(5) & 0x1f] ?? 0;
      this.#put(i, pass, this.#ampAt((val & 3) - 1));
      i++;

      if (i === this.#subBlocks) break;

      val >>= 2;
      this.#put(i, pass, this.#ampAt((val & 3) - 1));
      i++;

      if (i === this.#subBlocks) break;

      val >>= 2;
      this.#put(i, pass, this.#ampAt(val - 1));
    }

    return 1;
  }

  #k2Bits4(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(4);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
        i++;

        if (i === this.#subBlocks) break;

        this.#put(i, pass, 0);
      }
      else if ((this.#nextBits & 2) === 0) {
        this.#availBits -= 2;
        this.#nextBits >>>= 2;
        this.#put(i, pass, 0);
      }
      else {
        this.#put(i, pass, (this.#nextBits & 8) !== 0
          ? this.#ampAt((this.#nextBits & 4) !== 0 ? 2 : 1)
          : this.#ampAt((this.#nextBits & 4) !== 0 ? -1 : -2));
        this.#availBits -= 4;
        this.#nextBits >>>= 4;
      }
    }

    return 1;
  }

  #k2Bits3(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(3);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
      }
      else {
        this.#put(i, pass, (this.#nextBits & 4) !== 0
          ? this.#ampAt((this.#nextBits & 2) !== 0 ? 2 : 1)
          : this.#ampAt((this.#nextBits & 2) !== 0 ? -1 : -2));
        this.#availBits -= 3;
        this.#nextBits >>>= 3;
      }
    }

    return 1;
  }

  #t2Bits7(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      let val = TABLE2[this.#getBits(7) & 0x7f] ?? 0;
      this.#put(i, pass, this.#ampAt((val & 7) - 2));
      i++;

      if (i === this.#subBlocks) break;

      val >>= 3;
      this.#put(i, pass, this.#ampAt((val & 7) - 2));
      i++;

      if (i === this.#subBlocks) break;

      val >>= 3;
      this.#put(i, pass, this.#ampAt(val - 2));
    }
    return 1;
  }

  #k3Bits5(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(5);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
        i++;

        if (i === this.#subBlocks) break;

        this.#put(i, pass, 0);
      }
      else if ((this.#nextBits & 2) === 0) {
        this.#availBits -= 2;
        this.#nextBits >>>= 2;
        this.#put(i, pass, 0);
      }
      else if ((this.#nextBits & 4) === 0) {
        this.#put(i, pass, this.#ampAt((this.#nextBits & 8) !== 0 ? 1 : -1));
        this.#availBits -= 4;
        this.#nextBits >>>= 4;
      }
      else {
        this.#availBits -= 5;
        let val = (this.#nextBits & 0x18) >> 3;
        this.#nextBits >>>= 5;
        if (val >= 2) val = val + 3;
        this.#put(i, pass, this.#ampAt(val - 3));
      }
    }
    return 1;
  }

  #k3Bits4(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(4);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
      }
      else if ((this.#nextBits & 2) === 0) {
        this.#availBits -= 3;
        this.#put(i, pass, this.#ampAt((this.#nextBits & 4) !== 0 ? 1 : -1));
        this.#nextBits >>>= 3;
      }
      else {
        let val = (this.#nextBits & 0x0c) >> 2;
        this.#availBits -= 4;
        this.#nextBits >>>= 4;
        if (val >= 2) val = val + 3;
        this.#put(i, pass, this.#ampAt(val - 3));
      }
    }
    return 1;
  }

  #k4Bits5(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(5);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
        i++;

        if (i === this.#subBlocks) break;

        this.#put(i, pass, 0);
      }
      else if ((this.#nextBits & 2) === 0) {
        this.#availBits -= 2;
        this.#nextBits >>>= 2;
        this.#put(i, pass, 0);
      }
      else {
        let val = (this.#nextBits & 0x1c) >> 2;
        if (val >= 4) val = val + 1;
        this.#put(i, pass, this.#ampAt(val - 4));
        this.#availBits -= 5;
        this.#nextBits >>>= 5;
      }
    }
    return 1;
  }

  #k4Bits4(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      this.#prepareBits(4);

      if ((this.#nextBits & 1) === 0) {
        this.#availBits--;
        this.#nextBits >>>= 1;
        this.#put(i, pass, 0);
      }
      else {
        let val = (this.#nextBits & 0x0e) >> 1;
        this.#availBits -= 4;
        this.#nextBits >>>= 4;
        if (val >= 4) val = val + 1;
        this.#put(i, pass, this.#ampAt(val - 4));
      }
    }
    return 1;
  }

  #t3Bits7(pass: number): number {
    for (let i = 0; i < this.#subBlocks; i++) {
      let val = TABLE3[this.#getBits(7) & 0x7f] ?? 0;
      this.#put(i, pass, this.#ampAt((val & 0x0f) - 5));
      i++;

      if (i === this.#subBlocks) break;

      val >>= 4;
      this.#put(i, pass, this.#ampAt(val - 5));
    }
    return 1;
  }

  #prepareBits(bits: number): void {
    while (bits > this.#availBits) {
      const oneByte = this.#srcOfs < this.#src.length ? this.#src[this.#srcOfs]! : 0;
      this.#srcOfs = this.#srcOfs + 1;
      this.#nextBits |= oneByte << this.#availBits;
      this.#availBits = this.#availBits + 8;
    }
  }

  #getBits(bits: number): number {
    this.#prepareBits(bits);
    const res = this.#nextBits;
    this.#availBits = this.#availBits - bits;
    this.#nextBits >>>= bits;
    return res;
  }
}

class SubbandDecoder {
  readonly #levels: number;
  readonly #blockSize: number;
  readonly #mem: Int32Array;

  constructor(levels: number) {
    this.#levels = levels;
    this.#blockSize = 1 << levels;
    const memSize = levels === 0 ? 0 : 3 * (this.#blockSize >> 1) - 2;
    this.#mem = new Int32Array(Math.max(memSize, 0));
  }

  decode(buffer: Int32Array, blocks: number): void {
    if (this.#levels === 0) return;

    let memOfs = 0;
    let sbSize = this.#blockSize >> 1;
    blocks = blocks << 1;
    this.#sub4d3fcc(memOfs, buffer, sbSize, blocks);
    memOfs = memOfs + sbSize;

    for (let i = 0; i < blocks; i++) buffer[i * sbSize] = (buffer[i * sbSize] ?? 0) + 1;

    sbSize = sbSize >> 1;
    blocks = blocks << 1;
    while (sbSize !== 0) {
      this.#sub4d420c(memOfs, buffer, sbSize, blocks);
      memOfs = memOfs + (sbSize << 1);
      sbSize = sbSize >> 1;
      blocks = blocks << 1;
    }
  }

  #sub4d3fcc(memOfs: number, buf: Int32Array, sbSize: number, blocks: number): void {
    const mem16 = new Int16Array(this.#mem.buffer);
    const sb2 = sbSize * 2;
    const sb3 = sbSize * 3;
    let m = memOfs * 2;

    if (blocks === 2) {
      for (let i = 0; i < sbSize; i++) {
        const row0 = buf[i] ?? 0;
        const row1 = buf[i + sbSize] ?? 0;
        const s0 = mem16[m] ?? 0;
        const s1 = mem16[m + 1] ?? 0;
        buf[i] = s0 + (s1 << 1) + row0;
        buf[i + sbSize] = (row0 << 1) - s1 - row1;
        mem16[m] = row0;
        mem16[m + 1] = row1;
        m = m + 2;
      }

      return;
    }

    if (blocks === 4) {
      for (let i = 0; i < sbSize; i++) {
        const row0 = buf[i] ?? 0;
        const row1 = buf[i + sbSize] ?? 0;
        const row2 = buf[i + sb2] ?? 0;
        const row3 = buf[i + sb3] ?? 0;
        const s0 = mem16[m] ?? 0;
        const s1 = mem16[m + 1] ?? 0;
        buf[i] = s0 + (s1 << 1) + row0;
        buf[i + sbSize] = -s1 + (row0 << 1) - row1;
        buf[i + sb2] = row0 + (row1 << 1) + row2;
        buf[i + sb3] = -row1 + (row2 << 1) - row3;
        mem16[m] = row2;
        mem16[m + 1] = row3;
        m = m + 2;
      }

      return;
    }

    for (let i = 0; i < sbSize; i++) {
      let bufOfs = i;
      let db0: number;
      let db1: number;
      let row2 = 0;
      let row3 = 0;

      if ((blocks & 2) !== 0) {
        const row0 = buf[bufOfs] ?? 0;
        const row1 = buf[bufOfs + sbSize] ?? 0;
        const s0 = mem16[m] ?? 0;
        const s1 = mem16[m + 1] ?? 0;
        buf[bufOfs] = s0 + (s1 << 1) + row0;
        buf[bufOfs + sbSize] = -s1 + (row0 << 1) - row1;
        bufOfs = bufOfs + sb2;
        db0 = row0;
        db1 = row1;
      }
      else {
        db0 = mem16[m] ?? 0;
        db1 = mem16[m + 1] ?? 0;
      }

      for (let j = 0; j < (blocks >> 2); j++) {
        const row0 = buf[bufOfs] ?? 0;
        buf[bufOfs] = db0 + (db1 << 1) + row0;
        bufOfs = bufOfs + sbSize;
        const row1 = buf[bufOfs] ?? 0;
        buf[bufOfs] = -db1 + (row0 << 1) - row1;
        bufOfs = bufOfs + sbSize;
        row2 = buf[bufOfs] ?? 0;
        buf[bufOfs] = row0 + (row1 << 1) + row2;
        bufOfs = bufOfs + sbSize;
        row3 = buf[bufOfs] ?? 0;
        buf[bufOfs] = -row1 + (row2 << 1) - row3;
        bufOfs = bufOfs + sbSize;
        db0 = row2;
        db1 = row3;
      }

      mem16[m] = row2;
      mem16[m + 1] = row3;
      m = m + 2;
    }
  }

  #sub4d420c(memOfs: number, buf: Int32Array, sbSize: number, blocks: number): void {
    const sb2 = sbSize * 2;
    const sb3 = sbSize * 3;
    let m = memOfs;

    if (blocks === 4) {
      for (let i = 0; i < sbSize; i++) {
        const row0 = buf[i] ?? 0;
        const row1 = buf[i + sbSize] ?? 0;
        const row2 = buf[i + sb2] ?? 0;
        const row3 = buf[i + sb3] ?? 0;
        const s0 = this.#mem[m] ?? 0;
        const s1 = this.#mem[m + 1] ?? 0;
        buf[i] = s0 + (s1 << 1) + row0;
        buf[i + sbSize] = -s1 + (row0 << 1) - row1;
        buf[i + sb2] = row0 + (row1 << 1) + row2;
        buf[i + sb3] = -row1 + (row2 << 1) - row3;
        this.#mem[m] = row2;
        this.#mem[m + 1] = row3;
        m = m + 2;
      }

      return;
    }

    for (let i = 0; i < sbSize; i++) {
      let bufOfs = i;
      let db0 = this.#mem[m] ?? 0;
      let db1 = this.#mem[m + 1] ?? 0;
      let row2 = 0;
      let row3 = 0;

      for (let j = 0; j < (blocks >> 2); j++) {
        const row0 = buf[bufOfs] ?? 0;
        buf[bufOfs] = db0 + (db1 << 1) + row0;
        bufOfs = bufOfs + sbSize;
        const row1 = buf[bufOfs] ?? 0;
        buf[bufOfs] = -db1 + (row0 << 1) - row1;
        bufOfs = bufOfs + sbSize;
        row2 = buf[bufOfs] ?? 0;
        buf[bufOfs] = row0 + (row1 << 1) + row2;
        bufOfs = bufOfs + sbSize;
        row3 = buf[bufOfs] ?? 0;
        buf[bufOfs] = -row1 + (row2 << 1) - row3;
        bufOfs = bufOfs + sbSize;
        db0 = row2;
        db1 = row3;
      }

      this.#mem[m] = row2;
      this.#mem[m + 1] = row3;
      m = m + 2;
    }
  }
}

export const decodeAcm = (buffer: Buffer, offset = 0): DecodedPcm => {
  if (offset + 14 > buffer.length) throw new Error('ACM buffer too small');

  const signature = buffer.readUInt32LE(offset);
  const numSamples = buffer.readInt32LE(offset + 4);
  const channels = buffer.readUInt16LE(offset + 8);
  const sampleRate = buffer.readUInt16LE(offset + 10);
  const packed = buffer.readUInt16LE(offset + 12);
  const levels = packed & 0x0f;
  const subBlocks = packed >>> 4;

  if (signature !== ID_ACM) throw new Error(`Invalid ACM header signature '${signature.toString(16)}'`);
  if (numSamples < 0) throw new Error(`Invalid ACM sample count '${numSamples}'`);
  if (channels < 1 || channels > 2) throw new Error(`Unsupported ACM channels '${channels}'`);
  if (sampleRate < 4096 || sampleRate > 192000) throw new Error(`Unsupported ACM sample rate '${sampleRate}'`);

  const blockSize = (1 << levels) * subBlocks;
  const block = new Int32Array(blockSize);
  const unpacker = new ValueUnpacker(levels, subBlocks, buffer, offset + 14);
  const decoder = new SubbandDecoder(levels);
  const samples = new Int16Array(numSamples);
  let samplesLeft = numSamples;
  let samplesReady = 0;
  let valuesOfs = 0;
  let out = 0;

  const makeNewSamples = (): void => {
    unpacker.getOneBlock(block);
    decoder.decode(block, subBlocks);
    valuesOfs = 0;
    samplesReady = Math.min(blockSize, samplesLeft);
    samplesLeft = samplesLeft - samplesReady;
  };

  while (out < numSamples) {
    if (samplesReady === 0) {
      if (samplesLeft === 0) break;
      makeNewSamples();
    }
    samples[out] = block[valuesOfs]! >> levels;
    valuesOfs = valuesOfs + 1;
    out = out + 1;
    samplesReady = samplesReady - 1;
  }

  return {
    samples,
    sampleCount: numSamples,
    channels,
    sampleRate,
    bitsPerSample: 16,
  };
};
