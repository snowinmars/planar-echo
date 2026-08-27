import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostMosV2 } from '@planar/shared';

export const buildMosSkeletonV2 = (mos: GhostMosV2): string => {
  const writer = createWriter();
  const id = withoutExtension(mos.resourceName);

  writer.writeLine(`import type { GhostMosV2 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${mos.resourceName}`);
  writer.writeLine(' */');

  writer.writeLine(`const _${id}MosSkeleton = () => {`);
  writer.writeLine(`const mos: GhostMosV2 = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(mos.resourceName)}',`, 4);

  //
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: 'mos',`, 6);
  writer.writeLine(`version: 'v2',`, 6);
  writer.writeLine(`width: ${mos.header.width},`, 6);
  writer.writeLine(`height: ${mos.header.height},`, 6);
  writer.writeLine(`blockCount: ${mos.header.blockCount},`, 6);
  writer.writeLine(`blocksOffset: ${mos.header.blocksOffset},`, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine(`imageName: '${escapeSingleQuote(mos.imageName)}',`, 4);

  //
  writer.writeLine(`blocks: [`, 4);
  for (const block of mos.blocks) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${block.index},`, 8);
    writer.writeLine(`page: ${block.page},`, 8);
    writer.writeLine(`pvrzResourceName: '${escapeSingleQuote(block.pvrzResourceName)}',`, 8);
    writer.writeLine(`sourceX: ${block.sourceX},`, 8);
    writer.writeLine(`sourceY: ${block.sourceY},`, 8);
    writer.writeLine(`width: ${block.width},`, 8);
    writer.writeLine(`height: ${block.height},`, 8);
    writer.writeLine(`targetX: ${block.targetX},`, 8);
    writer.writeLine(`targetY: ${block.targetY},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return mos;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}MosSkeleton;`);

  return writer.done();
};
