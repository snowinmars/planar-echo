import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeNumberArray } from '../../../5.json2Ghost/shared.js';
import { isBamV1 } from '../../../4.biffs2json/pstee/bam/index.js';

import type { RawBam, RawBamV1, RawBamV2 } from '../../../4.biffs2json/pstee/bam/index.js';

const writeBamV1 = (bam: RawBamV1): string => {
  const writer = createWriter();
  const id = bam.resourceName.split('.')[0]!;

  writer.writeLine(`import type { GhostBamV1 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${bam.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}BamSkeleton = () => {`);
  writer.writeLine(`const bam: GhostBamV1 = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(bam.resourceName)}',`, 4);

  //
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: '${bam.header.signature}',`, 6);
  writer.writeLine(`version: '${bam.header.version}',`, 6);
  writer.writeLine(`framesCount: ${bam.header.framesCount},`, 6);
  writer.writeLine(`cyclesCount: ${bam.header.cyclesCount},`, 6);
  writer.writeLine(`rleIndex: ${bam.header.rleIndex},`, 6);
  writer.writeLine(`framesOffset: ${bam.header.framesOffset},`, 6);
  writer.writeLine(`paletteOffset: ${bam.header.paletteOffset},`, 6);
  writer.writeLine(`lookupOffset: ${bam.header.lookupOffset},`, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine(`imageName: '${escapeSingleQuote(bam.imageName)}',`, 4);
  writer.writeLine(`atlasWidth: ${bam.atlasWidth},`, 4);
  writer.writeLine(`atlasHeight: ${bam.atlasHeight},`, 4);

  //
  writer.writeLine(`frames: [`, 4);
  for (const frame of bam.frames) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${frame.index},`, 8);
    writer.writeLine(`width: ${frame.width},`, 8);
    writer.writeLine(`height: ${frame.height},`, 8);
    writer.writeLine(`centerX: ${frame.centerX},`, 8);
    writer.writeLine(`centerY: ${frame.centerY},`, 8);
    writer.writeLine(`dataOffset: ${frame.dataOffset},`, 8);
    writer.writeLine(`compressed: ${frame.compressed},`, 8);
    writer.writeLine(`atlasX: ${frame.atlasX},`, 8);
    writer.writeLine(`atlasY: ${frame.atlasY},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  //
  writer.writeLine(`cycles: [`, 4);
  for (const cycle of bam.cycles) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${cycle.index},`, 8);
    writer.writeLine(`framesCount: ${cycle.framesCount},`, 8);
    writer.writeLine(`firstLookup: ${cycle.firstLookup},`, 8);
    writeNumberArray(writer, 'frameIndices', cycle.frameIndices, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  //
  writer.writeLine(`paletteLayout: {`, 4);
  writer.writeLine(`format: '${bam.paletteLayout.format}',`, 6);
  writer.writeLine(`entryBytes: ${bam.paletteLayout.entryBytes},`, 6);
  writer.writeLine(`entries: ${bam.paletteLayout.entries},`, 6);
  writer.writeLine(`transparentIndex: ${bam.paletteLayout.transparentIndex},`, 6);
  writer.writeLine(`},`, 4);

  //
  writer.writeLine(`indicesLayout: {`, 4);
  writer.writeLine(`format: '${bam.indicesLayout.format}',`, 6);
  writer.writeLine(`frames: [`, 6);
  for (const frame of bam.indicesLayout.frames) {
    writer.writeLine(`{`, 8);
    writer.writeLine(`index: ${frame.index},`, 10);
    writer.writeLine(`width: ${frame.width},`, 10);
    writer.writeLine(`height: ${frame.height},`, 10);
    writer.writeLine(`byteOffset: ${frame.byteOffset},`, 10);
    writer.writeLine(`byteLength: ${frame.byteLength},`, 10);
    writer.writeLine(`},`, 8);
  }
  writer.writeLine(`],`, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return bam;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}BamSkeleton;`);

  return writer.done();
};

const writeBamV2 = (bam: RawBamV2): string => {
  const writer = createWriter();
  const id = bam.resourceName.split('.')[0]!;

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

export const buildBamSkeleton = (bam: RawBam): string => {
  if (isBamV1(bam)) return writeBamV1(bam);
  else return writeBamV2(bam);
};
