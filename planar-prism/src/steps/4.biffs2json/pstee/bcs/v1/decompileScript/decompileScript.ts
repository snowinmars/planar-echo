import { actionBytecodeToJson } from './decompileAction.js';
import { parseBytecode } from './parseBytecode.js';
import { conditionBytecodeToJson } from './conditionBytecodeToJson.js';
import { createVariableWrapper } from './createVariableWrapper.js';

import type { Signatures } from '../signatures.js';
import type { DecompiledBcs, IfBlock, BlockScope } from '../../types.js';
import type { ParsedBcsAction } from '../bytecodeTypes.js';
import type { Ids } from '../../../ids/types.js';

const decompileResponseScope = (
  weight: number,
  actions: ParsedBcsAction[],
  actionSigs: Signatures,
  ids: Map<string, Ids>,
): BlockScope => {
  const variableWrapper = createVariableWrapper();
  const functions = actions.map(action => actionBytecodeToJson({
    action,
    signatures: actionSigs,
    ids,
    variableWrapper,
  }));
  return {
    weight,
    temps: variableWrapper.getTemps(),
    functions,
  };
};

export type BcsContext = Readonly<{
  triggerSignatures: Signatures;
  actionSignatures: Signatures;
  ids: Map<string, Ids>;
  xorKey: number[];
}>;
export const decompileScript = (
  code: string,
  resourceName: string,
  ctx: BcsContext,
): DecompiledBcs => {
  const parsed = parseBytecode(code);

  const blocks = parsed.blocks.map((cr) => {
    const condition = conditionBytecodeToJson({
      triggers: cr.triggers,
      triggerSignatures: ctx.triggerSignatures,
      ids: ctx.ids,
    });

    const actions = cr.responses.map(re => decompileResponseScope(re.weight, re.actions, ctx.actionSignatures, ctx.ids));

    const ifBlock: IfBlock = {
      condition,
      actions,
    };
    return ifBlock;
  });

  return { resourceName, blocks };
};
