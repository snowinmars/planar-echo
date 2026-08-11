import { translateCondition } from './translateCondition.js';
import { translateAction } from './translateAction.js';
import { createVariableWrapper } from '../temps/createVariableWrapper.js';

import type { Ids } from '../../../ids/types.js';
import type {
  Bcs,
  BlockScope,
  IfBlock,
} from '../../parseBcs.types.js';
import type { ParsedBcsAction, ParsedBcsScript } from '../bytecode.types.js';
import type { Signatures } from '../signatures.types.js';
import type { BcsContext } from '../../buildBcsContext.types.js';

type TranslateResponseProps = Readonly<{
  resourceName: string;
  weight: number;
  actions: ParsedBcsAction[];
  actionSignatures: Signatures;
  ids: Map<string, Ids>;
}>;
const translateResponse = ({
  resourceName,
  weight,
  actions,
  actionSignatures,
  ids,
}: TranslateResponseProps): BlockScope => {
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

export const translateScript = (
  parsed: ParsedBcsScript,
  resourceName: string,
  context: BcsContext,
): Bcs => {
  const blocks = parsed.blocks.map((block): IfBlock => ({
    condition: translateCondition({
      resourceName,
      triggers: block.triggers,
      triggerSignatures: context.triggerSignatures,
      ids: context.ids,
    }),
    actions: block.responses.map(response => translateResponse({
      resourceName,
      weight: response.weight,
      actions: response.actions,
      actionSignatures: context.actionSignatures,
      ids: context.ids,
    })),
  }));

  return { resourceName, blocks };
};
