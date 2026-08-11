import { just, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { Ids } from '../../../ids/types.js';

type LookupIdsSymbolProps = Readonly<{
  resourceName: string;
  ids: Map<string, Ids>;
  idsName: string;
  value: number;
}>;
export const lookupIdsSymbol = ({
  resourceName,
  ids,
  idsName,
  value,
}: LookupIdsSymbolProps): Maybe<string> => {
  const candidate = `${idsName}.ids`;

  const idsItem = ids.get(candidate);
  if (!idsItem) throw new Error(`Cannot find '${candidate}' in ids for recource '${resourceName}'`);

  const entries = idsItem.entries.get(value);
  if (entries && entries.length) return just(entries[0]);

  return nothing();
};
