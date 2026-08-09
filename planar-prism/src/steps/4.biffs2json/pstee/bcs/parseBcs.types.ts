export type Bcs = Readonly<{
  resourceName: string;
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

export type BcsArg
  = | Readonly<{ kind: 'int'; value: number; symbol?: string }>
    | Readonly<{ kind: 'string'; value: string }>
    | Readonly<{ kind: 'point'; x: number; y: number }>
    | Readonly<{ kind: 'ref'; name: string }>
    | Readonly<{ kind: 'function'; name: string; args: BcsArg[] }>;
