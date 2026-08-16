import { OggVorbisDecoder } from '@wasm-audio-decoders/ogg-vorbis';

import type { DecodedPcm } from './decodeAcm.js';

/**
 * Mostly llm generated from gemrb/nearinfinity
 */

const floatToInt16 = (sample: number): number => {
  const clamped = Math.max(-1, Math.min(1, sample));
  return clamped < 0 ? Math.round(clamped * 0x8000) : Math.round(clamped * 0x7fff);
};

export const decodeOgg = async (buffer: Buffer): Promise<DecodedPcm> => {
  const decoder = new OggVorbisDecoder();
  await decoder.ready;
  try {
    const result = await decoder.decodeFile(new Uint8Array(buffer));
    const channels = result.channelData.length;
    if (channels < 1 || channels > 2) throw new Error(`Unsupported OGG channel count '${channels}'`);
    const frames = result.samplesDecoded;
    const samples = new Int16Array(frames * channels);
    for (let i = 0; i < frames; i++) {
      for (let ch = 0; ch < channels; ch++) {
        samples[i * channels + ch] = floatToInt16(result.channelData[ch]![i] ?? 0);
      }
    }
    return {
      samples,
      sampleCount: samples.length,
      channels,
      sampleRate: result.sampleRate,
      bitsPerSample: 16,
    };
  }
  finally {
    decoder.free();
  }
};
