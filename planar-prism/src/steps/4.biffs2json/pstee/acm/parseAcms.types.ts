import type { AudioContainer } from '../shared/audio/index.js';

export type RawAcm = Readonly<{
  resourceName: string;
  container: AudioContainer;
  audioName: string;
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
  sampleCount: number;
}>;

export type RawAcmArtifacts = Readonly<{
  acm: RawAcm;
  pcmWav: Buffer;
}>;
