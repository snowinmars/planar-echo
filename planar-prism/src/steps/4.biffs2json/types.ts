import type { Ids } from './ids/index.js';

export type Meta<TSignature, TVersion> = Readonly<{
  signature: TSignature;
  version: TVersion;
  resourceName: string;
  gameName: string;
  ids: Map<string, Ids>;
  isPst: boolean;
  isPstee: boolean;
  isIwd1: boolean;
  isIwd1ee: boolean;
  isIwd2: boolean;
  isIwd2ee: boolean;
  isBg1: boolean;
  isBg1ee: boolean;
  isBg2: boolean;
  isBg2ee: boolean;
  isTobEx: boolean;
  isEe: boolean;
  emptyInt: number;
}>;
