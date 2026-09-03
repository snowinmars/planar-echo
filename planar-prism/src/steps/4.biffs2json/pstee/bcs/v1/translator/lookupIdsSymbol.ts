import { just, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { RawIds } from '../../../ids/parseIds.types.js';

type LookupIdsSymbolProps = Readonly<{
  resourceName: string;
  ids: Map<string, RawIds>;
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

  const id = ids.get(candidate);
  if (!id) throw new Error(`Cannot find '${candidate}' in ids for recource '${resourceName}'`);

  const entries = id.entries.get(value);
  if (entries && entries.length) return just(entries[0]);

  return nothing();
};
