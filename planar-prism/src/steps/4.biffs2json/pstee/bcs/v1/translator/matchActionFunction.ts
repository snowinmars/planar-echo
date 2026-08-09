import {
  isNothing,
  just,
  nothing,
} from '@planar/shared';
import { splitHalfOfAreaStrings } from './splitHalfOfAreaStrings.js';

import type { Maybe } from '@planar/shared';
import type { ParsedBcsAction } from '../bytecode.types.js';
import type {
  SignatureFunction,
  Signatures,
} from '../signatures.types.js';

type ActionSignatureScore = Readonly<{
  score: number;
  parameterCount: number;
  isMatch: boolean;
  hasStrings: boolean;
}>;

const scoreActionSignature = (
  action: ParsedBcsAction,
  signature: SignatureFunction,
): ActionSignatureScore => {
  let integerCount = 0;
  let stringCount = 0;
  let objectCount = 0;
  let pointCount = 0;
  let stringIndex = 0;

  for (const parameter of signature.parameters) {
    switch (parameter.type) {
      case 'i':
        integerCount++;
        break;
      case 's':
        stringCount++;
        stringIndex += parameter.stringPack === 'halfOfArea6' ? 1 : 2;
        break;
      case 'o':
        objectCount++;
        break;
      case 'p':
        pointCount++;
        break;
      case 'a':
      case 't': throw new Error(`Unexpected trigger parameter type '${parameter.type}' in action ${signature.name}`);
      default: throw new Error(`Unknown trigger parameter type '${parameter.type}' in action ${signature.name}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  const hasStrings = stringCount > 0;

  let integerScore = 0;
  const numbers = [action.a4, action.a6, action.a7];
  for (let i = 2; i >= 0; i -= 1) {
    if (numbers[i] !== 0) {
      integerScore = integerCount - i - 1;
      break;
    }
  }

  let stringScore = 0;
  const hasLeftoverA8 = stringIndex < 2 && action.a8 !== '';
  const hasLeftoverA9 = stringIndex < 4 && action.a9 !== '';
  if (hasLeftoverA8 || hasLeftoverA9) {
    stringCount -= 1;
    stringScore = stringCount - 1;
  }
  else {
    // a8/a9 hold at most 4 logical string (2 slots of (area6 + name) pairs), so indices will be 0..3
    for (let i = 3; i >= 0; i -= 1) {
      const value = splitHalfOfAreaStrings(signature, i, [action.a8, action.a9]);
      if (!isNothing(value) && value !== '') {
        stringScore = stringCount - i - 1;
        break;
      }
    }
  }

  let objectScore = 0;
  const objects = [action.a1, action.a2, action.a3];
  // by two objects slots a2 and a3, not a1 (a1 is ActionOverride target)
  for (let i = 2; i >= 1; i -= 1) {
    if (!isNothing(objects[i])) {
      objectScore = objectCount - i;
      break;
    }
  }

  let pointScore = 0;
  const point = just(action.a5point);
  if (point.x !== 0 || point.y !== 0) pointScore = pointCount - 1;

  const score = integerScore + stringScore + objectScore + pointScore;
  const parameterCount = integerCount + stringCount + objectCount + pointCount;
  const isMatch = integerScore >= 0
    && stringScore >= 0
    && objectScore >= 0
    && pointScore >= 0;

  return {
    score,
    parameterCount,
    isMatch,
    hasStrings,
  };
};

export const matchActionFunction = (
  action: ParsedBcsAction,
  signatures: Signatures,
): SignatureFunction => {
  const functions = signatures.byId.get(action.id);
  if (!functions) throw new Error(`Could not find action ${action.id} in ${signatures.resource}`);
  if (functions.length === 1) return functions[0]!;

  let best: Maybe<SignatureFunction> = nothing();
  let bestScore = Number.POSITIVE_INFINITY;
  let bestParams = Number.POSITIVE_INFINITY;
  let fallback: Maybe<SignatureFunction> = nothing();

  for (const signature of functions) {
    const {
      score,
      parameterCount,
      isMatch,
      hasStrings,
    } = scoreActionSignature(action, signature);

    const isFirstStringSignature = isNothing(fallback) && hasStrings;
    if (isFirstStringSignature) fallback = signature;

    if (isMatch && score <= bestScore && parameterCount < bestParams) {
      bestScore = score;
      bestParams = parameterCount;
      best = signature;
    }
  }

  return best ?? fallback ?? functions[0]!;
};
