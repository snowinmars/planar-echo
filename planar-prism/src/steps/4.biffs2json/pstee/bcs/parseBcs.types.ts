import type { Maybe } from '@planar/shared';

export type BcsKind = 'ai' | 'cutscene';

export type Bcs = Readonly<{
  resourceName: string;
  kind: BcsKind;
  blocks: IfBlock[];
}>;

export type IfBlock = Readonly<{
  condition: BlockScope;
  actions: BlockScope[];
}>;

export type BlockScope = Readonly<{
  weight: number;
  temps: TempVariable[];
  functions: BlockFunction[];
}>;

export type TempVariable = Readonly<{
  name: string;
  value: BcsArg;
}>;

export type BlockFunction = Readonly<{
  name: string;
  negated: boolean;
  args: BcsArg[];
}>;

/** PST object filter fields (ea/faction/team/general/race/class/specific/gender/align). */
export type BcsObjectQuery = Readonly<{
  ea?: Maybe<string>;
  faction?: Maybe<string>;
  team?: Maybe<string>;
  general?: Maybe<string>;
  race?: Maybe<string>;
  class?: Maybe<string>;
  specific?: Maybe<string>;
  gender?: Maybe<string>;
  align?: Maybe<string>;
}>;

export type BcsArg
  = | Readonly<{ kind: 'int'; value: number; symbol?: string }>
    | Readonly<{ kind: 'string'; value: string }>
    | Readonly<{ kind: 'who'; value: string }>
    | Readonly<{ kind: 'query'; value: BcsObjectQuery }>
    | Readonly<{ kind: 'point'; x: number; y: number }>
    | Readonly<{ kind: 'ref'; name: string }>
    | Readonly<{ kind: 'function'; name: string; args: BcsArg[] }>;
