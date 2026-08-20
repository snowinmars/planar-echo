import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';
import { isMosV1 } from '@/steps/4.biffs2json/pstee/mos/index.js';

import type { RawMos, RawMosV1, RawMosV2 } from '@/steps/4.biffs2json/pstee/mos/index.js';

const writeMosV1 = (mos: RawMosV1): string => {
  const writer = createWriter();
  const id = mos.resourceName.split('.')[0]!;

  writer.writeLine(`import type { GhostMosV1 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${mos.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}MosSkeleton = () => {`);
  writer.writeLine(`const mos: GhostMosV1 = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(mos.resourceName)}',`, 4);

  //
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: 'mos',`, 6);
  writer.writeLine(`version: 'v1',`, 6);
  writer.writeLine(`width: ${mos.header.width},`, 6);
  writer.writeLine(`height: ${mos.header.height},`, 6);
  writer.writeLine(`columns: ${mos.header.columns},`, 6);
  writer.writeLine(`rows: ${mos.header.rows},`, 6);
  writer.writeLine(`blockSize: ${mos.header.blockSize},`, 6);
  writer.writeLine(`paletteOffset: ${mos.header.paletteOffset},`, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine(`imageName: '${escapeSingleQuote(mos.imageName)}',`, 4);

  //
  writer.writeLine(`paletteLayout: {`, 4);
  writer.writeLine(`format: 'bgra',`, 6);
  writer.writeLine(`entryBytes: ${mos.paletteLayout.entryBytes},`, 6);
  writer.writeLine(`entriesPerBlock: ${mos.paletteLayout.entriesPerBlock},`, 6);
  writer.writeLine(`blocksCount: ${mos.paletteLayout.blocksCount},`, 6);
  writer.writeLine(`blockStride: ${mos.paletteLayout.blockStride},`, 6);
  writer.writeLine(`colorKey: 'green',`, 6);
  writer.writeLine(`},`, 4);
  writer.writeLine(`indicesLayout: {`, 4);
  writer.writeLine(`format: 'uint8-index',`, 6);

  //
  writer.writeLine(`blocks: [`, 6);
  for (const block of mos.indicesLayout.blocks) {
    writer.writeLine(`{`, 8);
    writer.writeLine(`index: ${block.index},`, 10);
    writer.writeLine(`col: ${block.col},`, 10);
    writer.writeLine(`row: ${block.row},`, 10);
    writer.writeLine(`width: ${block.width},`, 10);
    writer.writeLine(`height: ${block.height},`, 10);
    writer.writeLine(`byteOffset: ${block.byteOffset},`, 10);
    writer.writeLine(`byteLength: ${block.byteLength},`, 10);
    writer.writeLine(`},`, 8);
  }
  writer.writeLine(`],`, 6);
  writer.writeLine(`},`, 4);

  //
  writer.writeLine(`blocks: [`, 4);
  for (const block of mos.blocks) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${block.index},`, 8);
    writer.writeLine(`col: ${block.col},`, 8);
    writer.writeLine(`row: ${block.row},`, 8);
    writer.writeLine(`width: ${block.width},`, 8);
    writer.writeLine(`height: ${block.height},`, 8);
    writer.writeLine(`paletteByteOffset: ${block.paletteByteOffset},`, 8);
    writer.writeLine(`lookupOffset: ${block.lookupOffset},`, 8);
    writer.writeLine(`pixelDataOffset: ${block.pixelDataOffset},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return mos;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}MosSkeleton;`);

  return writer.done();
};

const writeMosV2 = (mos: RawMosV2): string => {
  const writer = createWriter();
  const id = mos.resourceName.split('.')[0]!;

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

export const buildMosSkeleton = (mos: RawMos): string => {
  if (isMosV1(mos)) return writeMosV1(mos);
  else return writeMosV2(mos);
};
