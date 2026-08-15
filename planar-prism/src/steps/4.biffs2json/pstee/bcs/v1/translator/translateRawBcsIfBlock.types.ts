import type { RawBcsArg } from '../../buildBcsContext.types.js';
import type { RawBcsTempVariable } from './objectArgForScope.types.js';

export type RawBcsIfBlock = Readonly<{
  condition: RawBcsBlockScope;
  actions: RawBcsBlockScope[];
}>;

export type RawBcsBlockScope = Readonly<{
  weight: number;
  temps: RawBcsTempVariable[];
  functions: RawBcsBlockFunction[];
}>;

export type RawBcsBlockFunction = Readonly<{
  name: string;
  negated: boolean;
  args: RawBcsArg[];
}>;
