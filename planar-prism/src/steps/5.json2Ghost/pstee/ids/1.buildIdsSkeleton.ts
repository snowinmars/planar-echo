import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';

import type { RawIds } from '@/steps/4.biffs2json/pstee/ids/index.js';

export const buildIdsSkeleton = (ids: RawIds): string => {
  const writer = createWriter();
  const id = ids.resourceName.split('.')[0]!;

  writer.writeLine(`import type { GhostIds } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${ids.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}IdsSkeleton = () => {`);
  writer.writeLine(`const ids: GhostIds = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(ids.resourceName)}',`, 4);

  //
  writer.writeLine(`header: {`, 4);
  if (ids.header.wrongSignature) writer.writeLine(`wrongSignature: 'ids.header.wrongSignature',`, 6);
  if (ids.header.wrongEntryCount) writer.writeLine(`wrongEntryCount: 'ids.header.wrongEntryCount',`, 6);
  writer.writeLine(`},`, 4);

  //
  writer.writeLine(`entries: new Map<number, string[]>([`, 4);
  for (const [key, names] of ids.entries) {
    writer.writeLine(`[${key}, [`, 6);
    for (const name of names) writer.writeLine(`'${escapeSingleQuote(name)}',`, 8);
    writer.writeLine(`]],`, 6);
  }
  writer.writeLine(`]),`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return ids;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}IdsSkeleton;`);

  return writer.done();
};
