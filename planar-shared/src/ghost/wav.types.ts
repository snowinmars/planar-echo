import type { GhostAudioContainer } from './acm.types.js';

export type GhostWav = Readonly<{
  resourceName: string;
  container: GhostAudioContainer;
  audioName: string;
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
  sampleCount: number;
}>;
