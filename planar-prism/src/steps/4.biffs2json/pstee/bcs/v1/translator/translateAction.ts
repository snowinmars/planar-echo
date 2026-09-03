import {
  isNothing,
  just,
} from '@planar/shared';

import { isEmptyObject } from './isEmptyObject.js';
import { matchActionFunction } from './matchActionFunction.js';
import { objectArgForScope } from './objectArgForScope.js';
import { splitHalfOfAreaStrings } from './splitHalfOfAreaStrings.js';
import { translateNumber } from './translateNumber.js';

import type { RawIds } from '../../../ids/parseIds.types.js';
import type {
  RawBcsArg,
  RawBcsSignatureFunction,
  RawBcsSignatures,
} from '../../context/buildBcsContext.types.js';
import type { RawBcsAction } from '../bytecode/parseAc.types.js';
import type { RawBcsVariableWrapper } from '../temps/createVariableWrapper.types.js';
import type { RawBcsBlockFunction } from './translateRawBcsIfBlock.types.js';

type TranslateArgumentsProps = Readonly<{
  resourceName: string;
  action: RawBcsAction;
  functionSignature: RawBcsSignatureFunction;
  ids: Map<string, RawIds>;
  variableWrapper: RawBcsVariableWrapper;
  startObjectIndex: number;
}>;
const translateArguments = ({
  resourceName,
  action,
  functionSignature,
  ids,
  variableWrapper,
  startObjectIndex,
}: TranslateArgumentsProps): RawBcsArg[] => {
  const args: RawBcsArg[] = [];
  let numberIndex = 0;
  let objectIndex = startObjectIndex;
  let stringIndex = 0;
  const objects = [action.a1, action.a2, action.a3];
  const numbers = [action.a4, action.a6, action.a7];
  const strings = [action.a8, action.a9];

  for (const parameter of functionSignature.parameters) {
    switch (parameter.type) {
      case 'o': {
        const object = objects[objectIndex];
        if (isNothing(object)) {
          throw new Error(`No object slot '${objectIndex}' for action '${functionSignature.name}' for resource '${resourceName}'`);
        }
        args.push(objectArgForScope({
          resourceName,
          object,
          ids,
          variableWrapper,
        }));
        objectIndex++;
        break;
      }
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
        }); // may be ''
        args.push({ kind: 'string', value: just(value) });
        stringIndex++;
        break;
      }
      case 'p': {
        const point = just(action.a5point);
        args.push({
          kind: 'point',
          x: point.x,
          y: point.y,
        });
        break;
      }
      case 'a':
      case 't': throw new Error(`Unsupported parameter type '${parameter.type}' in action '${functionSignature.name}' for resource '${resourceName}'`);
      default: throw new Error(`Unknown parameter type '${parameter.type}' in action '${functionSignature.name}' for resource '${resourceName}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return args;
};

type TranslateActionProps = Readonly<{
  resourceName: string;
  action: RawBcsAction;
  signatures: RawBcsSignatures;
  ids: Map<string, RawIds>;
  variableWrapper: RawBcsVariableWrapper;
}>;
export const translateAction = ({
  resourceName,
  action,
  signatures,
  ids,
  variableWrapper,
}: TranslateActionProps): RawBcsBlockFunction => {
  const functionSignature = matchActionFunction({
    resourceName,
    action,
    signatures,
  });
  const override = action.a1;
  const hasOverride = !isNothing(override) && !isEmptyObject(override);

  const actionNotFound = functionSignature.parameters.some(parameter => parameter.type === 'a') && functionSignature.name !== 'actionoverride';
  if (actionNotFound) throw new Error(`Action signature '${functionSignature.name}' requires TYPE_ACTION parameter which is not supported for resource '${resourceName}'`);

  if (hasOverride) {
    const overrideFunctions = signatures.byId.get(1);
    let overrideName = 'actionoverride';

    if (overrideFunctions) {
      for (const signature of overrideFunctions) {
        if (
          signature.parameters.length === 2
          && signature.parameters[0]!.type === 'o'
          && signature.parameters[1]!.type === 'a'
        ) {
          overrideName = signature.name;
          break;
        }
      }
    }

    const inner: RawBcsArg = {
      kind: 'function',
      name: functionSignature.name,
      args: translateArguments({
        resourceName,
        action,
        functionSignature,
        ids,
        variableWrapper,
        startObjectIndex: 1,
      }),
    };

    return {
      name: overrideName,
      negated: false,
      args: [
        objectArgForScope({
          resourceName,
          object: override,
          ids,
          variableWrapper,
        }),
        inner,
      ],
    };
  }

  return {
    name: functionSignature.name,
    negated: false,
    args: translateArguments({
      resourceName,
      action,
      functionSignature,
      ids,
      variableWrapper,
      startObjectIndex: 1,
    }),
  };
};
