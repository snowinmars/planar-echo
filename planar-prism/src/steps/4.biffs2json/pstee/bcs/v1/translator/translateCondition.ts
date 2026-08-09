import {
  isNothing,
  just,
  nothing,
} from '@planar/shared';
import { matchTriggerFunction } from './matchTriggerFunction.js';
import { splitHalfOfAreaStrings } from './splitHalfOfAreaStrings.js';
import { createVariableWrapper } from '../temps/createVariableWrapper.js';
import { objectArgForScope } from './objectArgForScope.js';
import { translateNumber } from './translateNumber.js';

import type { Maybe } from '@planar/shared';
import type { Ids } from '../../../ids/types.js';
import type {
  BcsArg,
  BlockFunction,
  BlockScope,
} from '../../parseBcs.types.js';
import type { ParsedBcsTrigger } from '../bytecode.types.js';
import type {
  SignatureFunction,
  Signatures,
} from '../signatures.types.js';
import type { VariableWrapper } from '../temps/createVariableWrapper.types.js';

const translateTriggerArguments = (
  trigger: ParsedBcsTrigger,
  functionSignature: SignatureFunction,
  ids: Map<string, Ids>,
  variableWrapper: VariableWrapper,
): BcsArg[] => {
  const args: BcsArg[] = [];
  let numberIndex = 0;
  let stringIndex = 0;
  let objectIndex = 0;
  const strings = [trigger.t5, trigger.t6];
  const numbers = [trigger.t1, trigger.t2negated, trigger.t3, trigger.t4];

  for (const parameter of functionSignature.parameters) {
    switch (parameter.type) {
      case 'i':
        args.push(translateNumber(numbers[numberIndex] ?? 0, parameter, ids));
        numberIndex++;
        break;
      case 's': {
        const value = splitHalfOfAreaStrings(functionSignature, stringIndex, strings);
        if (isNothing(value) || value === '') throw new Error(`Cannot parse string parameter of trigger '${trigger.id}'`);
        args.push({ kind: 'string', value });
        stringIndex++;
        break;
      }
      case 'o':
        if (objectIndex !== 0) {
          throw new Error(`Too many object params for trigger '${functionSignature.name}'`);
        }
        args.push(objectArgForScope(just(trigger.t7), ids, variableWrapper));
        objectIndex++;
        break;
      case 'p':
      case 'a':
      case 't': throw new Error(`Unsupported parameter type '${parameter.type}' in trigger '${functionSignature.name}'`);
      default: throw new Error(`Unknown parameter type '${parameter.type}' in trigger '${functionSignature.name}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return args;
};

const translateTrigger = (
  trigger: ParsedBcsTrigger,
  functionSignature: SignatureFunction,
  ids: Map<string, Ids>,
  variableWrapper: VariableWrapper,
): BlockFunction => ({
  name: functionSignature.name,
  negated: !!trigger.t2negated,
  args: translateTriggerArguments(trigger, functionSignature, ids, variableWrapper),
});

const translateTriggerOverride = (
  nextTriggerObject: ParsedBcsTrigger,
  innerTrigger: ParsedBcsTrigger,
  signatures: Signatures,
  ids: Map<string, Ids>,
  variableWrapper: VariableWrapper,
): BlockFunction => {
  const innerSignature = matchTriggerFunction(innerTrigger, signatures);

  return {
    name: 'triggeroverride',
    negated: !!innerTrigger.t2negated,
    args: [
      objectArgForScope(just(nextTriggerObject.t7), ids, variableWrapper),
      {
        kind: 'function',
        name: innerSignature.name,
        args: translateTriggerArguments(
          innerTrigger,
          innerSignature,
          ids,
          variableWrapper,
        ),
      },
    ],
  };
};

export const translateCondition = (
  triggers: ParsedBcsTrigger[],
  triggerSignatures: Signatures,
  ids: Map<string, Ids>,
): BlockScope => {
  const variableWrapper = createVariableWrapper();
  let orCount = 0;
  let pendingTrigger: Maybe<ParsedBcsTrigger> = nothing();

  for (const trigger of triggers) {
    const signature = matchTriggerFunction(trigger, triggerSignatures);

    const isNextTriggerObject = signature.name === 'nexttriggerobject'
      && signature.parameters.length === 1
      && signature.parameters[0]!.type === 'o';
    if (isNextTriggerObject) {
      if (isNothing(pendingTrigger)) {
        pendingTrigger = trigger;
        continue;
      }
      throw new Error('Do not want to override pending trigger because of TriggerOverride policy');
    }

    const translated = isNothing(pendingTrigger)
      ? translateTrigger(trigger, signature, ids, variableWrapper)
      : translateTriggerOverride(
          pendingTrigger,
          trigger,
          triggerSignatures,
          ids,
          variableWrapper,
        );

    if (!isNothing(pendingTrigger)) pendingTrigger = nothing();

    if (orCount > 0) {
      orCount -= 1;
      variableWrapper.addFunction(translated);
      continue;
    }

    const isOrTrigger = signature.name === 'or'
      && signature.parameters.length === 1
      && signature.parameters[0]!.type === 'i';
    if (isOrTrigger) {
      orCount = just(trigger.t1);
      variableWrapper.addFunction(translated);
      continue;
    }

    variableWrapper.addFunction(translated);
  }

  if (!isNothing(pendingTrigger)) {
    const pendingSignature = matchTriggerFunction(pendingTrigger, triggerSignatures);
    variableWrapper.addFunction(translateTrigger(
      pendingTrigger,
      pendingSignature,
      ids,
      variableWrapper,
    ));
  }

  return {
    weight: 0,
    temps: variableWrapper.getTemps(),
    functions: variableWrapper.getFunctions(),
  };
};
