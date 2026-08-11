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

type FindSignaturesProps = Readonly<{
  resourceName: string;
  id: number;
  signatures: Signatures;
}>;
const findSignatures = ({
  resourceName,
  id,
  signatures,
}: FindSignaturesProps): SignatureFunction[] => {
  const direct = signatures.byId.get(id);
  if (direct) return direct;

  const alternate = signatures.byId.get(id ^ 0x4000);
  if (alternate) return alternate;

  throw new Error(`Could not find trigger '0x${id.toString(16)}' in '${signatures.resource}' for resource '${resourceName}'`);
};

type ParameterCounts = Readonly<{
  integers: number;
  strings: number;
  objects: number;
}>;
type CountParametersProps = Readonly<{
  resourceName: string;
  signature: SignatureFunction;
}>;
const countParameters = ({
  resourceName,
  signature,
}: CountParametersProps): ParameterCounts => {
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
      case 't': throw new Error(`Unsupported trigger parameter type '${parameter.type}' in '${signature.name}' for resource '${resourceName}'`);
      default: throw new Error(`Unknown trigger parameter type '${parameter.type}' in '${signature.name}' for resource '${resourceName}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return { integers, strings, objects };
};

type FunctionScore = Readonly<{
  parameterCount: number;
  primary: number;
  average: number;
}>;
type ScoreSignatureProps = Readonly<{
  resourceName: string;
  trigger: ParsedBcsTrigger;
  signature: SignatureFunction;
}>;
const scoreSignature = ({
  resourceName,
  trigger,
  signature,
}: ScoreSignatureProps): FunctionScore => {
  const counts = countParameters({
    resourceName,
    signature,
  });

  let integerScore = 0;
  if (!isNothing(trigger.t1) && trigger.t1 !== 0) integerScore++;
  if (trigger.t2negated) integerScore++;
  if (!isNothing(trigger.t3) && trigger.t3 !== 0) integerScore++;
  integerScore -= counts.integers;

  let stringScore = 0;
  for (let i = 0; i < counts.strings; i++) {
    const value = splitHalfOfAreaStrings({
      functionSignature: signature,
      index: i,
      strings: [trigger.t5, trigger.t6],
    }); // TODO [snow]: why value may be '' here?
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

type MatchTriggerFunctionProps = Readonly<{
  resourceName: string;
  trigger: ParsedBcsTrigger;
  signatures: Signatures;
}>;
export const matchTriggerFunction = ({
  resourceName,
  trigger,
  signatures,
}: MatchTriggerFunctionProps): SignatureFunction => {
  const functions = findSignatures({
    resourceName,
    id: trigger.id,
    signatures,
  });
  if (functions.length === 1) return functions[0]!;

  let best: Maybe<SignatureFunction> = nothing();
  let bestPrimary = Number.POSITIVE_INFINITY;
  let bestAverage = Number.POSITIVE_INFINITY;
  let bestParameterCount = Number.POSITIVE_INFINITY;

  for (const signature of functions) {
    const score = scoreSignature({
      resourceName,
      trigger,
      signature,
    });
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
    throw new Error(`No matching signature for trigger '${trigger.id}' for resource '${resourceName}'`);
  }
  return best;
};
