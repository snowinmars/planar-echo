import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { SectionEntry } from '../../iniParser/iniParserTypes.js';

export const parseDecOrThrow = (s: Maybe<string>): number => {
  if (!s) throw new Error(`Cannot parse base 10 inteter from nothing`);

  const parsed = parseInt(s, 10);
  if (isNaN(parsed)) throw new Error(`Cannot parse base 10 inteter from '${s}'`);
  return parsed;
};
export const parseDecOrDefault = (s: Maybe<string>, defaultValue: number): number => {
  if (!s) return defaultValue;
  try {
    return parseDecOrThrow(s);
  }
  catch {
    return defaultValue;
  }
};
export const parseDecOrNothing = (s: Maybe<string>): Maybe<number> => {
  if (!s) return nothing();
  try {
    return parseDecOrThrow(s);
  }
  catch {
    return nothing();
  }
};
const returnStringOrThrow = (x: Maybe<string>, key: string, sectionName: string): string => {
  if (!x) throw new Error(`${key} should not be optional for ini section ${sectionName}`); ;
  return x;
};
const returnStringOrNothing = (x: Maybe<string>): Maybe<string> => {
  if (!x) return nothing();
  return x;
};

type FoundEntry = Readonly<{
  stringOrNothing: () => Maybe<string>;
  stringOrThrow: (sectionName: string) => string;
  decOrThrow: () => number;
  decOrDefault: (defaultValue: number) => number;
  decOrNothing: () => Maybe<number>;
}>;
export const findEntry = (
  entries: SectionEntry[],
  key: string,
): FoundEntry => {
  const value = entries.find(e => e.key === key)?.value;
  return {
    stringOrNothing: () => returnStringOrNothing(value),
    stringOrThrow: (sectionName: string) => returnStringOrThrow(value, key, sectionName),
    decOrThrow: () => parseDecOrThrow(value),
    decOrDefault: (defaultValue: number) => parseDecOrDefault(value, defaultValue),
    decOrNothing: () => parseDecOrNothing(value),
  };
};
