import { translateObject } from './translateObject.js';

import type { Ids } from '../../../ids/types.js';
import type { BcsArg } from '../../parseBcs.types.js';
import type { ParsedBcsObject } from '../bytecode.types.js';
import type { VariableWrapper } from '../temps/createVariableWrapper.types.js';

export const objectArgForScope = (
  object: ParsedBcsObject,
  ids: Map<string, Ids>,
  variableWrapper: VariableWrapper,
): BcsArg => {
  const argument = translateObject(object, ids);

  if (argument.kind !== 'function') return argument;

  const name = `o${variableWrapper.getNextTempIndex()}`;
  variableWrapper.addTemp({ name, value: argument });
  return { kind: 'ref', name };
};
