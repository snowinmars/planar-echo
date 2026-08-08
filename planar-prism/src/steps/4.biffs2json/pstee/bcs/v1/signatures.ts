import type { PstStringPack } from '../types.js';

export type ParamType = 'a' | 't' | 'i' | 'o' | 'p' | 's';

export type FunctionParam = Readonly<{
  type: ParamType;
  tag: string;
  idsRef: string;
  stringPack: PstStringPack;
}>;

export type SignatureFunction = Readonly<{
  id: number;
  name: string;
  parameters: FunctionParam[];
}>;

export type Signatures = Readonly<{
  resource: string;
  byId: Map<number, SignatureFunction[]>;
}>;
