export type GhostAudioContainer = 'wavc' | 'acm' | 'pcm' | 'ogg';

export type GhostAcm = Readonly<{
  resourceName: string;
  container: GhostAudioContainer;
  audioName: string;
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
  sampleCount: number;
}>;
