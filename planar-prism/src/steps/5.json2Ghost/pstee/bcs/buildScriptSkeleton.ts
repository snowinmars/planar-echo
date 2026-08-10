import createWriter from '@/shared/writer.js';
import { mapFunctionCall } from './mapFunction.js';
import { formatArg } from './formatArg.js';
import { BCS_SPECIALS } from './nameMap.js';

import type { DiscoverNext } from '@/discoverer.types.js';
import type {
  Bcs,
  BlockFunction,
  BlockScope,
  TempVariable,
} from '@/steps/4.biffs2json/pstee/bcs/parseBcs.types.js';

const formScriptId = (resourceName: string): string => {
  const base = resourceName.split('.')[0]!.replaceAll(`'`, '').toLowerCase();
  if (/^[0-9]/.test(base)) return `_${base}`;
  return base;
};

const emitTempAssignments = (
  temps: TempVariable[],
  myselfExpr: string,
  discover: DiscoverNext,
): string[] => temps.map((t) => {
  const value = formatArg(t.value, myselfExpr, discover);
  return `const ${t.name} = ${value};`;
});

const buildConditionSource = (
  scope: BlockScope,
  myselfExpr: string,
  discover: DiscoverNext,
): string => {
  const parts: string[] = [];
  const functions = scope.functions;

  for (let i = 0; i < functions.length; i++) {
    const fn = functions[i]!;
    const name = fn.name.toLowerCase();

    if (name === 'true') {
      parts.push(fn.negated ? 'false' : 'true');
      continue;
    }

    if (name === 'or') {
      const countArg = fn.args[0];
      if (!countArg || countArg.kind !== 'int') throw new Error('or(): expected int count');
      const count = countArg.value;
      const ored: string[] = [];
      for (let j = 0; j < count; j++) {
        i += 1;
        const next = functions[i];
        if (!next) throw new Error(`or(${count}): not enough following triggers`);
        const nextName = next.name.toLowerCase();
        if (nextName === 'true') {
          ored.push(next.negated ? 'false' : 'true');
          continue;
        }
        if (BCS_SPECIALS.has(nextName) && nextName !== 'true') {
          throw new Error(`Unexpected special '${nextName}' inside or()`);
        }
        ored.push(mapFunctionCall(next, myselfExpr, discover, true));
      }
      parts.push(`(\n      ${ored.join(' ||\n      ')}\n    )`);
      continue;
    }

    if (BCS_SPECIALS.has(name)) {
      throw new Error(`Unexpected special '${name}' in condition`);
    }

    parts.push(mapFunctionCall(fn, myselfExpr, discover, true));
  }

  if (parts.length === 0) return 'true';
  return parts.join(' &&\n    ');
};

const resolveCutSceneWhoId = (
  functions: BlockFunction[],
  myselfExpr: string,
  discover: DiscoverNext,
  kind: Bcs['kind'],
): { whoIdExpr: string; remaining: BlockFunction[] } => {
  if (functions.length === 0) {
    return { whoIdExpr: myselfExpr, remaining: functions };
  }

  const first = functions[0]!;
  if (first.name.toLowerCase() !== 'cutsceneid') {
    if (kind === 'cutscene') {
      throw new Error(`cutscene response in script must start with CutSceneId, got '${first.name}'`);
    }
    return { whoIdExpr: myselfExpr, remaining: functions };
  }

  const target = first.args[0];
  if (!target) throw new Error('CutSceneId: missing target');
  const whoIdExpr = formatArg(target, myselfExpr, discover);
  return { whoIdExpr, remaining: functions.slice(1) };
};

const buildResponse = (
  scope: BlockScope,
  myselfExpr: string,
  discover: DiscoverNext,
  kind: Bcs['kind'],
): Readonly<{
  weight: number;
  whoIdExpr: string;
  continueFlag: boolean;
  actionSources: string[];
  tempLines: string[];
}> => {
  const functions = [...scope.functions];
  let continueFlag = false;

  const last = functions[functions.length - 1];
  if (last && last.name.toLowerCase() === 'continue') {
    continueFlag = true;
    functions.pop();
  }

  const { whoIdExpr, remaining } = resolveCutSceneWhoId(functions, myselfExpr, discover, kind);
  const actionMyself = whoIdExpr;

  const actionSources = remaining.map((fn) => {
    const name = fn.name.toLowerCase();
    if (name === 'cutsceneid') throw new Error('CutSceneId only allowed as first action');
    if (name === 'continue') throw new Error('Continue must be last action');
    return mapFunctionCall(fn, actionMyself, discover, false);
  });

  return {
    weight: scope.weight,
    whoIdExpr,
    continueFlag,
    actionSources,
    tempLines: emitTempAssignments(scope.temps, actionMyself, discover),
  };
};

export const buildScriptSkeleton = (
  bcs: Bcs,
  discover: DiscoverNext,
): string => {
  const kind = bcs.kind ?? 'ai';
  const bcsWithKind: Bcs = { ...bcs, kind };
  const scriptId = formScriptId(bcsWithKind.resourceName);
  const myselfExpr = 'myself';
  const writer = createWriter();

  discover({ type: 'script', name: scriptId });

  writer.writeLine(`import type { ScriptLogic, ScriptDefinition } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${bcsWithKind.resourceName}`);
  writer.writeLine(` * kind: ${bcsWithKind.kind}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${scriptId}ScriptSkeleton = (`);
  writer.writeLine('l: ScriptLogic,', 2);
  writer.writeLine('{ myself }: { myself: string },', 2);
  writer.writeLine('): ScriptDefinition => ({');
  writer.writeLine(`kind: '${bcsWithKind.kind}',`, 2);
  writer.writeLine(`resourceName: '${bcsWithKind.resourceName.replaceAll(`'`, `\\'`)}',`, 2);
  writer.writeLine('blocks: [', 2);

  for (const block of bcsWithKind.blocks) {
    writer.writeLine('{', 4);

    const condTemps = emitTempAssignments(block.condition.temps, myselfExpr, discover);
    const conditionSource = buildConditionSource(block.condition, myselfExpr, discover);

    writer.writeLine('condition: (l, { myself }) => {', 6);
    for (const line of condTemps) writer.writeLine(line, 8);
    writer.writeLine('return (', 8);
    writer.writeLine(conditionSource, 10);
    writer.writeLine(');', 8);
    writer.writeLine('},', 6);

    writer.writeLine('responses: [', 6);
    for (const response of block.actions) {
      const built = buildResponse(response, myselfExpr, discover, bcsWithKind.kind);
      writer.writeLine('{', 8);
      writer.writeLine(`weight: ${built.weight},`, 10);
      writer.writeLine(`whoId: ${built.whoIdExpr},`, 10);
      writer.writeLine(`continue: ${built.continueFlag ? 'true' : 'false'},`, 10);
      writer.writeLine('actions: [', 10);

      if (built.tempLines.length > 0) {
        writer.writeLine('() => {', 12);
        for (const tempLine of built.tempLines) writer.writeLine(tempLine, 14);
        for (const action of built.actionSources) writer.writeLine(`${action};`, 14);
        writer.writeLine('},', 12);
      }
      else {
        for (const action of built.actionSources) {
          writer.writeLine(`() => { ${action}; },`, 12);
        }
      }

      writer.writeLine('],', 10);
      writer.writeLine('},', 8);
    }
    writer.writeLine('],', 6);
    writer.writeLine('},', 4);
  }

  writer.writeLine('],', 2);
  writer.writeLine('});');
  writer.br();
  writer.writeLine(`export default ${scriptId}ScriptSkeleton;`);

  return writer.done();
};
