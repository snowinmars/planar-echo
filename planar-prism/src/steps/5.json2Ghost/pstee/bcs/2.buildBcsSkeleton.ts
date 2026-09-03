import { withoutExtension } from '@planar/shared';

import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';

import type { GhostBcs, GhostBcsArg, GhostBcsBlockScope } from '@planar/shared';

import type { Writer } from '@/shared/writer.js';

const writeArgFields = (writer: Writer, arg: GhostBcsArg, offset: number): void => {
  switch (arg.kind) {
    case 'int':
      writer.writeLine(`kind: 'int',`, offset);
      writer.writeLine(`value: ${arg.value},`, offset);
      if (arg.symbol !== undefined) writer.writeLine(`symbol: '${escapeSingleQuote(arg.symbol)}',`, offset);
      return;
    case 'string':
      writer.writeLine(`kind: 'string',`, offset);
      writer.writeLine(`value: '${escapeSingleQuote(arg.value)}',`, offset);
      return;
    case 'point':
      writer.writeLine(`kind: 'point',`, offset);
      writer.writeLine(`x: ${arg.x},`, offset);
      writer.writeLine(`y: ${arg.y},`, offset);
      return;
    case 'ref':
      writer.writeLine(`kind: 'ref',`, offset);
      writer.writeLine(`name: '${escapeSingleQuote(arg.name)}',`, offset);
      return;
    case 'function':
      writer.writeLine(`kind: 'function',`, offset);
      writer.writeLine(`name: '${escapeSingleQuote(arg.name)}',`, offset);
      writer.writeLine(`args: [`, offset);
      for (const child of arg.args) {
        writer.writeLine(`{`, offset + 2);
        writeArgFields(writer, child, offset + 4);
        writer.writeLine(`},`, offset + 2);
      }
      writer.writeLine(`],`, offset);
      return;
  }
};

const writeScopeBody = (writer: Writer, scope: GhostBcsBlockScope, offset: number): void => {
  writer.writeLine(`weight: ${scope.weight},`, offset + 2);

  //
  writer.writeLine(`temps: [`, offset + 2);
  for (const temp of scope.temps) {
    writer.writeLine(`{`, offset + 4);
    writer.writeLine(`name: '${escapeSingleQuote(temp.name)}',`, offset + 6);
    writer.writeLine(`value: {`, offset + 6);
    writeArgFields(writer, temp.value, offset + 8);
    writer.writeLine(`},`, offset + 6);
    writer.writeLine(`},`, offset + 4);
  }
  writer.writeLine(`],`, offset + 2);

  //
  writer.writeLine(`functions: [`, offset + 2);
  for (const fn of scope.functions) {
    writer.writeLine(`{`, offset + 4);
    writer.writeLine(`name: '${escapeSingleQuote(fn.name)}',`, offset + 6);
    writer.writeLine(`negated: ${fn.negated},`, offset + 6);
    writer.writeLine(`args: [`, offset + 6);
    for (const arg of fn.args) {
      writer.writeLine(`{`, offset + 8);
      writeArgFields(writer, arg, offset + 10);
      writer.writeLine(`},`, offset + 8);
    }
    writer.writeLine(`],`, offset + 6);
    writer.writeLine(`},`, offset + 4);
  }
  writer.writeLine(`],`, offset + 2);
};

const knownBrokenBcsNames = new Map<string, string>([['.bcs', 'dot']]);
export const buildBcsSkeleton = (bcs: GhostBcs): string => {
  const id = knownBrokenBcsNames.get(bcs.resourceName) ?? withoutExtension(bcs.resourceName);
  const writer = createWriter();

  writer.writeLine(`import type { GhostBcs } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${bcs.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}BcsSkeleton = () => {`);
  writer.writeLine(`const bcs: GhostBcs = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(bcs.resourceName)}',`, 4);

  //
  writer.writeLine(`blocks: [`, 4);
  for (const block of bcs.blocks) {
    writer.writeLine(`{`, 6);

    //
    writer.writeLine(`condition: {`, 8);
    writeScopeBody(writer, block.condition, 8);
    writer.writeLine(`},`, 8);

    //
    writer.writeLine(`actions: [`, 8);
    for (const action of block.actions) {
      writer.writeLine(`{`, 10);
      writeScopeBody(writer, action, 10);
      writer.writeLine(`},`, 10);
    }

    writer.writeLine(`],`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return bcs;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}BcsSkeleton;`);

  return writer.done();
};
