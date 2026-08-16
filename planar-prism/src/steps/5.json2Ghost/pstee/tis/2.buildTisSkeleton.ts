import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';

import type { Writer } from '@/shared/writer.js';
import type { RawTis } from '@/steps/4.biffs2json/pstee/tis/parseTiss.types.js';
import type { RawTisPalette } from '@/steps/4.biffs2json/pstee/tis/v1/palette/parsePaletteTis.types.js';
import type { RawTisPvrz } from '@/steps/4.biffs2json/pstee/tis/v1/pvrz/parsePvrzTis.types.js';

const createLowercaseId = (resourceName: string): string => {
  const candidate = resourceName.split('.')[0]!.replaceAll(`'`, ``);
  return candidate;
};

const isTisPalette = (tis: RawTis): tis is RawTisPalette => tis.variant === 'palette';

const writeTisHeader = (writer: Writer, tis: RawTis): void => {
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: 'tis',`, 6);
  writer.writeLine(`version: 'v1',`, 6);
  writer.writeLine(`tileCount: ${tis.header.tileCount},`, 6);
  writer.writeLine(`tileSize: ${tis.header.tileSize},`, 6);
  writer.writeLine(`headerSize: ${tis.header.headerSize},`, 6);
  writer.writeLine(`tileDimension: ${tis.header.tileDimension},`, 6);
  writer.writeLine(`},`, 4);
};

const writeTisPalette = (writer: Writer, tis: RawTisPalette): void => {
  const id = createLowercaseId(tis.resourceName);
  writer.writeLine(`import type { GhostTisPalette } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${tis.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}TisSkeleton = () => {`);
  writer.writeLine(`const tis: GhostTisPalette = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(tis.resourceName)}',`, 4);
  writeTisHeader(writer, tis);
  writer.writeLine(`variant: 'palette',`, 4);
  writer.writeLine(`columns: ${tis.columns},`, 4);
  writer.writeLine(`rows: ${tis.rows},`, 4);
  writer.writeLine(`atlasWidthSource: '${tis.atlasWidthSource}',`, 4);
  writer.writeLine(`imageName: '${escapeSingleQuote(tis.imageName)}',`, 4);
  writer.writeLine(`paletteName: '${escapeSingleQuote(tis.paletteName)}',`, 4);
  writer.writeLine(`indicesName: '${escapeSingleQuote(tis.indicesName)}',`, 4);
  writer.writeLine(`tiles: [`, 4);
  for (const tile of tis.tiles) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${tile.index},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return tis;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}TisSkeleton;`);
};

const writeTisPvrz = (writer: Writer, tis: RawTisPvrz): void => {
  const id = createLowercaseId(tis.resourceName);
  writer.writeLine(`import type { GhostTisPvrz } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${tis.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}TisSkeleton = () => {`);
  writer.writeLine(`const tis: GhostTisPvrz = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(tis.resourceName)}',`, 4);
  writeTisHeader(writer, tis);
  writer.writeLine(`variant: 'pvrz',`, 4);
  writer.writeLine(`columns: ${tis.columns},`, 4);
  writer.writeLine(`rows: ${tis.rows},`, 4);
  writer.writeLine(`atlasWidthSource: '${tis.atlasWidthSource}',`, 4);
  writer.writeLine(`imageName: '${escapeSingleQuote(tis.imageName)}',`, 4);
  writer.writeLine(`tiles: [`, 4);
  for (const tile of tis.tiles) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`index: ${tile.index},`, 8);
    writer.writeLine(`page: ${tile.page},`, 8);
    writer.writeLine(`x: ${tile.x},`, 8);
    writer.writeLine(`y: ${tile.y},`, 8);
    if (tile.pvrzResourceName === null || tile.pvrzResourceName === undefined) {
      writer.writeLine(`pvrzResourceName: null,`, 8);
    }
    else {
      writer.writeLine(`pvrzResourceName: '${escapeSingleQuote(tile.pvrzResourceName)}',`, 8);
    }
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return tis;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}TisSkeleton;`);
};

const buildTisSkeleton = (tis: RawTis): string => {
  const writer = createWriter();
  if (isTisPalette(tis)) writeTisPalette(writer, tis);
  else writeTisPvrz(writer, tis);
  return writer.done();
};

export default buildTisSkeleton;
