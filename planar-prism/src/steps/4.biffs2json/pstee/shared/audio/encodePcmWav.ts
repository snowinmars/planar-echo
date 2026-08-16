/**
 * Mostly llm generated from gemrb/nearinfinity
 */

import type { DecodedPcm } from './decodeAcm.js';

export const encodePcmWav = (pcm: DecodedPcm): Buffer => {
  const blockAlign = pcm.channels * (pcm.bitsPerSample / 8);
  const byteRate = pcm.sampleRate * blockAlign;
  const dataSize = pcm.samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(pcm.channels, 22);
  buffer.writeUInt32LE(pcm.sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(pcm.bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  Buffer.from(pcm.samples.buffer, pcm.samples.byteOffset, dataSize).copy(buffer, 44);
  return buffer;
};
