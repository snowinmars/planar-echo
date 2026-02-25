type ExtendedMap<TKey extends number, TValue> = Record<TKey, TValue> & { parse: (x: number) => TValue; parseFlags: (x: number) => TValue[] };

const parse = <TKey extends number, TValue>(x: number, r: Record<TKey, TValue>): TValue => {
  if (x in r) return r[x as TKey];
  throw new Error(`Cannot parse ${x} over ${JSON.stringify(r)}`);
};

const parseFlags = <TKey extends number, TValue>(value: number, r: Record<TKey, TValue>): TValue[] => Array.from({ length: 32 }, (_, i) => 1 << i)
  .filter(bit => (value & bit) && bit in r)
  .map(bit => r[bit as TKey]);

export const extend = <TKey extends number, TValue>(r: Record<TKey, TValue>): ExtendedMap<TKey, TValue> => ({
  ...r,
  parse: x => parse(x, r),
  parseFlags: x => parseFlags(x, r),
});
