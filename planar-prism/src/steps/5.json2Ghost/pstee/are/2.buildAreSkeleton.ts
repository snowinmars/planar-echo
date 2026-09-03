import { isNothing, withoutExtension } from '@planar/shared';

import createWriter from '@/shared/writer.js';
import {
  escapeSingleQuote,
  writeFlags,
  writeNumberArray,
  writeStringArray,
} from '@/steps/5.json2Ghost/shared.js';

import type {
  GhostAre,
  GhostAreActor,
  GhostAreAmbient,
  GhostAreAnimation,
  GhostAreAutomapNote,
  GhostAreContainer,
  GhostAreDoor,
  GhostAreItem,
  GhostAreProjectileTrap,
  GhostAreRegion,
  GhostAreRestInterruptions,
  GhostAreSong,
  GhostAreSpawnPoint,
  GhostAreTiledObject,
  GhostAreVariable,
  GhostAreVertex,
  Maybe,
  Point,
  Rectangle,
} from '@planar/shared';

import type { Writer } from '@/shared/writer.js';

const writePoint = (writer: Writer, propertyName: string, point: Point, offset: number): void => {
  writer.writeLine(`${propertyName}: { x: ${point.x}, y: ${point.y} },`, offset);
};

const writeRectangle = (writer: Writer, propertyName: string, box: Rectangle, offset: number): void => {
  writer.writeLine(`${propertyName}: { left: ${box.left}, top: ${box.top}, right: ${box.right}, bottom: ${box.bottom} },`, offset);
};

const writeMaybeString = (writer: Writer, propertyName: string, value: Maybe<string>, offset: number): void => {
  if (isNothing(value)) return;
  writer.writeLine(`${propertyName}: '${escapeSingleQuote(value)}',`, offset);
};

const writeMaybeNumber = (writer: Writer, propertyName: string, value: Maybe<number>, offset: number): void => {
  if (isNothing(value)) return;
  writer.writeLine(`${propertyName}: ${value},`, offset);
};

const writeVertices = (writer: Writer, propertyName: string, vertices: GhostAreVertex[], offset: number): void => {
  writer.writeLine(`${propertyName}: [`, offset);
  for (const vertex of vertices) writer.writeLine(`{ x: ${vertex.x}, y: ${vertex.y} },`, offset + 2);
  writer.writeLine(`],`, offset);
};

const writeActor = (writer: Writer, actor: GhostAreActor): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(actor.name)}',`, 8);
  writePoint(writer, 'at', actor.at, 8);
  writer.writeLine(`destX: ${actor.destX},`, 8);
  writer.writeLine(`destY: ${actor.destY},`, 8);
  writeFlags(writer, actor.flags, 'flags', 8);
  writer.writeLine(`isSpawnedAsRandomMonster: ${actor.isSpawnedAsRandomMonster},`, 8);
  writeMaybeString(writer, 'creResrefLetter', actor.creResrefLetter, 8);
  writer.writeLine(`animation: '${escapeSingleQuote(actor.animation)}',`, 8);
  writer.writeLine(`direction: '${escapeSingleQuote(actor.direction)}',`, 8);
  writer.writeLine(`expiryTime: ${actor.expiryTime},`, 8);
  writer.writeLine(`wanderDistance: ${actor.wanderDistance},`, 8);
  writer.writeLine(`followDistance: ${actor.followDistance},`, 8);
  writeFlags(writer, actor.presentedAt, 'presentedAt', 8);
  writer.writeLine(`numTimesTalkedTo: ${actor.numTimesTalkedTo},`, 8);
  writeMaybeString(writer, 'dialog', actor.dialog, 8);
  writeMaybeString(writer, 'scriptOverride', actor.scriptOverride, 8);
  writer.writeLine(`scriptGeneral: '${escapeSingleQuote(actor.scriptGeneral)}',`, 8);
  writeMaybeString(writer, 'scriptClass', actor.scriptClass, 8);
  writeMaybeString(writer, 'scriptRace', actor.scriptRace, 8);
  writeMaybeString(writer, 'scriptDefault', actor.scriptDefault, 8);
  writeMaybeString(writer, 'scriptSpecifics', actor.scriptSpecifics, 8);
  writer.writeLine(`cre: '${escapeSingleQuote(actor.cre)}',`, 8);
  writer.writeLine(`},`, 6);
};

const writeRegion = (writer: Writer, region: GhostAreRegion): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(region.name)}',`, 8);
  writer.writeLine(`type: '${escapeSingleQuote(region.type)}',`, 8);
  writeRectangle(writer, 'boundingBox', region.boundingBox, 8);
  writeVertices(writer, 'vertices', region.vertices, 8);
  writer.writeLine(`triggerValue: ${region.triggerValue},`, 8);
  writer.writeLine(`cursorIndex: ${region.cursorIndex},`, 8);
  writer.writeLine(`destinationArea: '${escapeSingleQuote(region.destinationArea)}',`, 8);
  writer.writeLine(`entranceName: '${escapeSingleQuote(region.entranceName)}',`, 8);
  writeFlags(writer, region.flags, 'flags', 8);
  writeMaybeNumber(writer, 'infoPointTextRef', region.infoPointTextRef, 8);
  writer.writeLine(`trapDetectionDifficulty: ${region.trapDetectionDifficulty},`, 8);
  writer.writeLine(`trapRemovalDifficulty: ${region.trapRemovalDifficulty},`, 8);
  writer.writeLine(`trapped: ${region.trapped},`, 8);
  writer.writeLine(`trapDetected: ${region.trapDetected},`, 8);
  writePoint(writer, 'trapLaunchAt', region.trapLaunchAt, 8);
  writeMaybeString(writer, 'key', region.key, 8);
  writeMaybeString(writer, 'script', region.script, 8);
  writePoint(writer, 'activation', region.activation, 8);
  writer.writeLine(`sound: '${escapeSingleQuote(region.sound)}',`, 8);
  writePoint(writer, 'speaker', region.speaker, 8);
  writer.writeLine(`speakerNameRef: ${region.speakerNameRef},`, 8);
  writer.writeLine(`dialog: '${escapeSingleQuote(region.dialog)}',`, 8);
  writer.writeLine(`},`, 6);
};

const writeSpawnPoint = (writer: Writer, spawn: GhostAreSpawnPoint): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(spawn.name)}',`, 8);
  writePoint(writer, 'at', spawn.at, 8);
  writeStringArray(writer, 'creatures', spawn.creatures, 8);
  writer.writeLine(`encounterDifficulty: ${spawn.encounterDifficulty},`, 8);
  writer.writeLine(`spawnRate: ${spawn.spawnRate},`, 8);
  writeFlags(writer, spawn.method, 'method', 8);
  writer.writeLine(`duration: ${spawn.duration},`, 8);
  writer.writeLine(`wanderDistance: ${spawn.wanderDistance},`, 8);
  writer.writeLine(`followDistance: ${spawn.followDistance},`, 8);
  writer.writeLine(`maxCreatures: ${spawn.maxCreatures},`, 8);
  writer.writeLine(`enabled: ${spawn.enabled},`, 8);
  writeFlags(writer, spawn.presentedAt, 'presentedAt', 8);
  writer.writeLine(`probabilityDay: ${spawn.probabilityDay},`, 8);
  writer.writeLine(`probabilityNight: ${spawn.probabilityNight},`, 8);
  writer.writeLine(`frequency: ${spawn.frequency},`, 8);
  writer.writeLine(`countdown: ${spawn.countdown},`, 8);
  writeNumberArray(writer, 'weights', spawn.weights, 8);
  writer.writeLine(`},`, 6);
};

const writeItem = (writer: Writer, item: GhostAreItem, offset: number): void => {
  writer.writeLine(`{`, offset);
  writer.writeLine(`resref: '${escapeSingleQuote(item.resref)}',`, offset + 2);
  writer.writeLine(`expiryTime: ${item.expiryTime},`, offset + 2);
  writer.writeLine(`quantity1: ${item.quantity1},`, offset + 2);
  writer.writeLine(`quantity2: ${item.quantity2},`, offset + 2);
  writer.writeLine(`quantity3: ${item.quantity3},`, offset + 2);
  writeFlags(writer, item.flags, 'flags', offset + 2);
  writer.writeLine(`},`, offset);
};

const writeContainer = (writer: Writer, container: GhostAreContainer): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(container.name)}',`, 8);
  writePoint(writer, 'at', container.at, 8);
  writer.writeLine(`type: '${escapeSingleQuote(container.type)}',`, 8);
  writer.writeLine(`lockDifficulty: ${container.lockDifficulty},`, 8);
  writeFlags(writer, container.flags, 'flags', 8);
  writer.writeLine(`trapDetectionDifficulty: ${container.trapDetectionDifficulty},`, 8);
  writer.writeLine(`trapRemovalDifficulty: ${container.trapRemovalDifficulty},`, 8);
  writer.writeLine(`trapped: ${container.trapped},`, 8);
  writer.writeLine(`trapDetected: ${container.trapDetected},`, 8);
  writePoint(writer, 'launch', container.launch, 8);
  writeRectangle(writer, 'boundingBox', container.boundingBox, 8);
  writer.writeLine(`items: [`, 8);
  for (const item of container.items) writeItem(writer, item, 10);
  writer.writeLine(`],`, 8);
  writeMaybeString(writer, 'trapScript', container.trapScript, 8);
  writeVertices(writer, 'vertices', container.vertices, 8);
  writer.writeLine(`triggerRange: ${container.triggerRange},`, 8);
  writeMaybeString(writer, 'owner', container.owner, 8);
  writeMaybeString(writer, 'key', container.key, 8);
  writer.writeLine(`breakDifficulty: ${container.breakDifficulty},`, 8);
  writer.writeLine(`lockpickStringRef: ${container.lockpickStringRef},`, 8);
  writer.writeLine(`},`, 6);
};

const writeAmbient = (writer: Writer, ambient: GhostAreAmbient): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(ambient.name)}',`, 8);
  writePoint(writer, 'at', ambient.at, 8);
  writer.writeLine(`radius: ${ambient.radius},`, 8);
  writer.writeLine(`height: ${ambient.height},`, 8);
  writer.writeLine(`pitchVariation: ${ambient.pitchVariation},`, 8);
  writer.writeLine(`volumeVariation: ${ambient.volumeVariation},`, 8);
  writer.writeLine(`volume: ${ambient.volume},`, 8);
  writeStringArray(writer, 'sounds', ambient.sounds, 8);
  writer.writeLine(`intervalBase: ${ambient.intervalBase},`, 8);
  writer.writeLine(`intervalVariation: ${ambient.intervalVariation},`, 8);
  writeFlags(writer, ambient.presentedAt, 'presentedAt', 8);
  writeFlags(writer, ambient.flags, 'flags', 8);
  writer.writeLine(`},`, 6);
};

const writeVariable = (writer: Writer, variable: GhostAreVariable): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(variable.name)}',`, 8);
  writer.writeLine(`type: '${escapeSingleQuote(variable.type)}',`, 8);
  writer.writeLine(`resourceType: ${variable.resourceType},`, 8);
  writer.writeLine(`dwordValue: ${variable.dwordValue},`, 8);
  writer.writeLine(`intValue: ${variable.intValue},`, 8);
  writer.writeLine(`doubleValue: ${variable.doubleValue},`, 8);
  writer.writeLine(`scriptNameValue: '${escapeSingleQuote(variable.scriptNameValue)}',`, 8);
  writer.writeLine(`},`, 6);
};

const writeDoorGeometry = (writer: Writer, propertyName: string, geometry: GhostAreDoor['openedGeometry'], offset: number): void => {
  writer.writeLine(`${propertyName}: {`, offset);
  writeRectangle(writer, 'boundingBox', geometry.boundingBox, offset + 2);
  writeVertices(writer, 'vertices', geometry.vertices, offset + 2);
  writeVertices(writer, 'impeded', geometry.impeded, offset + 2);
  writer.writeLine(`},`, offset);
};

const writeDoor = (writer: Writer, door: GhostAreDoor): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(door.name)}',`, 8);
  writer.writeLine(`doorId: '${escapeSingleQuote(door.doorId)}',`, 8);
  writeFlags(writer, door.flags, 'flags', 8);
  writeDoorGeometry(writer, 'openedGeometry', door.openedGeometry, 8);
  writeDoorGeometry(writer, 'closedGeometry', door.closedGeometry, 8);
  writer.writeLine(`hitPoints: ${door.hitPoints},`, 8);
  writer.writeLine(`armorClass: ${door.armorClass},`, 8);
  writeMaybeString(writer, 'openSound', door.openSound, 8);
  writeMaybeString(writer, 'closeSound', door.closeSound, 8);
  writer.writeLine(`cursorIndex: ${door.cursorIndex},`, 8);
  writer.writeLine(`trapDetectionDifficulty: ${door.trapDetectionDifficulty},`, 8);
  writer.writeLine(`trapRemovalDifficulty: ${door.trapRemovalDifficulty},`, 8);
  writer.writeLine(`trapped: ${door.trapped},`, 8);
  writer.writeLine(`trapDetected: ${door.trapDetected},`, 8);
  writePoint(writer, 'launch', door.launch, 8);
  writeMaybeString(writer, 'key', door.key, 8);
  writeMaybeString(writer, 'script', door.script, 8);
  writer.writeLine(`detectionDifficulty: ${door.detectionDifficulty},`, 8);
  writer.writeLine(`lockDifficulty: ${door.lockDifficulty},`, 8);
  writePoint(writer, 'openLocation', door.openLocation, 8);
  writePoint(writer, 'closeLocation', door.closeLocation, 8);
  writeMaybeNumber(writer, 'lockpickStringRef', door.lockpickStringRef, 8);
  writeMaybeString(writer, 'travelTriggerName', door.travelTriggerName, 8);
  writeMaybeNumber(writer, 'speakerNameRef', door.speakerNameRef, 8);
  writeMaybeString(writer, 'dialog', door.dialog, 8);
  writer.writeLine(`},`, 6);
};

const writeAnimation = (writer: Writer, animation: GhostAreAnimation): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(animation.name)}',`, 8);
  writePoint(writer, 'at', animation.at, 8);
  writeFlags(writer, animation.presentedAt, 'presentedAt', 8);
  writer.writeLine(`animationResref: '${escapeSingleQuote(animation.animationResref)}',`, 8);
  writer.writeLine(`bamSequenceNumber: ${animation.bamSequenceNumber},`, 8);
  writer.writeLine(`bamFrameNumber: ${animation.bamFrameNumber},`, 8);
  writeFlags(writer, animation.flags, 'flags', 8);
  writer.writeLine(`height: ${animation.height},`, 8);
  writer.writeLine(`transparency: ${animation.transparency},`, 8);
  writer.writeLine(`startFrame: ${animation.startFrame},`, 8);
  writer.writeLine(`loopProbability: ${animation.loopProbability},`, 8);
  writer.writeLine(`skipCycles: ${animation.skipCycles},`, 8);
  writer.writeLine(`palette: '${escapeSingleQuote(animation.palette)}',`, 8);
  writer.writeLine(`animationWidth: ${animation.animationWidth},`, 8);
  writer.writeLine(`animationHeight: ${animation.animationHeight},`, 8);
  writer.writeLine(`},`, 6);
};

const writeTiledObject = (writer: Writer, tiled: GhostAreTiledObject): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(tiled.name)}',`, 8);
  writer.writeLine(`tileId: '${escapeSingleQuote(tiled.tileId)}',`, 8);
  writeFlags(writer, tiled.flags, 'flags', 8);
  writeVertices(writer, 'openImpeded', tiled.openImpeded, 8);
  writeVertices(writer, 'closedImpeded', tiled.closedImpeded, 8);
  writer.writeLine(`},`, 6);
};

const writeAutomapNote = (writer: Writer, note: GhostAreAutomapNote): void => {
  writer.writeLine(`{`, 6);
  writePoint(writer, 'at', note.at, 8);
  writer.writeLine(`textRef: ${note.textRef},`, 8);
  writer.writeLine(`strrefLocation: '${escapeSingleQuote(note.strrefLocation)}',`, 8);
  writer.writeLine(`markerColor: '${escapeSingleQuote(note.markerColor)}',`, 8);
  writer.writeLine(`controlId: ${note.controlId},`, 8);
  writer.writeLine(`},`, 6);
};

const writeProjectileTrap = (writer: Writer, trap: GhostAreProjectileTrap): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`projectile: '${escapeSingleQuote(trap.projectile)}',`, 8);
  writer.writeLine(`missileId: ${trap.missileId},`, 8);
  writer.writeLine(`ticksUntilCheck: ${trap.ticksUntilCheck},`, 8);
  writer.writeLine(`triggersRemaining: ${trap.triggersRemaining},`, 8);
  writer.writeLine(`x: ${trap.x},`, 8);
  writer.writeLine(`y: ${trap.y},`, 8);
  writer.writeLine(`z: ${trap.z},`, 8);
  writer.writeLine(`enemyAlly: ${trap.enemyAlly},`, 8);
  writer.writeLine(`indexOfPartyMemberWhoCreatedIt: ${trap.indexOfPartyMemberWhoCreatedIt},`, 8);
  writer.writeLine(`},`, 6);
};

const writeSong = (writer: Writer, song: GhostAreSong): void => {
  writer.writeLine(`song: {`, 4);
  writer.writeLine(`daySong: '${escapeSingleQuote(song.daySong)}',`, 6);
  writer.writeLine(`nightSong: '${escapeSingleQuote(song.nightSong)}',`, 6);
  writer.writeLine(`winSong: '${escapeSingleQuote(song.winSong)}',`, 6);
  writer.writeLine(`battleSong: '${escapeSingleQuote(song.battleSong)}',`, 6);
  writer.writeLine(`loseSong: '${escapeSingleQuote(song.loseSong)}',`, 6);
  writer.writeLine(`altMusic1: '${escapeSingleQuote(song.altMusic1)}',`, 6);
  writer.writeLine(`altMusic2: '${escapeSingleQuote(song.altMusic2)}',`, 6);
  writer.writeLine(`altMusic3: '${escapeSingleQuote(song.altMusic3)}',`, 6);
  writer.writeLine(`altMusic4: '${escapeSingleQuote(song.altMusic4)}',`, 6);
  writer.writeLine(`altMusic5: '${escapeSingleQuote(song.altMusic5)}',`, 6);
  writer.writeLine(`mainDayAmbient1: '${escapeSingleQuote(song.mainDayAmbient1)}',`, 6);
  writer.writeLine(`mainDayAmbient2: '${escapeSingleQuote(song.mainDayAmbient2)}',`, 6);
  writer.writeLine(`mainDayAmbientVolume: ${song.mainDayAmbientVolume},`, 6);
  writer.writeLine(`mainNightAmbient1: '${escapeSingleQuote(song.mainNightAmbient1)}',`, 6);
  writer.writeLine(`mainNightAmbient2: '${escapeSingleQuote(song.mainNightAmbient2)}',`, 6);
  writer.writeLine(`mainNightAmbientVolume: ${song.mainNightAmbientVolume},`, 6);
  writer.writeLine(`reverb: ${song.reverb},`, 6);
  writer.writeLine(`},`, 4);
};

const writeRestInterruptions = (writer: Writer, rest: GhostAreRestInterruptions): void => {
  writer.writeLine(`restInterruptions: {`, 4);
  writer.writeLine(`name: '${escapeSingleQuote(rest.name)}',`, 6);
  writeNumberArray(writer, 'explanationRefs', rest.explanationRefs, 6);
  writeStringArray(writer, 'creatures', rest.creatures, 6);
  writer.writeLine(`difficulty: ${rest.difficulty},`, 6);
  writer.writeLine(`removalTime: ${rest.removalTime},`, 6);
  writer.writeLine(`wanderDistance: ${rest.wanderDistance},`, 6);
  writer.writeLine(`followDistance: ${rest.followDistance},`, 6);
  writer.writeLine(`maxCreatures: ${rest.maxCreatures},`, 6);
  writer.writeLine(`enabled: ${rest.enabled},`, 6);
  writer.writeLine(`probabilityDay: ${rest.probabilityDay},`, 6);
  writer.writeLine(`probabilityNight: ${rest.probabilityNight},`, 6);
  writer.writeLine(`},`, 4);
};

export const buildAreSkeleton = (are: GhostAre): string => {
  const writer = createWriter();
  const id = withoutExtension(are.resourceName);
  const header = are.header;

  writer.writeLine(`import type { GhostAre } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${are.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}AreSkeleton = () => {`);
  writer.writeLine(`const are: GhostAre = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(are.resourceName)}',`, 4);

  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: 'area',`, 6);
  writer.writeLine(`version: 'v1.0',`, 6);
  writer.writeLine(`wed: '${escapeSingleQuote(header.wed)}',`, 6);
  writer.writeLine(`lastSaved: ${header.lastSaved},`, 6);
  writeFlags(writer, header.flags, 'flags', 6);
  writeMaybeString(writer, 'northAreaRef', header.northAreaRef, 6);
  writeFlags(writer, header.northAreaFlags, 'northAreaFlags', 6);
  writeMaybeString(writer, 'eastAreaRef', header.eastAreaRef, 6);
  writeFlags(writer, header.eastAreaFlags, 'eastAreaFlags', 6);
  writeMaybeString(writer, 'southAreaRef', header.southAreaRef, 6);
  writeFlags(writer, header.southAreaFlags, 'southAreaFlags', 6);
  writeMaybeString(writer, 'westAreaRef', header.westAreaRef, 6);
  writeFlags(writer, header.westAreaFlags, 'westAreaFlags', 6);
  writeFlags(writer, header.areaType, 'areaType', 6);
  writer.writeLine(`rainProbability: ${header.rainProbability},`, 6);
  writer.writeLine(`snowProbability: ${header.snowProbability},`, 6);
  writer.writeLine(`fogProbability: ${header.fogProbability},`, 6);
  writer.writeLine(`lightningProbability: ${header.lightningProbability},`, 6);
  writer.writeLine(`overlayTransparency: ${header.overlayTransparency},`, 6);
  writer.writeLine(`areaScript: '${escapeSingleQuote(header.areaScript)}',`, 6);
  writeMaybeString(writer, 'restMovieDay', header.restMovieDay, 6);
  writeMaybeString(writer, 'restMovieNight', header.restMovieNight, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine(`actors: [`, 4);
  for (const actor of are.actors) writeActor(writer, actor);
  writer.writeLine(`],`, 4);

  writer.writeLine(`regions: [`, 4);
  for (const region of are.regions) writeRegion(writer, region);
  writer.writeLine(`],`, 4);

  writer.writeLine(`spawnPoints: [`, 4);
  for (const spawn of are.spawnPoints) writeSpawnPoint(writer, spawn);
  writer.writeLine(`],`, 4);

  writer.writeLine(`entrances: [`, 4);
  for (const entrance of are.entrances) {
    writer.writeLine(`{`, 6);
    writer.writeLine(`name: '${escapeSingleQuote(entrance.name)}',`, 8);
    writePoint(writer, 'at', entrance.at, 8);
    writer.writeLine(`direction: '${escapeSingleQuote(entrance.direction)}',`, 8);
    writer.writeLine(`},`, 6);
  }
  writer.writeLine(`],`, 4);

  writer.writeLine(`containers: [`, 4);
  for (const container of are.containers) writeContainer(writer, container);
  writer.writeLine(`],`, 4);

  writer.writeLine(`ambients: [`, 4);
  for (const ambient of are.ambients) writeAmbient(writer, ambient);
  writer.writeLine(`],`, 4);

  writer.writeLine(`variables: [`, 4);
  for (const variable of are.variables) writeVariable(writer, variable);
  writer.writeLine(`],`, 4);

  writeMaybeString(writer, 'exploredBitmaskName', are.exploredBitmaskName, 4);

  writer.writeLine(`doors: [`, 4);
  for (const door of are.doors) writeDoor(writer, door);
  writer.writeLine(`],`, 4);

  writer.writeLine(`animations: [`, 4);
  for (const animation of are.animations) writeAnimation(writer, animation);
  writer.writeLine(`],`, 4);

  writer.writeLine(`automapNotes: [`, 4);
  for (const note of are.automapNotes) writeAutomapNote(writer, note);
  writer.writeLine(`],`, 4);

  writer.writeLine(`tiledObjects: [`, 4);
  for (const tiled of are.tiledObjects) writeTiledObject(writer, tiled);
  writer.writeLine(`],`, 4);

  writer.writeLine(`projectileTraps: [`, 4);
  for (const trap of are.projectileTraps) writeProjectileTrap(writer, trap);
  writer.writeLine(`],`, 4);

  if (!isNothing(are.song)) writeSong(writer, are.song);
  if (!isNothing(are.restInterruptions)) writeRestInterruptions(writer, are.restInterruptions);

  if (are.walk) {
    writer.writeLine(`walk: {`, 4);
    writer.writeLine(`cellWidth: ${are.walk.cellWidth},`, 6);
    writer.writeLine(`cellHeight: ${are.walk.cellHeight},`, 6);
    writer.writeLine(`colsCount: ${are.walk.colsCount},`, 6);
    writer.writeLine(`rowsCount: ${are.walk.rowsCount},`, 6);
    writer.writeLine(`walkBinName: '${escapeSingleQuote(are.walk.walkBinName)}',`, 6);
    writer.writeLine(`},`, 4);
  }

  writer.writeLine('};', 2);
  writer.writeLine('return are;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}AreSkeleton;`);

  return writer.done();
};
