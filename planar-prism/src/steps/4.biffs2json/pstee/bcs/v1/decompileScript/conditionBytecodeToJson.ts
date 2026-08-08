import {
  numberBytecodeToJson,
  splitHalfOfAreaStrings,
} from './decompileObject.js';
import { isNothing, just, nothing } from '@planar/shared';

import type { Signatures, SignatureFunction } from '../signatures.js';
import type { ParsedBcsObject, ParsedBcsTrigger } from '../bytecodeTypes.js';
import type { BlockFunction, BlockScope, DecompiledArg } from '../../types.js';
import type { Ids } from '../../../ids/types.js';
import type { Maybe } from '@planar/shared';
import { createVariableWrapper, type VariableWrapper } from './createVariableWrapper.js';
import { objectArgForScope } from './objectArgForScope.js';

const isTriggerObjectUsed = (object: Maybe<ParsedBcsObject>): boolean => {
  if (isNothing(object)) return false;

  const hasTargetFilters = !object.target.every(v => v === 0);
  const hasObjectIdentifiers = !object.identifier.every(v => v === 0);
  const hasName = !isNothing(object.name) && object.name !== '';
  const hasRegion = !isNothing(object.region);

  if (hasRegion) {
    if (object.region.x === -1
      || object.region.y === -1
      || object.region.width === -1
      || object.region.height === -1
    ) throw new Error('Wow'); // TODO [snow]: drop
  }
  return hasTargetFilters
    || hasObjectIdentifiers
    || hasName
    || hasRegion;
};

const getFunctionFromSignature = (id: number, signatures: Signatures): SignatureFunction[] => {
  const straightFunctions = signatures.byId.get(id);
  if (!isNothing(straightFunctions)) return straightFunctions;

  id ^= 0x4000; // TRIGGER.IDS ids are 0x4xxx; bytecode may omit/include the 0x4000 bit
  const xoredFunctions = signatures.byId.get(id);
  if (!isNothing(xoredFunctions)) return xoredFunctions;

  id ^= 0x4000;
  throw new Error(`Could not find trigger 0x${id.toString(16)} in ${signatures.resource}`);
};

type FunctionScoreByParametersNumber = Readonly<{
  usedInt: number;
  usedStr: number;
  usedObj: number;
}>;
const scoreByParametersNumber = (f: SignatureFunction): FunctionScoreByParametersNumber => {
  let usedInt = 0;
  let usedStr = 0;
  let usedObj = 0;

  for (const p of f.parameters) {
    switch (p.type) {
      case 'i': usedInt += 1; break;
      case 's': usedStr += 1; break;
      case 'o': usedObj += 1; break;
      case 'p':
      case 'a':
      case 't':
        throw new Error(`Unsupported trigger parameter type ${p.type} in ${f.name}`);
      default: break;
    }
  }

  return {
    usedInt,
    usedStr,
    usedObj,
  };
};

const scoreByPrimary = (trigger: ParsedBcsTrigger, usedInt: number): number => {
  let primaryScore = 0;
  if (!isNothing(trigger.t1) && trigger.t1 !== 0) primaryScore += 1;
  if (trigger.t2negated) primaryScore += 1;
  if (!isNothing(trigger.t3) && trigger.t3 !== 0) primaryScore += 1;
  primaryScore -= usedInt;

  return primaryScore;
};
const scoreByString = (trigger: ParsedBcsTrigger, f: SignatureFunction, usedStr: number): number => {
  const strings = [
    trigger.t5,
    trigger.t6,
  ];

  let scoreStr = 0;
  for (let i = 0; i < usedStr; i++) {
    const splitted = splitHalfOfAreaStrings({
      functionSignature: f,
      index: i,
      strings,
    });
    if (isNothing(splitted)) throw new Error('weird');
    else scoreStr += 1;
  }
  scoreStr -= usedStr;

  return scoreStr;
};
const scoreByObject = (trigger: ParsedBcsTrigger, usedObj: number): number => {
  let scoreObj = isTriggerObjectUsed(trigger.t7) ? 1 : 0;
  scoreObj -= usedObj;

  return scoreObj;
};

type FunctionScore = Readonly<{
  parametersCountScore: number;
  primaryScoreVal: number;
  scoreAvg: number;
}>;
const scoreFunction = (trigger: ParsedBcsTrigger, f: SignatureFunction): FunctionScore => {
  const {
    usedInt,
    usedStr,
    usedObj,
  } = scoreByParametersNumber(f);

  const primaryScore = scoreByPrimary(trigger, usedInt);
  const stringScore = scoreByString(trigger, f, usedStr);
  const objectScore = scoreByObject(trigger, usedObj);

  const parametersCountScore = f.parameters.length;
  const primaryScoreVal = Math.max(primaryScore, stringScore, objectScore);
  const scoreAvg = Math.max(0, primaryScore + stringScore + objectScore);

  return {
    parametersCountScore,
    primaryScoreVal,
    scoreAvg,
  };
};

/**
 * Port of Near Infinity BcsTrigger.getMatchingFunction().
 */
const matchTriggerFunction = (trigger: ParsedBcsTrigger, signatures: Signatures): SignatureFunction => {
  const functions = getFunctionFromSignature(trigger.id, signatures);

  if (functions.length === 1) return functions[0]!;

  let best: Maybe<SignatureFunction> = nothing();
  let bestPrimaryScoreVal = Number.POSITIVE_INFINITY;
  let bestScoreAvg = Number.POSITIVE_INFINITY;
  let bestParametersCountScore = Number.POSITIVE_INFINITY;

  for (const f of functions) {
    const {
      primaryScoreVal,
      scoreAvg,
      parametersCountScore,
    } = scoreFunction(trigger, f);

    const noWinnerYet = isNothing(best);
    const betterPrimaryScore = primaryScoreVal < bestPrimaryScoreVal;
    const tiedPrimaryScore = primaryScoreVal === bestPrimaryScoreVal;
    const betterAverageScore = scoreAvg < bestScoreAvg;
    const tiedAverageScore = scoreAvg === bestScoreAvg;
    const moreCompactSignature = parametersCountScore < bestParametersCountScore;
    const better = betterPrimaryScore || (
      tiedPrimaryScore && (
        betterAverageScore || (
          tiedAverageScore && moreCompactSignature
        )
      )
    );

    // TODO [snow]: simplify?
    if (noWinnerYet || better) {
      best = f;
      bestPrimaryScoreVal = primaryScoreVal;
      bestScoreAvg = scoreAvg;
      bestParametersCountScore = parametersCountScore;
    }
  }

  if (isNothing(best)) throw new Error(`No matching signature for trigger ${trigger.id}`);
  return best;
};

const isNextTriggerObject = (fn: SignatureFunction): boolean =>
  fn.name.toLowerCase() === 'nexttriggerobject' // TODO [snow]: check does toLowerCase required
  && fn.parameters.length === 1
  && fn.parameters[0]!.type === 'o';

const isOrTrigger = (fn: SignatureFunction): boolean =>
  fn.name.toLowerCase() === 'or' // TODO [snow]: check does toLowerCase required
  && fn.parameters.length === 1
  && fn.parameters[0]!.type === 'i';

type TriggerArgsBytecodeToJsonProps = Readonly<{
  trigger: ParsedBcsTrigger;
  functionSignature: SignatureFunction;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
}>;
const triggerArgsBytecodeToJson = ({
  trigger,
  functionSignature,
  ids,
  variableWrapper,
}: TriggerArgsBytecodeToJsonProps): DecompiledArg[] => {
  const args: DecompiledArg[] = [];
  let curNum = 0;
  let curString = 0;
  let curObj = 0;
  const strings = [trigger.t5, trigger.t6];
  const nums = [trigger.t1, trigger.t2negated, trigger.t3, trigger.t4];

  for (const p of functionSignature.parameters) {
    switch (p.type) {
      case 'i': {
        const value = nums[curNum] ?? 0;
        args.push(numberBytecodeToJson({
          value,
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
        if (isNothing(value)) throw new Error(`Cannot parse string parameter of trigger '${trigger.id}'`);
        args.push({ kind: 'string', value: value.toLowerCase() });
        curString += 1;
        break;
      }
      case 'o': {
        if (curObj !== 0) throw new Error(`Too many object params for trigger '${functionSignature.name}'`);
        args.push(objectArgForScope({
          object: just(trigger.t7),
          ids,
          variableWrapper,
        }));
        curObj += 1;
        break;
      }
      case 'p':
      case 'a':
      case 't': throw new Error(`Unsupported parameter type '${p.type}' in trigger '${functionSignature.name}'`);
      default: throw new Error(`Unknown parameter type '${p.type}' n trigger '${functionSignature.name}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return args;
};

type TriggerBytecodeToJsonProps = Readonly<{
  trigger: ParsedBcsTrigger;
  functionSignature: SignatureFunction;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
}>;
export const triggerBytecodeToJson = ({
  trigger,
  functionSignature,
  ids,
  variableWrapper,
}: TriggerBytecodeToJsonProps): BlockFunction => {
  if (functionSignature.name !== functionSignature.name.toLowerCase()) throw new Error('16532'); // TODO [snow]: drop it
  const name = functionSignature.name;
  const args = triggerArgsBytecodeToJson({
    trigger,
    functionSignature,
    ids,
    variableWrapper,
  });

  return {
    name,
    negated: !!trigger.t2negated,
    args,
  };
};

type TriggerOverrideBytecodeToJsonProps = Readonly<{
  nextTriggerObject: ParsedBcsTrigger;
  innerTrigger: ParsedBcsTrigger;
  innerTriggerSignatures: Signatures;
  ids: Map<string, Ids>;
  variableWrapper: VariableWrapper;
}>;
/** Combine NextTriggerObject + following trigger into TriggerOverride (NI sugar). */
export const triggerOverrideBytecodeToJson = ({
  nextTriggerObject,
  innerTrigger,
  innerTriggerSignatures,
  ids,
  variableWrapper,
}: TriggerOverrideBytecodeToJsonProps): BlockFunction => {
  const innerSig = matchTriggerFunction(innerTrigger, innerTriggerSignatures);
  const innerArgs = triggerArgsBytecodeToJson({
    trigger: innerTrigger,
    functionSignature: innerSig,
    ids,
    variableWrapper,
  });
  return {
    name: 'triggeroverride',
    negated: innerTrigger.t2negated ? true : false,
    args: [
      objectArgForScope({
        object: just(nextTriggerObject.t7),
        ids,
        variableWrapper,
      }),
      {
        kind: 'function',
        name: innerSig.name.toLowerCase(),
        args: innerArgs,
      },
    ],
  };
};

type DecompileConditionScopeProps = Readonly<{
  triggers: ParsedBcsTrigger[];
  triggerSignatures: Signatures;
  ids: Map<string, Ids>;
}>;
export const conditionBytecodeToJson = ({
  triggers,
  triggerSignatures,
  ids,
}: DecompileConditionScopeProps): BlockScope => {
  const variableWrapper = createVariableWrapper();

  let orCount = 0;
  let pendingTrigger: Maybe<ParsedBcsTrigger> = nothing();

  for (const trigger of triggers) {
    const preview = matchTriggerFunction(trigger, triggerSignatures);

    const nextTriggerObject = isNextTriggerObject(preview);
    if (nextTriggerObject) {
      if (isNothing(pendingTrigger)) {
        pendingTrigger = trigger;
        continue;
      }
      throw new Error(`Do not want to override pending trigger because of TriggerOverride policy`);
    }

    let fn: BlockFunction;
    let orPreview = preview;
    let orTrigger = trigger;

    if (isNothing(pendingTrigger)) {
      fn = triggerBytecodeToJson({
        trigger,
        functionSignature: preview,
        ids,
        variableWrapper,
      });
    }
    else {
      fn = triggerOverrideBytecodeToJson({
        nextTriggerObject: pendingTrigger,
        innerTrigger: trigger,
        innerTriggerSignatures: triggerSignatures,
        ids,
        variableWrapper,
      });
      pendingTrigger = nothing();
      // OR accounting uses the inner (non-NTO) trigger
      orPreview = preview;
      orTrigger = trigger;
    }

    if (orCount > 0) {
      orCount -= 1;
      variableWrapper.addFunction(fn);
      continue;
    }

    if (isOrTrigger(orPreview)) {
      orCount = just(orTrigger.t1);
      variableWrapper.addFunction(fn);
      continue;
    }

    variableWrapper.addFunction(fn);
  }

  // NI: dangling NextTriggerObject with no follower
  if (!isNothing(pendingTrigger)) {
    const pandingSignature = matchTriggerFunction(pendingTrigger, triggerSignatures);
    variableWrapper.addFunction(triggerBytecodeToJson({
      trigger: pendingTrigger,
      functionSignature: pandingSignature,
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
