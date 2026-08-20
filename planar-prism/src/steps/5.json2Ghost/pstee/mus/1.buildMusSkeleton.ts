import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';
import { isNothing } from '@planar/shared';

import type { Writer } from '@/shared/writer.js';
import type { RawMus, RawMusSegment } from '@/steps/4.biffs2json/pstee/mus/index.js';

const writeSegment = (writer: Writer, segment: RawMusSegment): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`entry: '${escapeSingleQuote(segment.entry)}',`, 8);
  writer.writeLine(`isSilence: ${segment.isSilence},`, 8);

  if (!isNothing(segment.next)) {
    writer.writeLine(`next: {`, 8);
    if (segment.next.subfolder) writer.writeLine(`subfolder: '${segment.next.subfolder}',`, 10);
    writer.writeLine(`entry: '${escapeSingleQuote(segment.next.entry)}',`, 10);
    writer.writeLine(`},`, 8);
  }

  if (!isNothing(segment.tag)) {
    writer.writeLine(`tag: {`, 8);
    writer.writeLine(`entry: '${escapeSingleQuote(segment.tag.entry)}',`, 10);
    writer.writeLine(`},`, 8);
  }

  writer.writeLine(`},`, 6);
};

export const buildMusSkeleton = (mus: RawMus): string => {
  const writer = createWriter();
  const id = mus.resourceName.split('.')[0]!;

  writer.writeLine(`import type { GhostMus } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${mus.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}MusSkeleton = () => {`);
  writer.writeLine(`const mus: GhostMus = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(mus.resourceName)}',`, 4);
  writer.writeLine(`subfolder: '${escapeSingleQuote(mus.subfolder)}',`, 4);
  writer.writeLine(`count: ${mus.count},`, 4);

  //
  writer.writeLine(`segments: [`, 4);
  for (const segment of mus.segments) writeSegment(writer, segment);
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return mus;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}MusSkeleton;`);

  return writer.done();
};
