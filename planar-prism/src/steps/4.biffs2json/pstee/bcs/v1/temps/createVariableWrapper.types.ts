import type { BlockFunction, TempVariable } from '../../parseBcs.types.js';

export type VariableWrapper = Readonly<{
  getTemps: () => TempVariable[];
  getFunctions: () => BlockFunction[];
  getNextTempIndex: () => number;
  addTemp: (value: TempVariable) => void;
  addFunction: (value: BlockFunction) => void;
}>;
