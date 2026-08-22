import { extendMap } from './1.parseHeader.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreHeaderV10 } from './1.parseHeader.types.js';
import { nothing } from '@planar/shared';

export const parseHeader = (reader: BufferReader): RawAreHeaderV10 => {
  const wed = reader.string(8);
  const lastSaved = reader.int();
  const flags = reader.map.uint(extendMap.areaFlags.parseFlags);
  const northAreaRef = reader.string(8);
  const northAreaFlags = reader.map.uint(extendMap.edgeFlags.parseFlags);
  const eastAreaRef = reader.string(8);
  const eastAreaFlags = reader.map.uint(extendMap.edgeFlags.parseFlags);
  const southAreaRef = reader.string(8);
  const southAreaFlags = reader.map.uint(extendMap.edgeFlags.parseFlags);
  const westAreaRef = reader.string(8);
  const westAreaFlags = reader.map.uint(extendMap.edgeFlags.parseFlags);
  const rawAreaType = reader.map.ushort(extendMap.areaType.parseFlags);
  const areaType = rawAreaType.length ? rawAreaType : ['indoors'] as RawAreHeaderV10['areaType'];
  const rainProbability = reader.ushort();
  const snowProbability = reader.ushort();
  const fogProbability = reader.ushort();
  const lightningProbability = reader.ushort();
  const overlayTransparency = reader.ushort();
  const actorsOffset = reader.uint();
  const actorsCount = reader.ushort();
  const regionsCount = reader.ushort();
  const regionsOffset = reader.uint();
  const spawnPointsOffset = reader.uint();
  const spawnPointsCount = reader.uint();
  const entrancesOffset = reader.uint();
  const entrancesCount = reader.uint();
  const containersOffset = reader.uint();
  const containersCount = reader.ushort();
  const itemsCount = reader.ushort();
  const itemsOffset = reader.uint();
  const verticesOffset = reader.uint();
  const verticesCount = reader.ushort();
  const ambientsCount = reader.ushort();
  const ambientsOffset = reader.uint();
  const variablesOffset = reader.uint();
  const variablesCount = reader.uint();
  const tiledObjectFlagsCount = reader.ushort();
  const tiledObjectFlagsOffset = reader.ushort();
  const areaScript = reader.string(8);
  const exploredBitmaskSize = reader.uint();
  const exploredBitmaskOffset = reader.uint();
  const doorsCount = reader.uint();
  const doorsOffset = reader.uint();
  const animationsCount = reader.uint();
  const animationsOffset = reader.uint();
  const tiledObjectsCount = reader.uint();
  const tiledObjectsOffset = reader.uint();
  const songOffset = reader.uint();
  const restInterruptionsOffset = reader.uint();
  const automapNotesOffset = reader.uint();
  const automapNotesCount = reader.uint();
  const projectileTrapsOffset = reader.uint();
  const projectileTrapsCount = reader.uint();
  const restMovieDay = reader.string(8);
  const restMovieNight = reader.string(8);
  reader.skip.custom(56);

  const rawAreHeaderV10: RawAreHeaderV10 = {
    signature: 'area',
    version: 'v1.0',
    wed,
    lastSaved,
    flags,
    northAreaRef: northAreaRef ? northAreaRef : nothing(),
    northAreaFlags,
    eastAreaRef: eastAreaRef ? eastAreaRef : nothing(),
    eastAreaFlags,
    southAreaRef: southAreaRef ? southAreaRef : nothing(),
    southAreaFlags,
    westAreaRef: westAreaRef ? westAreaRef : nothing(),
    westAreaFlags,
    areaType,
    rainProbability,
    snowProbability,
    fogProbability,
    lightningProbability,
    overlayTransparency,
    actorsOffset,
    actorsCount,
    regionsCount,
    regionsOffset,
    spawnPointsOffset,
    spawnPointsCount,
    entrancesOffset,
    entrancesCount,
    containersOffset,
    containersCount,
    itemsCount,
    itemsOffset,
    verticesOffset,
    verticesCount,
    ambientsCount,
    ambientsOffset,
    variablesOffset,
    variablesCount,
    tiledObjectFlagsCount,
    tiledObjectFlagsOffset,
    areaScript,
    exploredBitmaskSize,
    exploredBitmaskOffset,
    doorsCount,
    doorsOffset,
    animationsCount,
    animationsOffset,
    tiledObjectsCount,
    tiledObjectsOffset,
    songOffset,
    restInterruptionsOffset,
    automapNotesOffset,
    automapNotesCount,
    projectileTrapsOffset,
    projectileTrapsCount,
    restMovieDay: restMovieDay ? restMovieDay : nothing(),
    restMovieNight: restMovieNight ? restMovieNight : nothing(),
  };

  return rawAreHeaderV10;
};
