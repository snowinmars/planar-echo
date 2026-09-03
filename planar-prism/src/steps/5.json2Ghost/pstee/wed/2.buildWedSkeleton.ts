import { withoutExtension } from '@planar/shared';

import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';

import type { GhostWed, GhostWedPolygon } from '@planar/shared';

import type { Writer } from '@/shared/writer.js';

const writeNumberArray = (writer: Writer, propertyName: string, values: number[], offset: number): void => {
  writer.writeLine(`${propertyName}: [`, offset);
  for (const value of values) writer.writeLine(`${value},`, offset + 2);
  writer.writeLine(`],`, offset);
};

const writePolygon = (writer: Writer, polygon: GhostWedPolygon, offset: number): void => {
  writer.writeLine(`{`, offset);
  writer.writeLine(`vertexStartingIndex: ${polygon.vertexStartingIndex},`, offset + 2);
  writer.writeLine(`vertexCount: ${polygon.vertexCount},`, offset + 2);
  writeFlags(writer, polygon.flags, 'flags', offset + 2);
  writer.writeLine(`height: ${polygon.height},`, offset + 2);
  writer.writeLine(`minX: ${polygon.minX},`, offset + 2);
  writer.writeLine(`maxX: ${polygon.maxX},`, offset + 2);
  writer.writeLine(`minY: ${polygon.minY},`, offset + 2);
  writer.writeLine(`maxY: ${polygon.maxY},`, offset + 2);
  writer.writeLine(`},`, offset);
};

export const buildWedSkeleton = (wed: GhostWed): string => {
  const id = withoutExtension(wed.resourceName);
  const writer = createWriter();

  writer.writeLine(`import type { GhostWed } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${wed.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}WedSkeleton = () => {`);
  writer.writeLine(`const wed: GhostWed = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(wed.resourceName)}',`, 4);

  //
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: 'wed',`, 6);
  writer.writeLine(`version: 'v1.3',`, 6);
  writer.writeLine(`overlaysCount: ${wed.header.overlaysCount},`, 6);
  writer.writeLine(`doorsCount: ${wed.header.doorsCount},`, 6);
  writer.writeLine(`wallPolygonCount: ${wed.header.wallPolygonCount},`, 6);
  writer.writeLine(`},`, 4);

  //
  writer.writeLine(`overlays: [`, 4);
  for (const overlay of wed.overlays) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`width: ${overlay.width},`, 8);
    writer.writeLine(`height: ${overlay.height},`, 8);
    writer.writeLine(`tileset: '${escapeSingleQuote(overlay.tileset)}.tis',`, 8);
    writer.writeLine(`uniqueTileCount: ${overlay.uniqueTileCount},`, 8);
    writer.writeLine(`movementType: ${overlay.movementType},`, 8);

    //
    writer.writeLine(`tilemaps: [`, 8);
    for (const tilemap of overlay.tilemaps) {
      writer.writeLine(`{`, 10);
      writer.writeLine(`tileIndexLookupStart: ${tilemap.tileIndexLookupStart},`, 12);
      writer.writeLine(`tileIndexLookupCount: ${tilemap.tileIndexLookupCount},`, 12);
      writer.writeLine(`secondaryTileIndex: ${tilemap.secondaryTileIndex},`, 12);
      writeFlags(writer, tilemap.drawOverlays, 'drawOverlays', 12);
      writer.writeLine(`animationSpeed: ${tilemap.animationSpeed},`, 12);
      writeNumberArray(writer, 'tileIndices', tilemap.tileIndices, 12);
      writer.writeLine(`},`, 10);
    }
    writer.writeLine(`],`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  //
  writer.writeLine(`vertices: [`, 4);
  for (const vertex of wed.vertices) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`x: ${vertex.x},`, 8);
    writer.writeLine(`y: ${vertex.y},`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  //
  writer.writeLine(`wallPolygons: [`, 4);
  for (const polygon of wed.wallPolygons) writePolygon(writer, polygon, 6);
  writer.writeLine(`],`, 4);

  //
  writer.writeLine(`doors: [`, 4);
  for (const door of wed.doors) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`name: '${escapeSingleQuote(door.name)}',`, 8);
    writer.writeLine(`isOpen: ${door.isOpen},`, 8);
    writer.writeLine(`firstDoorTileCellIndex: ${door.firstDoorTileCellIndex},`, 8);
    writer.writeLine(`doorTileCellCount: ${door.doorTileCellCount},`, 8);
    writer.writeLine(`openPolygonCount: ${door.openPolygonCount},`, 8);
    writer.writeLine(`closedPolygonCount: ${door.closedPolygonCount},`, 8);
    writeNumberArray(writer, 'doorTileCells', door.doorTileCells, 8);
    writer.writeLine(`openPolygons: [`, 8);
    for (const polygon of door.openPolygons) writePolygon(writer, polygon, 10);
    writer.writeLine(`],`, 8);
    writer.writeLine(`closedPolygons: [`, 8);
    for (const polygon of door.closedPolygons) writePolygon(writer, polygon, 10);
    writer.writeLine(`],`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  //
  writer.writeLine(`wallGroups: [`, 4);
  for (const group of wed.wallGroups) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`lookupStart: ${group.lookupStart},`, 8);
    writer.writeLine(`lookupCount: ${group.lookupCount},`, 8);
    writeNumberArray(writer, 'polygonIndices', group.polygonIndices, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writeNumberArray(writer, 'polygonIndicesLookupTable', wed.polygonIndicesLookupTable, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return wed;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}WedSkeleton;`);

  return writer.done();
};
