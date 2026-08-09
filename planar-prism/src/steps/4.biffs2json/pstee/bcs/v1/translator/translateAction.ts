import {
  isNothing,
  just,
} from '@planar/shared';
import { isEmptyObject } from './isEmptyObject.js';
import { matchActionFunction } from './matchActionFunction.js';
import { splitHalfOfAreaStrings } from './splitHalfOfAreaStrings.js';
import { objectArgForScope } from './objectArgForScope.js';
import { translateNumber } from './translateNumber.js';

import type { Ids } from '../../../ids/types.js';
import type { BcsArg, BlockFunction } from '../../parseBcs.types.js';
import type { ParsedBcsAction } from '../bytecode.types.js';
import type {
  SignatureFunction,
  Signatures,
} from '../signatures.types.js';
import type { VariableWrapper } from '../temps/createVariableWrapper.types.js';

const translateArguments = (
  action: ParsedBcsAction,
  functionSignature: SignatureFunction,
  ids: Map<string, Ids>,
  variableWrapper: VariableWrapper,
  startObjectIndex: number,
): BcsArg[] => {
  const args: BcsArg[] = [];
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
          throw new Error(`No object slot ${objectIndex} for action ${functionSignature.name}`);
        }
        args.push(objectArgForScope(object, ids, variableWrapper));
        objectIndex++;
        break;
      }
      case 'i':
        args.push(translateNumber(numbers[numberIndex] ?? 0, parameter, ids));
        numberIndex++;
        break;
      case 's': {
        const value = splitHalfOfAreaStrings(functionSignature, stringIndex, strings); // may be ''
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
      case 't': throw new Error(`Unsupported parameter type '${parameter.type}' in action ${functionSignature.name}`);
      default: throw new Error(`Unknown parameter type '${parameter.type}' in action ${functionSignature.name}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return args;
};

export const translateAction = (
  action: ParsedBcsAction,
  signatures: Signatures,
  ids: Map<string, Ids>,
  variableWrapper: VariableWrapper,
): BlockFunction => {
  const functionSignature = matchActionFunction(action, signatures);
  const override = action.a1;
  const hasOverride = !isNothing(override) && !isEmptyObject(override);

  const actionNotFound = functionSignature.parameters.some(parameter => parameter.type === 'a') && functionSignature.name !== 'actionoverride';
  if (actionNotFound) throw new Error(`Action signature ${functionSignature.name} requires TYPE_ACTION parameter which is not supported`);

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

    const inner: BcsArg = {
      kind: 'function',
      name: functionSignature.name,
      args: translateArguments(action, functionSignature, ids, variableWrapper, 1),
    };

    return {
      name: overrideName,
      negated: false,
      args: [
        objectArgForScope(override, ids, variableWrapper),
        inner,
      ],
    };
  }

  return {
    name: functionSignature.name,
    negated: false,
    args: translateArguments(action, functionSignature, ids, variableWrapper, 1),
  };
};
