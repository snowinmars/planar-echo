import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeStringArray } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostTwoda } from '@planar/shared';

export const buildTwodaSkeleton = (twoda: GhostTwoda): string => {
  const writer = createWriter();
  const id = withoutExtension(twoda.resourceName);

  writer.writeLine(`import type { GhostTwoda } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${twoda.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}TwodaSkeleton = () => {`);
  writer.writeLine(`const twoda: GhostTwoda = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(twoda.resourceName)}',`, 4);
  writer.writeLine(`encrypted: ${twoda.encrypted},`, 4);
  writer.writeLine(`signature: '${escapeSingleQuote(twoda.signature)}',`, 4);
  writer.writeLine(`defaultValue: '${escapeSingleQuote(twoda.defaultValue)}',`, 4);
  writeStringArray(writer, 'columns', twoda.columns, 4);

  writer.writeLine(`rows: [`, 4);
  for (const row of twoda.rows) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`name: '${escapeSingleQuote(row.name)}',`, 8);
    writeStringArray(writer, 'cells', row.cells, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return twoda;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}TwodaSkeleton;`);

  return writer.done();
};
