export type GhostBcsArg
  = | Readonly<{ kind: 'int'; value: number; symbol?: string }>
    | Readonly<{ kind: 'string'; value: string }>
    | Readonly<{ kind: 'point'; x: number; y: number }>
    | Readonly<{ kind: 'ref'; name: string }>
    | Readonly<{ kind: 'function'; name: string; args: GhostBcsArg[] }>;

export type GhostBcsTempVariable = Readonly<{
  name: string;
  value: GhostBcsArg;
}>;

export type GhostBcsBlockFunction = Readonly<{
  name: string;
  negated: boolean;
  args: GhostBcsArg[];
}>;

export type GhostBcsBlockScope = Readonly<{
  weight: number;
  temps: GhostBcsTempVariable[];
  functions: GhostBcsBlockFunction[];
}>;

export type GhostBcsIfBlock = Readonly<{
  condition: GhostBcsBlockScope;
  actions: GhostBcsBlockScope[];
}>;

export type GhostBcs = Readonly<{
  resourceName: string;
  blocks: GhostBcsIfBlock[];
}>;
