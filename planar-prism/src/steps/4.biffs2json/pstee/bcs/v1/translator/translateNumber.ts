import { isNothing } from '@planar/shared';
import { BITWISE_IDS } from '../../engineRules.js';
import { lookupIdsSymbol } from './lookupIdsSymbol.js';

import type { Ids } from '../../../ids/types.js';
import type { FunctionParam } from '../signatures.types.js';
import type { BcsArg } from '../../parseBcs.types.js';

type BcsIntArg = Extract<BcsArg, { kind: 'int' }>;
type TranslateNumberProps = Readonly<{
  resourceName: string;
  value: number;
  param: FunctionParam;
  ids: Map<string, Ids>;
}>;
export const translateNumber = ({
  resourceName,
  value,
  param,
  ids,
}: TranslateNumberProps): BcsIntArg => {
  const idsName = param.idsRef;
  if (isNothing(idsName)) return { kind: 'int', value };

  const symbol = lookupIdsSymbol({
    resourceName,
    ids,
    idsName,
    value,
  });
  if (!isNothing(symbol)) return { kind: 'int', value, symbol };

  if (BITWISE_IDS.has(idsName)) {
    let remaining = value >>> 0;
    const parts: string[] = [];

    for (let bit = 0; bit < 32 && remaining > 0; bit++) {
      const mask = 1 << bit;
      if ((remaining & mask) !== mask) continue;

      const bitSymbol = lookupIdsSymbol({
        resourceName,
        ids,
        idsName,
        value: mask,
      });
      parts.push(bitSymbol ?? `0x${mask.toString(16)}`);
      remaining &= ~mask;
    }

    if (parts.length > 0) {
      return { kind: 'int', value, symbol: parts.join(' | ') };
    }
  }

  return { kind: 'int', value };
};
