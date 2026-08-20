import { translateCondition } from './translateCondition.js';
import { translateResponse } from './translateResponse.js';

import type { RawBcsContext } from '../../context/buildBcsContext.types.js';
import type { RawBcsCr } from '../bytecode/parseCr.types.js';
import type { RawBcsIfBlock } from './translateRawBcsIfBlock.types.js';

export const translateRawBcsIfBlock = (
  block: RawBcsCr,
  resourceName: string,
  context: RawBcsContext,
): RawBcsIfBlock => {
  return {
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
  };
};
