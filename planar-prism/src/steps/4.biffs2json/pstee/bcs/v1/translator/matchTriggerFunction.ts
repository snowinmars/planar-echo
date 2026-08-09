import {
  isNothing,
  nothing,
} from '@planar/shared';
import { splitHalfOfAreaStrings } from './splitHalfOfAreaStrings.js';

import type { Maybe } from '@planar/shared';
import type { ParsedBcsTrigger } from '../bytecode.types.js';
import { isEmptyObject } from './isEmptyObject.js';
import type {
  SignatureFunction,
  Signatures,
} from '../signatures.types.js';

const findSignatures = (
  id: number,
  signatures: Signatures,
): SignatureFunction[] => {
  const direct = signatures.byId.get(id);
  if (direct) return direct;

  const alternate = signatures.byId.get(id ^ 0x4000);
  if (alternate) return alternate;

  throw new Error(`Could not find trigger 0x${id.toString(16)} in ${signatures.resource}`);
};

type ParameterCounts = Readonly<{
  integers: number;
  strings: number;
  objects: number;
}>;
const countParameters = (signature: SignatureFunction): ParameterCounts => {
  let integers = 0;
  let strings = 0;
  let objects = 0;

  for (const parameter of signature.parameters) {
    switch (parameter.type) {
      case 'i':
        integers++;
        break;
      case 's':
        strings++;
        break;
      case 'o':
        objects++;
        break;
      case 'p':
      case 'a':
      case 't': throw new Error(`Unsupported trigger parameter type ${parameter.type} in ${signature.name}`);
      default: throw new Error(`Unknown trigger parameter type '${parameter.type}' in ${signature.name}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return { integers, strings, objects };
};

type FunctionScore = Readonly<{
  parameterCount: number;
  primary: number;
  average: number;
}>;
const scoreSignature = (
  trigger: ParsedBcsTrigger,
  signature: SignatureFunction,
): FunctionScore => {
  const counts = countParameters(signature);

  let integerScore = 0;
  if (!isNothing(trigger.t1) && trigger.t1 !== 0) integerScore++;
  if (trigger.t2negated) integerScore++;
  if (!isNothing(trigger.t3) && trigger.t3 !== 0) integerScore++;
  integerScore -= counts.integers;

  let stringScore = 0;
  for (let i = 0; i < counts.strings; i++) {
    const value = splitHalfOfAreaStrings(signature, i, [trigger.t5, trigger.t6]); // TODO [snow]: why value may be '' here?
    if (!isNothing(value)) stringScore++;
  }
  stringScore -= counts.strings;

  const objectScore = (isEmptyObject(trigger.t7) ? 0 : 1) - counts.objects;
  const primary = Math.max(integerScore, stringScore, objectScore);
  const average = Math.max(0, integerScore + stringScore + objectScore);

  return {
    parameterCount: signature.parameters.length,
    primary,
    average,
  };
};

export const matchTriggerFunction = (
  trigger: ParsedBcsTrigger,
  signatures: Signatures,
): SignatureFunction => {
  const functions = findSignatures(trigger.id, signatures);
  if (functions.length === 1) return functions[0]!;

  let best: Maybe<SignatureFunction> = nothing();
  let bestPrimary = Number.POSITIVE_INFINITY;
  let bestAverage = Number.POSITIVE_INFINITY;
  let bestParameterCount = Number.POSITIVE_INFINITY;

  for (const signature of functions) {
    const score = scoreSignature(trigger, signature);
    const noWinner = isNothing(best);
    const betterPrimary = score.primary < bestPrimary;
    const tiedPrimary = score.primary === bestPrimary;
    const betterAverage = score.average < bestAverage;
    const tiedAverage = score.average === bestAverage;
    const moreCompact = score.parameterCount < bestParameterCount;
    const better = betterPrimary || (tiedPrimary && (betterAverage || (tiedAverage && moreCompact)));

    if (noWinner || better) {
      best = signature;
      bestPrimary = score.primary;
      bestAverage = score.average;
      bestParameterCount = score.parameterCount;
    }
  }

  if (isNothing(best)) {
    throw new Error(`No matching signature for trigger ${trigger.id}`);
  }
  return best;
};
