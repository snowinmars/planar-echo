import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeNumberArray } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostBamV2 } from '@planar/shared';

export const buildBamSkeletonV2 = (bam: GhostBamV2): string => {
  const writer = createWriter();
  const id = withoutExtension(bam.resourceName);

  writer.writeLine(`import type { GhostBamV2 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${bam.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}BamSkeleton = () => {`);
  writer.writeLine(`const bam: GhostBamV2 = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(bam.resourceName)}',`, 4);
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: '${bam.header.signature}',`, 6);
  writer.writeLine(`version: '${bam.header.version}',`, 6);
  writer.writeLine(`framesCount: ${bam.header.framesCount},`, 6);
  writer.writeLine(`cyclesCount: ${bam.header.cyclesCount},`, 6);
  writer.writeLine(`dataBlockCount: ${bam.header.dataBlockCount},`, 6);
  writer.writeLine(`framesOffset: ${bam.header.framesOffset},`, 6);
  writer.writeLine(`cyclesOffset: ${bam.header.cyclesOffset},`, 6);
  writer.writeLine(`blocksOffset: ${bam.header.blocksOffset},`, 6);
  writer.writeLine(`},`, 4);
  writer.writeLine(`imageName: '${escapeSingleQuote(bam.imageName)}',`, 4);
  writer.writeLine(`atlasWidth: ${bam.atlasWidth},`, 4);
  writer.writeLine(`atlasHeight: ${bam.atlasHeight},`, 4);
  writer.writeLine(`frames: [`, 4);
  for (const frame of bam.frames) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${frame.index},`, 8);
    writer.writeLine(`width: ${frame.width},`, 8);
    writer.writeLine(`height: ${frame.height},`, 8);
    writer.writeLine(`centerX: ${frame.centerX},`, 8);
    writer.writeLine(`centerY: ${frame.centerY},`, 8);
    writer.writeLine(`dataBlockIndex: ${frame.dataBlockIndex},`, 8);
    writer.writeLine(`dataBlockCount: ${frame.dataBlockCount},`, 8);
    writer.writeLine(`atlasX: ${frame.atlasX},`, 8);
    writer.writeLine(`atlasY: ${frame.atlasY},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);
  writer.writeLine(`cycles: [`, 4);
  for (const cycle of bam.cycles) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${cycle.index},`, 8);
    writer.writeLine(`framesCount: ${cycle.framesCount},`, 8);
    writer.writeLine(`firstFrame: ${cycle.firstFrame},`, 8);
    writeNumberArray(writer, 'frameIndices', cycle.frameIndices, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);
  writer.writeLine(`blocks: [`, 4);
  for (const block of bam.blocks) {
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
  writer.writeLine('return bam;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}BamSkeleton;`);

  return writer.done();
};
