import type { BlockFunction, TempVariable } from '../../types.js';

export type VariableWrapper = Readonly<{
  getTemps: () => TempVariable[];
  getFunctions: () => BlockFunction[];
  getNextTempIndex: () => number;
  addTemp: (x: TempVariable) => void;
  addFunction: (x: BlockFunction) => void;
}>;
export const createVariableWrapper = (): VariableWrapper => {
  const t: TempVariable[] = [];
  const f: BlockFunction[] = [];
  let nextTemp = 0;

  const addTemp = (x: TempVariable): void => {
    t.push(x);
    nextTemp++;
  };

  return {
    getTemps: () => t,
    getFunctions: () => f,
    getNextTempIndex: () => nextTemp,
    addTemp,
    addFunction: (x: BlockFunction) => f.push(x),
  };
};
