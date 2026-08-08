import { objectToArg } from './decompileObject.js';

import type { ParsedBcsObject } from '../bytecodeTypes.js';
import type { DecompiledArg } from '../../types.js';
import type { Ids } from '../../../ids/types.js';
import type { VariableWrapper } from './createVariableWrapper.js';

const pushTemp = (variableWrapper: VariableWrapper, value: DecompiledArg): string => {
  const name = `o${variableWrapper.getNextTempIndex()}`;
  variableWrapper.addTemp({ name, value });
  return name;
};
export type ObjectArgForScopeProps = Readonly<{
  object: ParsedBcsObject;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
}>;
export const objectArgForScope = ({
  object,
  ids,
  variableWrapper,
}: ObjectArgForScopeProps): DecompiledArg => {
  const arg = objectToArg({
    object,
    ids,
  });

  // Only compound call trees go to temps; leaf identifiers (myself, player1) stay inline strings
  if (arg.kind === 'function') {
    const name = pushTemp(variableWrapper, arg);
    return { kind: 'ref', name };
  }
  return arg;
};
