type ExtendedMap<TKey extends number, TValue extends string> = Record<TKey, TValue> & Readonly<{
  parse: (x: number) => TValue;
  parseFlags: (x: number) => TValue[];
}>;

const parse = <TKey extends number, TValue extends string>(x: number, r: Record<TKey, TValue>): TValue => {
  if (x in r) return r[x as TKey];
  throw new Error(`Cannot parse ${x} over ${JSON.stringify(r)}`);
};

const parseFlags = <TKey extends number, TValue extends string>(value: number, r: Record<TKey, TValue>): TValue[] => Array.from({ length: 32 }, (_, i) => 1 << i)
  .filter(bit => (value & bit) && bit in r)
  .map(bit => r[bit as TKey]);

export const extend = <TKey extends number, TValue extends string>(r: Record<TKey, TValue>): ExtendedMap<TKey, TValue> => ({
  ...r,
  parse: x => parse(x, r),
  parseFlags: x => parseFlags(x, r),
});

type ExternalMap = Readonly<{
  parseExternal: (x: number, r: Map<number, string[]>) => string;
  parseFlagsExternal: (x: number, r: Map<number, string[]>) => string[];
}>;
export const externalOffsetMap: ExternalMap = {
  parseExternal: (x, r) => {
    if (r.has(x)) return r.get(x)![0]!;
    return 'n/a';
  },
  parseFlagsExternal: (x, r) => Array.from({ length: 32 }, (_, i) => 1 << i)
    .filter(bit => (x & bit) && r.has(bit))
    .map(bit => r.get(bit)!)
    .reduce((acc, cur) => [...acc, ...cur], []),
};
