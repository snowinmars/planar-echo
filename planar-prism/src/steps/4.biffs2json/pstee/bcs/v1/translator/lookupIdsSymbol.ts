import { just, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { Ids } from '../../../ids/types.js';

/** Strip IDS signature args: "troco1" or "attackedby(o:...)" → lowercase name */
// export const idsEntryToSymbol = (entry: string): string => {
//   const trimmed = entry.trim().toLowerCase();
//   const paren = trimmed.indexOf('(');
//   if (paren < 0) return trimmed;
//   return trimmed.slice(0, paren).trim();
// };

export const lookupIdsSymbol = (
  ids: Map<string, Ids>,
  idsName: string,
  value: number,
): Maybe<string> => {
  const candidate = `${idsName}.ids`;

  const idsItem = ids.get(candidate);
  if (!idsItem) throw new Error(`Cannot find '${candidate}' in ids`);

  const entries = idsItem.entries.get(value);
  if (entries && entries.length) return just(entries[0]);

  return nothing();
};
