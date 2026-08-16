/**
 * Mostly llm generated from gemrb/nearinfinity
 */

import { decodeAcm } from './decodeAcm.js';
import { decodeOgg } from './decodeOgg.js';
import { encodePcmWav } from './encodePcmWav.js';

import type { DecodedPcm } from './decodeAcm.js';

export const ID_ACM = 0x01032897;

export type AudioContainer = 'wavc' | 'acm' | 'pcm' | 'ogg';

export const detectAudioContainer = (buffer: Buffer): AudioContainer => {
  if (buffer.length >= 4) {
    const ascii = buffer.subarray(0, 4).toString('ascii');
    if (ascii === 'WAVC') return 'wavc';
    if (ascii === 'OggS') return 'ogg';
    if (ascii === 'RIFF') return 'pcm';
  }

  if (buffer.length >= 4 && buffer.readUInt32LE(0) === ID_ACM) return 'acm';

  throw new Error('Unknown audio container signature');
};

const decodePcmRiff = (buffer: Buffer, resourceName: string): DecodedPcm => {
  if (buffer.subarray(8, 12).toString('ascii') !== 'WAVE') throw new Error(`RIFF is not WAVE for resource '${resourceName}'`);

  let offset = 12;
  let channels = 1;
  let sampleRate = 22050;
  let bitsPerSample = 16;
  let audioFormat = 1;
  let data: Buffer | undefined;

  while (offset + 8 <= buffer.length) {
    const id = buffer.subarray(offset, offset + 4).toString('ascii');
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;

    if (id === 'fmt ') {
      audioFormat = buffer.readUInt16LE(start);
      channels = buffer.readUInt16LE(start + 2);
      sampleRate = buffer.readUInt32LE(start + 4);
      bitsPerSample = buffer.readUInt16LE(start + 14);
    }
    else if (id === 'data') data = buffer.subarray(start, start + size);

    offset = start + size + (size & 1);
  }

  if (!data) throw new Error(`WAVE data chunk missing for resource '${resourceName}'`);
  if (audioFormat !== 1) throw new Error(`Unsupported WAVE format '${audioFormat}' for resource '${resourceName}'`);
  if (bitsPerSample !== 8 && bitsPerSample !== 16) throw new Error(`Unsupported WAVE bits '${bitsPerSample}' for resource '${resourceName}'`);

  let samples: Int16Array;
  if (bitsPerSample === 16) {
    samples = new Int16Array(data.buffer, data.byteOffset, Math.floor(data.length / 2));
  }
  else {
    samples = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) samples[i] = ((data[i] ?? 0) - 128) << 8;
  }

  return {
    samples,
    sampleCount: samples.length,
    channels,
    sampleRate,
    bitsPerSample: 16,
  };
};

const decodeWavc = (buffer: Buffer, resourceName: string): DecodedPcm => {
  if (buffer.subarray(4, 8).toString('ascii') !== 'V1.0') throw new Error(`Unsupported WAVC version for resource '${resourceName}'`);

  const csize = buffer.readUInt32LE(12);
  const acmOfs = buffer.readUInt32LE(16);

  if (acmOfs < 0x1c || acmOfs + csize > buffer.length) throw new Error(`Invalid WAVC ACM offset for resource '${resourceName}'`);

  const pcm = decodeAcm(buffer, acmOfs);
  const wavcChannels = buffer.readUInt16LE(20);
  const wavcRate = buffer.readUInt16LE(24);

  return {
    ...pcm,
    channels: wavcChannels || pcm.channels,
    sampleRate: wavcRate || pcm.sampleRate,
  };
};

export const decodeAudioBuffer = async (buffer: Buffer, resourceName: string): Promise<Readonly<{
  container: AudioContainer;
  pcm: DecodedPcm;
  wav: Buffer;
}>> => {
  let container: AudioContainer;
  try {
    container = detectAudioContainer(buffer);
  }
  catch {
    throw new Error(`Unknown audio container for resource '${resourceName}'`);
  }

  let pcm: DecodedPcm;
  switch (container) {
    case 'wavc':
      pcm = decodeWavc(buffer, resourceName);
      break;
    case 'acm':
      pcm = decodeAcm(buffer, 0);
      break;
    case 'pcm':
      pcm = decodePcmRiff(buffer, resourceName);
      break;
    case 'ogg':
      pcm = await decodeOgg(buffer);
      break;
  }

  return {
    container,
    pcm,
    wav: encodePcmWav(pcm),
  };
};
