import type { Maybe } from '@planar/shared';

export type BcsPoint = Readonly<{ x: number; y: number }>;

export type BcsRegion = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type ParsedBcsObject = Readonly<{
  target: number[];
  identifier: number[];
  region: Maybe<BcsRegion>;
  name: Maybe<string>;
}>;

export type ParsedBcsTrigger = Readonly<{
  id: number;
  t1: Maybe<number>;
  t2negated: Maybe<number>;
  t3: Maybe<number>;
  t4: Maybe<number>;
  t5: Maybe<string>;
  t6: Maybe<string>;
  t7: Maybe<ParsedBcsObject>;
}>;

export type ParsedBcsAction = Readonly<{
  id: number;
  a1: Maybe<ParsedBcsObject>;
  a2: Maybe<ParsedBcsObject>;
  a3: Maybe<ParsedBcsObject>;
  a4: Maybe<number>;
  a5point: Maybe<BcsPoint>;
  a6: Maybe<number>;
  a7: Maybe<number>;
  a8: Maybe<string>;
  a9: Maybe<string>;
}>;

export type ParsedBcsResponse = Readonly<{
  weight: number;
  actions: ParsedBcsAction[];
}>;

export type ParsedBcsCr = Readonly<{
  triggers: ParsedBcsTrigger[];
  responses: ParsedBcsResponse[];
}>;

export type ParsedBcsScript = Readonly<{
  blocks: ParsedBcsCr[];
}>;

export const emptyObject = (): ParsedBcsObject => ({
  target: Array.from({ length: 12 }, () => 0),
  identifier: Array.from({ length: 5 }, () => 0),
  region: { x: -1, y: -1, width: -1, height: -1 },
  name: '',
});

export const emptyPoint = (): BcsPoint => ({ x: 0, y: 0 });
