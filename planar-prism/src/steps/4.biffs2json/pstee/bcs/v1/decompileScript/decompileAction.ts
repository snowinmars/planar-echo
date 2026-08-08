import {
  numberBytecodeToJson,
  splitHalfOfAreaStrings,
  pointArg,
} from './decompileObject.js';
import { isNothing, just, nothing } from '@planar/shared';
import { objectArgForScope } from './objectArgForScope.js';

import type { Signatures, SignatureFunction } from '../signatures.js';
import type { ParsedBcsAction } from '../bytecodeTypes.js';
import type { BlockFunction, DecompiledArg } from '../../types.js';
import type { Ids } from '../../../ids/types.js';
import type { Maybe } from '@planar/shared';
import type { VariableWrapper } from './createVariableWrapper.js';
import { isEmptyObject } from './isEmptyObject.js';

const matchActionFunction = (action: ParsedBcsAction, signatures: Signatures): SignatureFunction => {
  const functions = just(signatures.byId.get(action.id));
  if (!functions) throw new Error(`Could not find action ${action.id} in ${signatures.resource}`);
  if (functions.length === 1) return functions[0]!;

  let best: Maybe<SignatureFunction> = nothing();
  let bestScore = Number.POSITIVE_INFINITY;
  let bestParams = Number.POSITIVE_INFINITY;
  let fallback: Maybe<SignatureFunction> = nothing();

  for (const f of functions) {
    let piCount = 0;
    let psCount = 0;
    let poCount = 0;
    let ppCount = 0;
    let sidx = 0;
    for (const p of f.parameters) {
      switch (p.type) {
        case 'i': piCount += 1; break;
        case 's':
          psCount += 1;
          sidx += p.stringPack === 'halfOfArea6' ? 1 : 2;
          break;
        case 'o': poCount += 1; break;
        case 'p': ppCount += 1; break;
        case 'a': break;
        case 't':
          throw new Error(`Unexpected trigger param in action ${f.name}`);
        default: break;
      }
    }
    if (isNothing(fallback) && psCount > 0) fallback = f;

    let pi = 0;
    let ps = 0;
    let po = 0;
    let pp = 0;
    const nums = [action.a4, action.a6, action.a7];
    for (let i = 2; i >= 0; i -= 1) {
      if (nums[i] !== 0) {
        pi = piCount - i - 1;
        break;
      }
    }

    if ((sidx < 2 && action.a8 !== '') || (sidx < 4 && action.a9 !== '')) {
      psCount -= 1;
      ps = psCount - 1;
    }
    else {
      for (let i = 3; i >= 0; i -= 1) {
        try {
          if (splitHalfOfAreaStrings({
            functionSignature: f,
            index: i,
            strings: [action.a8, action.a9],
          }) !== '') {
            ps = psCount - i - 1;
            break;
          }
        }
        catch {
          break;
        }
      }
    }

    const objects = [action.a1, action.a2, action.a3];
    for (let i = 2; i >= 1; i -= 1) {
      if (!isNothing(objects[i])) {
        po = poCount - i;
        break;
      }
    }

    if (just(action.a5point).x !== 0 || just(action.a5point).y !== 0) {
      pp = ppCount - 1;
    }

    const isMatch = pi >= 0 && ps >= 0 && po >= 0 && pp >= 0;
    const paramCount = piCount + psCount + poCount + ppCount;
    const score = pi + ps + po + pp;
    if (isMatch && score <= bestScore && paramCount < bestParams) {
      bestScore = score;
      bestParams = paramCount;
      best = f;
    }
  }

  return best ?? fallback ?? functions[0]!;
};

type InnerActionBytecodeToJsonProps = Readonly<{
  action: ParsedBcsAction;
  functionSignature: SignatureFunction;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
  startObjIndex: number;
}>;
const innerActionBytecodeToJson = ({
  action,
  functionSignature,
  ids,
  variableWrapper,
  startObjIndex,
}: InnerActionBytecodeToJsonProps): DecompiledArg[] => {
  const args: DecompiledArg[] = [];
  let curNum = 0;
  let curObj = startObjIndex;
  let curString = 0;
  const nums = [action.a4, action.a6, action.a7];
  const objects = [action.a1, action.a2, action.a3];
  const strings = [action.a8, action.a9];

  for (const p of functionSignature.parameters) {
    switch (p.type) {
      case 'i': {
        args.push(numberBytecodeToJson({
          value: nums[curNum] ?? 0,
          param: p,
          ids,
        }));
        curNum += 1;
        break;
      }
      case 's': {
        const value = splitHalfOfAreaStrings({
          functionSignature,
          index: curString,
          strings,
        });
        args.push({ kind: 'string', value: just(value).toLowerCase() });
        curString += 1;
        break;
      }
      case 'p': {
        args.push(pointArg(just(action.a5point)));
        break;
      }
      case 'o': {
        const obj = objects[curObj];
        if (isNothing(obj)) throw new Error(`No object slot ${curObj} for action ${functionSignature.name}`);
        args.push(objectArgForScope({
          object: obj,
          ids,
          variableWrapper,
        }));
        curObj += 1;
        break;
      }
      case 'a':
        break;
      case 't':
        throw new Error(`Unsupported parameter type T in action ${functionSignature.name}`);
      default:
        throw new Error(`Unknown parameter type in action ${functionSignature.name}`);
    }
  }

  return args;
};

type ActionBytecodeToJsonProps = Readonly<{
  action: ParsedBcsAction;
  signatures: Signatures;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
}>;
export const actionBytecodeToJson = ({
  action,
  signatures,
  ids,
  variableWrapper,
}: ActionBytecodeToJsonProps): BlockFunction => {
  const functionSignature = matchActionFunction(action, signatures);
  const override = action.a1;
  const hasOverride = !isNothing(override) && !isEmptyObject(override);

  if (functionSignature.parameters.some(p => p.type === 'a') && functionSignature.name.toLowerCase() !== 'actionoverride') {
    throw new Error(`Action signature ${functionSignature.name} requires TYPE_ACTION parameter which is not supported`);
  }

  if (hasOverride) {
    const overrideFns = just(signatures.byId.get(1));
    let overrideName = 'actionoverride';
    if (overrideFns) {
      for (const f of overrideFns) {
        if (
          f.parameters.length === 2
          && f.parameters[0]!.type === 'o'
          && f.parameters[1]!.type === 'a'
        ) {
          overrideName = f.name.toLowerCase();
          break;
        }
      }
    }

    const innerArgs = innerActionBytecodeToJson({
      action,
      functionSignature,
      ids,
      variableWrapper,
      startObjIndex: 1,
    });
    const inner: DecompiledArg = {
      kind: 'function',
      name: functionSignature.name.toLowerCase(),
      args: innerArgs,
    };
    return {
      name: overrideName,
      negated: false,
      args: [objectArgForScope({
        object: override,
        ids,
        variableWrapper,
      }), inner],
    };
  }

  // NI: curObj starts at 1 (a1 reserved for ActionOverride target)
  return {
    name: functionSignature.name.toLowerCase(),
    negated: false,
    args: innerActionBytecodeToJson({
      action,
      functionSignature,
      ids,
      variableWrapper,
      startObjIndex: 1,
    }),
  };
};
