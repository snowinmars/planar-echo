import { translateRawBcsIfBlock } from './translateRawBcsIfBlock.js';

import type { RawBcsScript } from '../bytecode/parseBytecode.types.js';
import type { RawBcsContext } from '../../context/buildBcsContext.types.js';
import type { RawBcs } from './translateRawBcs.types.js';

export const translateRawBcs = (
  parsed: RawBcsScript,
  resourceName: string,
  context: RawBcsContext,
): RawBcs => {
  const blocks = parsed.blocks.map(b => translateRawBcsIfBlock(b, resourceName, context));

  return { resourceName, blocks };
};
