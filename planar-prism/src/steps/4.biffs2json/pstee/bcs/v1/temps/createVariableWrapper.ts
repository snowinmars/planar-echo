import type { BlockFunction, TempVariable } from '../../parseBcs.types.js';
import type { VariableWrapper } from './createVariableWrapper.types.js';

export const createVariableWrapper = (): VariableWrapper => {
  const temps: TempVariable[] = [];
  const functions: BlockFunction[] = [];
  let nextTemp = 0;

  const addTemp = (value: TempVariable): void => {
    temps.push(value);
    nextTemp++;
  };

  return {
    getTemps: () => temps,
    getFunctions: () => functions,
    getNextTempIndex: () => nextTemp,
    addTemp,
    addFunction: value => functions.push(value),
  };
};
