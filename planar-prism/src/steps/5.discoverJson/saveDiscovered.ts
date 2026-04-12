import createWriter from '@/shared/writer.js';
import type { Pathes } from '../1.createPathes/index.js';
import type { Discovered } from './types.js';

const writeType = (typename: string, ids: (string | number)[]): string => {
  const writer = createWriter();

  writer.writeLine(`export type ${typename}`);
  writer.writeLine(`  = | '${ids[0]}'`);
  for (const id of ids.slice(1)) writer.writeLine(`    | '${id}'`);
  writer.writeLine(';');
  writer.br();

  return writer.done();
};

const saveDiscovered = async (discovered: Discovered, pathes: Pathes): Promise<void> => {
  const writtenNpcs = writeType('NpcId', discovered.npcs);
  const writtenStates = writeType('StateId', discovered.states);
  const writtenResponses = writeType('ResponseId', discovered.responses);
  const writtenJournals = writeType('JourlanId', discovered.journals);

  const writer = createWriter();

  writer.writeLine(writtenNpcs);
  writer.writeLine(writtenStates);
  writer.writeLine(writtenResponses);
  writer.writeLine(writtenJournals);

  await pathes.output.saveGhost.dialogues(`_enums.ts`, writer.done(), true);
};

export default saveDiscovered;
