export const objectEntries = <TKey extends (string | number | symbol), TValue>(r: Record<TKey, TValue>): [TKey, TValue][] => (Object.entries(r as Record<string, string>) as [TKey, TValue][]);
export const objectKeys = <TKey extends (string | number | symbol), TValue>(r: Record<TKey, TValue>): TKey[] => (Object.keys(r as Record<string, string>) as TKey[]);
export const objectValues = <TKey extends (string | number | symbol), TValue>(r: Record<TKey, TValue>): TValue[] => (Object.values(r as Record<string, string>) as TValue[]);
