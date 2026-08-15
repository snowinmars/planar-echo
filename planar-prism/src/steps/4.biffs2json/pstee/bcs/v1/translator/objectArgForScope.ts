import { translateObject } from './translateObject.js';

import type { RawIds } from '../../../ids/parseIds.types.js';
import type { RawBcsObject } from '../bytecode/parseOb.types.js';
import type { RawBcsVariableWrapper } from '../temps/createVariableWrapper.types.js';
import type { RawBcsArg } from '../../buildBcsContext.types.js';

type ObjectArgForScopeProps = Readonly<{
  resourceName: string;
  object: RawBcsObject;
  ids: Map<string, RawIds>;
  variableWrapper: RawBcsVariableWrapper;
}>;
export const objectArgForScope = ({
  resourceName,
  object,
  ids,
  variableWrapper,
}: ObjectArgForScopeProps): RawBcsArg => {
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
