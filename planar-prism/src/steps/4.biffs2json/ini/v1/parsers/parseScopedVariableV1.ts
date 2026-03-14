import type { Maybe } from '../../../../../shared/maybe.js';
import type { CreatureIniScopedVariable } from '../../types.js';

const parseScopedVariableV1 = (s: Maybe<string>): CreatureIniScopedVariable => {
  if (!s) throw new Error(`Cannot parse ScopedVariable from nothing`);
  const items = s.split('::');

  switch (items.length) {
    case 1: {
      const variableName = items[0];
      if (!variableName) throw new Error(`Suported format is 'scope::varible_name', but you passed '${s}'. Why?`);
      return {
        scope: 'GLOBAL',
        variableName: variableName.trim(),
      };
    }
    case 2: {
      const scope = items[0];
      const variableName = items[1];
      if (!scope || !variableName) throw new Error(`Suported format is 'scope::varible_name', but you passed '${s}'. Why?`);

      return {
        scope: scope.trim(),
        variableName: variableName.trim(),
      };
    }
    default: throw new Error(`Suported format is 'scope::varible_name', but you passed '${s}'. Why?`);
  }
};

export default parseScopedVariableV1;
