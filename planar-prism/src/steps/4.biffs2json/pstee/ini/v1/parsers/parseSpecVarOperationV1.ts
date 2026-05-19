import type { Maybe } from '@planar/shared';
import type { CreatureIniSpecVarOperation } from './parseSpecVarOperationV1.types.js';

export const parseSpecVarOperationV1 = (s: Maybe<string>): CreatureIniSpecVarOperation => {
  if (!s) throw new Error(`Cannot parse SpecVarOperation from nothing`);

  switch (s) {
    case 'greater_than':
    case 'less_than':
    case 'equal_to':
    case 'not_equal_to':
      return s;
    default: throw new Error(`Cannot parse SpecVarOperation from '${s}'`);
  }
};
