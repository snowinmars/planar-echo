import type { RawBcsTempVariable } from '../translator/objectArgForScope.types.js';
import type { RawBcsBlockFunction } from '../translator/translateRawBcsIfBlock.types.js';
import type { RawBcsVariableWrapper } from './createVariableWrapper.types.js';

export const createVariableWrapper = (): RawBcsVariableWrapper => {
  const temps: RawBcsTempVariable[] = [];
  const functions: RawBcsBlockFunction[] = [];
  let nextTemp = 0;

  const addTemp = (value: RawBcsTempVariable): void => {
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
