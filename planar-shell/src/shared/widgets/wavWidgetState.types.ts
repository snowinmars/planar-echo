import type { Maybe } from '@planar/shared';

export type WavWidgetState = Readonly<{
  loading: boolean;
  wavs: string[];
  currentWavId: Maybe<string>;
}>;

export type WavWidgetActions = Readonly<{
  loadWavs: () => Promise<void>;
  loadWav: (wavId: string) => Promise<void>;
}>;
