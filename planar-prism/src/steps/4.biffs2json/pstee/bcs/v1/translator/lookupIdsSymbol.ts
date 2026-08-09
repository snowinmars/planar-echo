import { just, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { Ids } from '../../../ids/types.js';

export const lookupIdsSymbol = (
  ids: Map<string, Ids>,
  idsName: string,
  value: number,
): Maybe<string> => {
  const candidates = [`${idsName}.ids`];

  for (const candidate of candidates) {
    const idsItem = ids.get(candidate);
    if (!idsItem) throw new Error(`Cannot find '${candidate}' in ids`);

    const entries = idsItem.entries.get(value);
    if (entries && entries.length) return just(entries[0]);
  }

  return nothing();
};
