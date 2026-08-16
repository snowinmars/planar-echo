import type { AudioContainer } from '../shared/audio/index.js';

export type RawWav = Readonly<{
  resourceName: string;
  container: AudioContainer;
  audioName: string;
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
  sampleCount: number;
}>;

export type RawWavArtifacts = Readonly<{
  wav: RawWav;
  pcmWav: Buffer;
}>;
