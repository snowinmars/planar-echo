import { withoutExtension } from '@planar/shared';

import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';

import type { GhostSrc } from '@planar/shared';

export const buildSrcSkeleton = (src: GhostSrc): string => {
  const writer = createWriter();
  const id = withoutExtension(src.resourceName);

  writer.writeLine(`import type { GhostSrc } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${src.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}SrcSkeleton = () => {`);
  writer.writeLine(`const src: GhostSrc = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(src.resourceName)}',`, 4);
  writer.writeLine(`entries: [`, 4);
  for (const entry of src.entries) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`strref: ${entry.strref},`, 8);
    writer.writeLine(`weight: ${entry.weight},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return src;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}SrcSkeleton;`);

  return writer.done();
};
