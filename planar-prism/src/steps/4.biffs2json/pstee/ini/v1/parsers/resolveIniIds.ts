import { externalOffsetMap } from '@/shared/extendedMap.js';
import { isNothing, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export const resolveIniIds = (token: Maybe<string>, entries: Map<number, string[]>): Maybe<string> => {
  const emptyToken = isNothing(token) || token === '';
  const anyToken = token === '*' || token === '0';
  if (emptyToken || anyToken) return nothing();

  // token can be string ('team_1') or stringified number ('2') here
  const isNumber = /^-?\d+$/.test(token);
  if (isNumber) {
    const n = Number(token);
    const name = externalOffsetMap.parseExternal(n, entries);
    if (name === 'n/a') throw new Error(`Unknown id '${token}'`);
    return name;
  }

  // token is string here, but I want to be sure, that this is a known string
  const needle = token;
  for (const names of entries.values()) if (names.some(x => x === needle)) return names[0]!;

  throw new Error(`Unknown name '${token}'`);
};
