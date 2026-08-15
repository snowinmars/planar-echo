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
import type { RawIds } from '../../../ids/parseIds.types.js';
import type { RawBcsTrigger } from '../bytecode/parseTr.types.js';
import type {
  RawBcsArg,
  RawBcsSignatureFunction,
  RawBcsSignatures,
} from '../../buildBcsContext.types.js';
import type { RawBcsVariableWrapper } from '../temps/createVariableWrapper.types.js';
import type { RawBcsBlockFunction, RawBcsBlockScope } from './translateRawBcsIfBlock.types.js';

type TranslateTriggerArgumentsProps = Readonly<{
  resourceName: string;
  trigger: RawBcsTrigger;
  functionSignature: RawBcsSignatureFunction;
  ids: Map<string, RawIds>;
  variableWrapper: RawBcsVariableWrapper;
}>;
const translateTriggerArguments = ({
  resourceName,
  trigger,
  functionSignature,
  ids,
  variableWrapper,
}: TranslateTriggerArgumentsProps): RawBcsArg[] => {
  const args: RawBcsArg[] = [];
  let numberIndex = 0;
  let stringIndex = 0;
  let objectIndex = 0;
  const strings = [trigger.t5, trigger.t6];
  const numbers = [trigger.t1, trigger.t2negated, trigger.t3, trigger.t4];

  for (const parameter of functionSignature.parameters) {
    switch (parameter.type) {
      case 'i':
        args.push(translateNumber({
          resourceName,
          value: numbers[numberIndex] ?? 0,
          param: parameter,
          ids,
        }));
        numberIndex++;
        break;
      case 's': {
        const value = splitHalfOfAreaStrings({
          functionSignature,
          index: stringIndex,
          strings,
        });
        if (isNothing(value) || value === '') throw new Error(`Cannot parse string parameter of trigger '${trigger.id}' for resource '${resourceName}'`);
        args.push({ kind: 'string', value });
        stringIndex++;
        break;
      }
      case 'o':
        if (objectIndex !== 0) {
          throw new Error(`Too many object params for trigger '${functionSignature.name}'`);
        }
        args.push(objectArgForScope({
          resourceName,
          object: just(trigger.t7),
          ids,
          variableWrapper,
        }));
        objectIndex++;
        break;
      case 'p':
      case 'a':
      case 't': throw new Error(`Unsupported parameter type '${parameter.type}' in trigger '${functionSignature.name}' for resource '${resourceName}'`);
      default: throw new Error(`Unknown parameter type '${parameter.type}' in trigger '${functionSignature.name}' for resource '${resourceName}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return args;
};

type TranslateTriggerProps = Readonly<{
  resourceName: string;
  trigger: RawBcsTrigger;
  functionSignature: RawBcsSignatureFunction;
  ids: Map<string, RawIds>;
  variableWrapper: RawBcsVariableWrapper;
}>;
const translateTrigger = ({
  resourceName,
  trigger,
  functionSignature,
  ids,
  variableWrapper,
}: TranslateTriggerProps): RawBcsBlockFunction => ({
  name: functionSignature.name,
  negated: !!trigger.t2negated,
  args: translateTriggerArguments({
    resourceName,
    trigger,
    functionSignature,
    ids,
    variableWrapper,
  }),
});

type TranslateTriggerOverrideProps = Readonly<{
  resourceName: string;
  nextTriggerObject: RawBcsTrigger;
  innerTrigger: RawBcsTrigger;
  signatures: RawBcsSignatures;
  ids: Map<string, RawIds>;
  variableWrapper: RawBcsVariableWrapper;
}>;
const translateTriggerOverride = ({
  resourceName,
  nextTriggerObject,
  innerTrigger,
  signatures,
  ids,
  variableWrapper,
}: TranslateTriggerOverrideProps): RawBcsBlockFunction => {
  const innerSignature = matchTriggerFunction({
    resourceName,
    trigger: innerTrigger,
    signatures,
  });

  return {
    name: 'triggeroverride',
    negated: !!innerTrigger.t2negated,
    args: [
      objectArgForScope({
        resourceName,
        object: just(nextTriggerObject.t7),
        ids,
        variableWrapper,
      }),
      {
        kind: 'function',
        name: innerSignature.name,
        args: translateTriggerArguments({
          resourceName,
          trigger: innerTrigger,
          functionSignature: innerSignature,
          ids,
          variableWrapper,
        }),
      },
    ],
  };
};

type TranslateConditionProps = Readonly<{
  resourceName: string;
  triggers: RawBcsTrigger[];
  triggerSignatures: RawBcsSignatures;
  ids: Map<string, RawIds>;
}>;
export const translateCondition = ({
  resourceName,
  triggers,
  triggerSignatures,
  ids,
}: TranslateConditionProps): RawBcsBlockScope => {
  const variableWrapper = createVariableWrapper();
  let orCount = 0;
  let pendingTrigger: Maybe<RawBcsTrigger> = nothing();

  for (const trigger of triggers) {
    const signature = matchTriggerFunction({
      resourceName,
      trigger,
      signatures: triggerSignatures,
    });

    const isNextTriggerObject = signature.name === 'nexttriggerobject'
      && signature.parameters.length === 1
      && signature.parameters[0]!.type === 'o';
    if (isNextTriggerObject) {
      if (isNothing(pendingTrigger)) {
        pendingTrigger = trigger;
        continue;
      }
      throw new Error(`Do not want to override pending trigger because of TriggerOverride policy for resource '${resourceName}'`);
    }

    const translated = isNothing(pendingTrigger)
      ? translateTrigger({
          resourceName,
          trigger,
          functionSignature: signature,
          ids,
          variableWrapper,
        })
      : translateTriggerOverride({
          resourceName,
          nextTriggerObject: pendingTrigger,
          innerTrigger: trigger,
          signatures: triggerSignatures,
          ids,
          variableWrapper,
        });

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
    const pendingSignature = matchTriggerFunction({
      resourceName,
      trigger: pendingTrigger,
      signatures: triggerSignatures,
    });
    variableWrapper.addFunction(translateTrigger({
      resourceName,
      trigger: pendingTrigger,
      functionSignature: pendingSignature,
      ids,
      variableWrapper,
    }));
  }

  return {
    weight: 0,
    temps: variableWrapper.getTemps(),
    functions: variableWrapper.getFunctions(),
  };
};
