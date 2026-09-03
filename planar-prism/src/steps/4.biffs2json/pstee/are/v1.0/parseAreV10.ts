import { nothing } from '@planar/shared';

import { parseHeader } from './1.parseHeader.js';
import { parseActors } from './2.parseActors.js';
import { parseRegions } from './3.parseRegions.js';
import { parseSpawnPoints } from './4.parseSpawnPoints.js';
import { parseEntrances } from './5.parseEntrances.js';
import { parseContainers } from './6.parseContainers.js';
import { parseItems } from './7.parseItems.js';
import { parseVertices } from './8.parseVertices.js';
import { parseAmbients } from './9.parseAmbients.js';
import { parseVariables } from './10.parseVariables.js';
import { parseDoors } from './12.parseDoors.js';
import { parseAnimations } from './13.parseAnimations.js';
import { parseTiledObjects } from './14.parseTiledObjects.js';
import { parseAutomapNotes } from './15.parseAutomapNotes.js';
import { parseProjectileTraps } from './16.parseProjectileTraps.js';
import { parseSong } from './17.parseSong.js';
import { parseRestInterruptions } from './18.parseRestInterruptions.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawIds } from '../../ids/index.js';
import type { RawAre } from '../parseAres.types.js';

type ParseAreV10Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
  creNames: ReadonlySet<string>;
  ids: Map<string, RawIds>;
}>;
export const parseAreV10 = ({
  reader,
  resourceName,
  creNames,
  ids,
}: ParseAreV10Props): RawAre => {
  const header = parseHeader(reader);

  const vertices = parseVertices({
    reader: reader.fork(header.verticesOffset),
    count: header.verticesCount,
  });

  const items = parseItems({
    reader: reader.fork(header.itemsOffset),
    count: header.itemsCount,
  });

  const actors = parseActors({
    reader: reader.fork(header.actorsOffset),
    count: header.actorsCount,
    creNames,
    resourceName,
    ids,
  });

  const regions = parseRegions({
    reader: reader.fork(header.regionsOffset),
    count: header.regionsCount,
    vertices,
  });

  const spawnPoints = parseSpawnPoints({
    reader: reader.fork(header.spawnPointsOffset),
    count: header.spawnPointsCount,
  });

  const entrances = parseEntrances({
    reader: reader.fork(header.entrancesOffset),
    count: header.entrancesCount,
  });

  const containers = parseContainers({
    reader: reader.fork(header.containersOffset),
    count: header.containersCount,
    items,
    vertices,
  });

  const ambients = parseAmbients({
    reader: reader.fork(header.ambientsOffset),
    count: header.ambientsCount,
  });

  const variables = parseVariables({
    reader: reader.fork(header.variablesOffset),
    count: header.variablesCount,
  });

  const exploredBitmaskName = header.exploredBitmaskSize === 0
    ? nothing()
    : `${resourceName}.explored`;

  const doors = parseDoors({
    reader: reader.fork(header.doorsOffset),
    count: header.doorsCount,
    vertices,
  });

  const animations = parseAnimations({
    reader: reader.fork(header.animationsOffset),
    count: header.animationsCount,
  });

  const tiledObjects = parseTiledObjects({
    reader: reader.fork(header.tiledObjectsOffset),
    count: header.tiledObjectsCount,
    vertices,
  });

  const automapNotes = parseAutomapNotes({
    reader: reader.fork(header.automapNotesOffset),
    count: header.automapNotesCount,
  });

  const projectileTraps = parseProjectileTraps({
    reader: reader.fork(header.projectileTrapsOffset),
    count: header.projectileTrapsCount,
  });

  const song = header.songOffset === 0
    ? nothing()
    : parseSong({
        reader: reader.fork(header.songOffset),
        ids,
      });

  const restInterruptions = header.restInterruptionsOffset === 0
    ? nothing()
    : parseRestInterruptions(reader.fork(header.restInterruptionsOffset));

  return {
    resourceName,
    header,
    actors,
    regions,
    spawnPoints,
    entrances,
    containers,
    ambients,
    variables,
    exploredBitmaskName,
    doors,
    animations,
    tiledObjects,
    automapNotes,
    projectileTraps,
    song,
    restInterruptions,
  };
};
