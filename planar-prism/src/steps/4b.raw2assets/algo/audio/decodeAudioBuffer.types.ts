import type { DecodedPcm } from './decodeAcm.types.js';

export type AudioContainer = 'wavc' | 'acm' | 'pcm' | 'ogg';

export type DecodedAudioBuffer = Readonly<{
  container: AudioContainer;
  pcm: DecodedPcm;
  wav: Buffer;
}>;
