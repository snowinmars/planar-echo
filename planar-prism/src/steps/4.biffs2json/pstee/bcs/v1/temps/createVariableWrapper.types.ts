import type { RawBcsTempVariable } from '../translator/objectArgForScope.types.js';
import type { RawBcsBlockFunction } from '../translator/translateRawBcsIfBlock.types.js';

export type RawBcsVariableWrapper = Readonly<{
  getTemps: () => RawBcsTempVariable[];
  getFunctions: () => RawBcsBlockFunction[];
  getNextTempIndex: () => number;
  addTemp: (value: RawBcsTempVariable) => void;
  addFunction: (value: RawBcsBlockFunction) => void;
}>;
