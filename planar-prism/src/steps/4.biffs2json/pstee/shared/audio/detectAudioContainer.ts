import type { AudioContainer } from './audioContainer.types.js';

export const ID_ACM = 0x01032897;

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
