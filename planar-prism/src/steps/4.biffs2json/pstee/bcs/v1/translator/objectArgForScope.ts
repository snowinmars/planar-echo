import { translateObject } from './translateObject.js';

import type { Ids } from '../../../ids/types.js';
import type { BcsArg } from '../../parseBcs.types.js';
import type { ParsedBcsObject } from '../bytecode.types.js';
import type { VariableWrapper } from '../temps/createVariableWrapper.types.js';

type ObjectArgForScopeProps = Readonly<{
  resourceName: string;
  object: ParsedBcsObject;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
}>;
export const objectArgForScope = ({
  resourceName,
  object,
  ids,
  variableWrapper,
}: ObjectArgForScopeProps): BcsArg => {
  const argument = translateObject({
    resourceName,
    object,
    ids,
  });

  if (argument.kind !== 'function') return argument;

  const name = `o${variableWrapper.getNextTempIndex()}`;
  variableWrapper.addTemp({ name, value: argument });
  return { kind: 'ref', name };
};
