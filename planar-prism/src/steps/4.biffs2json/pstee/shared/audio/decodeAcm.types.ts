export type DecodedPcm = Readonly<{
  samples: Int16Array;
  sampleCount: number;
  channels: number;
  sampleRate: number;
  bitsPerSample: 16;
}>;
