import type { EffectHeaderV10 } from './v10/readHeaderTypesV10.js';
import type { EffectHeaderV20 } from './v20/readHeaderTypesV20.js';

export type EffectMeta = Readonly<{
  signature: string;
  version: string;
  isPst: boolean;
  isPstee: boolean;
  isBg: boolean;
  isBgee: boolean;
  isBg2: boolean;
  isBg2ee: boolean;
  isIwd: boolean;
  isIwd2: boolean;
  isTobEx: boolean;
  isv10: boolean;
  isv20: boolean;
  isEe: boolean;
  hasKitIds: boolean;
  hasProftypeIds: boolean;
  resourceName: string;
  emptyInt: number;
}>;

export type EffectV10 = Readonly<{
  resourceName: string;
  header: EffectHeaderV10;
}>;
export type EffectV20 = Readonly<{
  resourceName: string;
  header: EffectHeaderV20;
}>;
