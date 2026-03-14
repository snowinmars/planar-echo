import type { Maybe } from '../../../../../shared/maybe.js';
import type { CreatureIniSpecVarOperation } from '../../types.js';

const parseSpecVarOperationV1 = (s: Maybe<string>): CreatureIniSpecVarOperation => {
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

export default parseSpecVarOperationV1;
