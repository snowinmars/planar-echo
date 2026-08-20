import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';

import type { Writer } from '@/shared/writer.js';
import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/index.js';
import type { RawWedPolygon } from '@/steps/4.biffs2json/pstee/wed/v1.3/5.parsePolygons.types.js';

const writeNumberArray = (writer: Writer, propertyName: string, values: number[], offset: number): void => {
  writer.writeLine(`${propertyName}: [`, offset);
  for (const value of values) writer.writeLine(`${value},`, offset + 2);
  writer.writeLine(`],`, offset);
};

const writePolygon = (writer: Writer, polygon: RawWedPolygon, offset: number): void => {
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

const buildWedSkeleton = (wed: RawWed): string => {
  const id = wed.resourceName.split('.')[0]!;
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
  writer.writeLine(`overlaysOffset: ${wed.header.overlaysOffset},`, 6);
  writer.writeLine(`secondaryHeaderOffset: ${wed.header.secondaryHeaderOffset},`, 6);
  writer.writeLine(`doorsOffset: ${wed.header.doorsOffset},`, 6);
  writer.writeLine(`doorsTileCellsOffset: ${wed.header.doorsTileCellsOffset},`, 6);
  writer.writeLine(`},`, 4);

  //
  writer.writeLine(`overlays: [`, 4);
  for (const overlay of wed.overlays) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`width: ${overlay.width},`, 8);
    writer.writeLine(`height: ${overlay.height},`, 8);
    writer.writeLine(`tileset: '${escapeSingleQuote(overlay.tileset)}',`, 8);
    writer.writeLine(`uniqueTileCount: ${overlay.uniqueTileCount},`, 8);
    writer.writeLine(`movementType: ${overlay.movementType},`, 8);
    writer.writeLine(`tilemapOffset: ${overlay.tilemapOffset},`, 8);
    writer.writeLine(`tileIndexLookupOffset: ${overlay.tileIndexLookupOffset},`, 8);

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
  writer.writeLine(`secondaryHeader: {`, 4);
  writer.writeLine(`wallPolygonCount: ${wed.secondaryHeader.wallPolygonCount},`, 6);
  writer.writeLine(`polygonsOffset: ${wed.secondaryHeader.polygonsOffset},`, 6);
  writer.writeLine(`verticesOffset: ${wed.secondaryHeader.verticesOffset},`, 6);
  writer.writeLine(`wallGroupsOffset: ${wed.secondaryHeader.wallGroupsOffset},`, 6);
  writer.writeLine(`polygonIndicesLookupTableOffset: ${wed.secondaryHeader.polygonIndicesLookupTableOffset},`, 6);
  writer.writeLine(`},`, 4);

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
    writer.writeLine(`openPolygonsOffset: ${door.openPolygonsOffset},`, 8);
    writer.writeLine(`closedPolygonsOffset: ${door.closedPolygonsOffset},`, 8);
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

export default buildWedSkeleton;
