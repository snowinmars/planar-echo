export { parseBcs } from './parseBcs.js';
export { buildBcsContext } from './buildBcsContext.js';

export type { RawBcsArg } from './buildBcsContext.types.js';
export type { RawBcsTempVariable } from './v1/translator/objectArgForScope.types.js';
export type { RawBcs } from './v1/translator/translateRawBcs.types.js';
export type {
  RawBcsBlockFunction,
  RawBcsBlockScope,
  RawBcsIfBlock,
} from './v1/translator/translateRawBcsIfBlock.types.js';
