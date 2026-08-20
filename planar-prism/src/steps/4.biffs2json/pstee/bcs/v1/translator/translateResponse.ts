import { createVariableWrapper } from '../temps/createVariableWrapper.js';
import { translateAction } from './translateAction.js';

import type { RawIds } from '../../../ids/parseIds.types.js';
import type { RawBcsSignatures } from '../../context/buildBcsContext.types.js';
import type { RawBcsAction } from '../bytecode/parseAc.types.js';
import type { RawBcsBlockScope } from './translateRawBcsIfBlock.types.js';

type TranslateResponseProps = Readonly<{
  resourceName: string;
  weight: number;
  actions: RawBcsAction[];
  actionSignatures: RawBcsSignatures;
  ids: Map<string, RawIds>;
}>;
export const translateResponse = ({
  resourceName,
  weight,
  actions,
  actionSignatures,
  ids,
}: TranslateResponseProps): RawBcsBlockScope => {
  const variableWrapper = createVariableWrapper();
  const functions = actions.map(action => translateAction({
    resourceName,
    action,
    signatures: actionSignatures,
    ids,
    variableWrapper,
  },
  ));

  return {
    weight,
    temps: variableWrapper.getTemps(),
    functions,
  };
};
