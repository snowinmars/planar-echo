import type { Maybe } from '@planar/shared';

import type { RawIds } from '../../ids/parseIds.types.js';

export type RawBcsParamType = 'a' | 't' | 'i' | 'o' | 'p' | 's';
export type RawBcsPstStringPack = 'plain' | 'halfOfArea6';

export type RawBcsFunctionParam = Readonly<{
  type: RawBcsParamType;
  tag: string;
  idsRef: Maybe<string>;
  stringPack: RawBcsPstStringPack;
}>;

export type RawBcsSignatureFunction = Readonly<{
  id: number;
  name: string;
  parameters: RawBcsFunctionParam[];
}>;

export type RawBcsSignatures = Readonly<{
  resource: string;
  byId: Map<number, RawBcsSignatureFunction[]>;
}>;

export type RawBcsContext = Readonly<{
  triggerSignatures: RawBcsSignatures;
  actionSignatures: RawBcsSignatures;
  ids: Map<string, RawIds>;
  xorKey: number[];
}>;

export type RawBcsArg
  = | Readonly<{ kind: 'int'; value: number; symbol?: string }>
    | Readonly<{ kind: 'string'; value: string }>
    | Readonly<{ kind: 'point'; x: number; y: number }>
    | Readonly<{ kind: 'ref'; name: string }>
    | Readonly<{ kind: 'function'; name: string; args: RawBcsArg[] }>;
