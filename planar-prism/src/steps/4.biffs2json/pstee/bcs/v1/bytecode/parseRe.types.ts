import type { RawBcsAction } from './parseAc.types.js';

export type RawBcsResponse = Readonly<{
  weight: number;
  actions: RawBcsAction[];
}>;
