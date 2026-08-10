import { formatArg } from './formatArg.js';
import { BCS_SPECIALS, ieNameToMethod } from './nameMap.js';

import type { DiscoverNext } from '@/discoverer.types.js';
import type { BlockFunction, BcsArg } from '@/steps/4.biffs2json/pstee/bcs/parseBcs.types.js';

const quote = (s: string): string => `'${s.replaceAll(`'`, `\\'`)}'`;

/** Explicitly supported IE function names for codegen. Missing → throw. */
export const MAPPED_IE_FUNCTIONS = new Set([
  'setglobal',
  'incrementglobal',
  'global',
  'globalgt',
  'globallt',
  'wait',
  'waitrandom',
  'faceobject',
  'dialogue',
  'dialog',
  'endcutscenemode',
  'startcutscenemode',
  'moveviewobject',
  'playsequence',
  'returntosavedplace',
  'nearsavedlocationpst',
  'wasindialog',
  'actionoverride',
  'triggeroverride',
  'entered',
  'see',
  'exists',
  'attackedby',
  'allegiance',
  'help',
  'attack',
  'enemy',
  'die',
  'true', // special — not mapped here
  'clicked',
  'range',
  'areacheck',
  'nearestenemyof',
  'lastattackerof',
  'mostdamagedof',
  'createcreature',
  'floatmessage',
  'changeaiscript',
  'movetopoint',
  'oncreation',
  'team',
  'hppercentlt',
  'starttimer',
  'timeractive',
  'runawayfrom',
  'nearlocation',
  'spellres',
]);

const isGlobalLike = (name: string): boolean =>
  name === 'setglobal' || name === 'incrementglobal'
  || name === 'global' || name === 'globalgt' || name === 'globallt';

const mapGlobalLike = (
  fn: BlockFunction,
  discover: DiscoverNext,
): string => {
  const varName = fn.args[0];
  const envName = fn.args[1];
  const amount = fn.args[2];
  if (!varName || varName.kind !== 'string') throw new Error(`${fn.name}: expected string variable`);
  if (!envName || envName.kind !== 'string') throw new Error(`${fn.name}: expected string env`);

  discover({ type: 'variable', name: varName.value, env: envName.value });

  const variableId = quote(varName.value);
  const envId = quote(envName.value);

  if (fn.name === 'setglobal') {
    if (!amount || amount.kind !== 'int') throw new Error('setglobal: expected int amount');
    discover({ type: 'variable', name: varName.value, env: envName.value, extendValueSpectreWith: amount.value, forceType: 'number' });
    return `l.setValue({ variableId: ${variableId}, envId: ${envId}, amount: ${amount.value} })`;
  }
  if (fn.name === 'incrementglobal') {
    if (!amount || amount.kind !== 'int') throw new Error('incrementglobal: expected int amount');
    discover({ type: 'variable', name: varName.value, env: envName.value, extendValueSpectreWith: amount.value, forceType: 'number' });
    return `l.increment({ variableId: ${variableId}, envId: ${envId}, amount: ${amount.value} })`;
  }
  if (fn.name === 'global') {
    if (!amount || amount.kind !== 'int') throw new Error('global: expected int amount');
    return `l.getValueEq({ variableId: ${variableId}, envId: ${envId}, amount: ${amount.value} })`;
  }
  if (fn.name === 'globalgt') {
    if (!amount || amount.kind !== 'int') throw new Error('globalgt: expected int amount');
    return `l.getValueGt({ variableId: ${variableId}, envId: ${envId}, amount: ${amount.value} })`;
  }
  if (fn.name === 'globallt') {
    if (!amount || amount.kind !== 'int') throw new Error('globallt: expected int amount');
    return `l.getValueLt({ variableId: ${variableId}, envId: ${envId}, amount: ${amount.value} })`;
  }
  throw new Error(`Unhandled global-like ${fn.name}`);
};

const mapOverride = (
  fn: BlockFunction,
  myselfExpr: string,
  discover: DiscoverNext,
  asTrigger: boolean,
): string => {
  const target = fn.args[0];
  const nested = fn.args[1];
  if (!target || !nested || nested.kind !== 'function') {
    throw new Error(`${fn.name}: expected (target, function)`);
  }
  const targetExpr = formatArg(target, myselfExpr, discover);
  const innerFn: BlockFunction = {
    name: nested.name,
    negated: false,
    args: nested.args,
  };
  const inner = mapFunctionCall(innerFn, myselfExpr, discover, asTrigger);
  if (asTrigger) return `l.triggerOverride(${targetExpr}, () => ${inner})`;
  return `l.actionOverride(${targetExpr}, () => { ${inner}; })`;
};

const genericCall = (
  fn: BlockFunction,
  myselfExpr: string,
  discover: DiscoverNext,
): string => {
  const method = ieNameToMethod(fn.name);
  const args = fn.args.map((a: BcsArg) => formatArg(a, myselfExpr, discover));
  return args.length ? `l.${method}(${args.join(', ')})` : `l.${method}()`;
};

export const mapFunctionCall = (
  fn: BlockFunction,
  myselfExpr: string,
  discover: DiscoverNext,
  _asCondition: boolean,
): string => {
  const name = fn.name.toLowerCase();
  if (BCS_SPECIALS.has(name)) {
    throw new Error(`Special '${name}' must be handled by skeleton builder, not mapFunctionCall`);
  }

  if (!MAPPED_IE_FUNCTIONS.has(name)) {
    throw new Error(`No BCS→ScriptLogic mapper for '${fn.name}'. Add it to MAPPED_IE_FUNCTIONS / mapFunction.ts`);
  }

  if (name === 'actionoverride') return mapOverride(fn, myselfExpr, discover, false);
  if (name === 'triggeroverride') return mapOverride(fn, myselfExpr, discover, true);
  if (isGlobalLike(name)) {
    const call = mapGlobalLike(fn, discover);
    return fn.negated ? `!(${call})` : call;
  }

  if (name === 'wait') {
    const sec = fn.args[0];
    if (!sec || sec.kind !== 'int') throw new Error('wait: expected int');
    return `l.wait(${sec.value})`;
  }

  if (name === 'faceobject') {
    const to = fn.args[0];
    if (!to) throw new Error('faceobject: missing target');
    return `l.faceObject({ whoId: ${myselfExpr}, to: ${formatArg(to, myselfExpr, discover)} })`;
  }

  if (name === 'dialogue' || name === 'dialog') {
    const who = fn.args[0];
    if (!who) throw new Error('dialogue: missing target');
    return `l.dialogue(${formatArg(who, myselfExpr, discover)})`;
  }

  if (name === 'endcutscenemode') return 'l.endCutsceneMode()';
  if (name === 'startcutscenemode') return 'l.startCutsceneMode()';

  if (name === 'waitrandom') {
    const a = fn.args[0];
    const b = fn.args[1];
    if (!a || a.kind !== 'int' || !b || b.kind !== 'int') throw new Error('waitrandom: expected two ints');
    return `l.waitRandom(${a.value}, ${b.value})`;
  }

  if (name === 'playsequence') {
    const seq = fn.args[0];
    if (!seq) throw new Error('playsequence: missing sequence');
    const seqExpr = formatArg(seq, myselfExpr, discover);
    if (seq.kind === 'int' && seq.symbol) discover({ type: 'sequence', name: seq.symbol.toLowerCase() });
    return `l.playSequence(${myselfExpr}, ${seqExpr})`;
  }

  if (name === 'returntosavedplace') {
    return `l.returnToSavedPlace(${myselfExpr})`;
  }

  if (name === 'nearsavedlocationpst') {
    const dist = fn.args[0];
    if (!dist || dist.kind !== 'int') throw new Error('nearsavedlocationpst: expected int');
    const call = `l.nearSavedLocationPst(${dist.value})`;
    return fn.negated ? `!(${call})` : call;
  }

  if (name === 'wasindialog') {
    const call = 'l.wasInDialog()';
    return fn.negated ? `!(${call})` : call;
  }

  if (name === 'moveviewobject') {
    const who = fn.args[0];
    const speed = fn.args[1];
    if (!who || !speed) throw new Error('moveviewobject: missing args');
    if (speed.kind === 'int' && speed.symbol) discover({ type: 'speed', name: speed.symbol.toLowerCase() });
    return `l.moveViewObject(${formatArg(who, myselfExpr, discover)}, ${formatArg(speed, myselfExpr, discover)})`;
  }

  const call = genericCall(fn, myselfExpr, discover);
  return fn.negated ? `!(${call})` : call;
};
