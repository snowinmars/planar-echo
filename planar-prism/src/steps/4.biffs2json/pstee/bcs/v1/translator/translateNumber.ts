import { isNothing } from '@planar/shared';
import { lookupIdsSymbol } from './lookupIdsSymbol.js';

import type { RawIds } from '../../../ids/parseIds.types.js';
import type { RawBcsArg, RawBcsFunctionParam } from '../../context/buildBcsContext.types.js';
import { BITWISE_IDS } from '../../context/buildBcsContext.const.js';

type BcsIntArg = Extract<RawBcsArg, { kind: 'int' }>;
type TranslateNumberProps = Readonly<{
  resourceName: string;
  value: number;
  param: RawBcsFunctionParam;
  ids: Map<string, RawIds>;
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
