import createWriter from '@/shared/writer.js';
import {
  escapeSingleQuote,
  writeStringArray,
} from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { Writer } from '@/shared/writer.js';
import type { GhostIni, GhostIniCreatureScopedVariable, GhostIniCreatureSection } from '@planar/shared';

const writePoint = (writer: Writer, propertyName: string, point: [number, number], offset: number): void => {
  writer.writeLine(`${propertyName}: [${point[0]}, ${point[1]}],`, offset);
};

const writeScopedVar = (writer: Writer, propertyName: string, value: GhostIniCreatureScopedVariable, offset: number): void => {
  writer.writeLine(`${propertyName}: {`, offset);
  writer.writeLine(`scope: '${escapeSingleQuote(value.scope)}',`, offset + 2);
  writer.writeLine(`variableName: '${escapeSingleQuote(value.variableName)}',`, offset + 2);
  writer.writeLine(`},`, offset);
};

const writeCreatureSection = (writer: Writer, section: GhostIniCreatureSection): void => {
  writer.writeLine(`{`, 6);
  writer.writeLine(`name: '${escapeSingleQuote(section.name)}',`, 8);
  if (section.specVar) writeScopedVar(writer, 'specVar', section.specVar, 8);

  if (typeof section.spec === 'string') {
    writer.writeLine(`spec: '${escapeSingleQuote(section.spec)}',`, 8);
  }
  else {
    writer.writeLine(`spec: {`, 8);
    writer.writeLine(`ea: ${section.spec.ea},`, 10);
    writer.writeLine(`faction: ${section.spec.faction},`, 10);
    writer.writeLine(`team: ${section.spec.team},`, 10);
    writer.writeLine(`general: ${section.spec.general},`, 10);
    writer.writeLine(`race: ${section.spec.race},`, 10);
    writer.writeLine(`class: ${section.spec.class},`, 10);
    writer.writeLine(`specific: ${section.spec.specific},`, 10);
    writer.writeLine(`gender: ${section.spec.gender},`, 10);
    writer.writeLine(`align: ${section.spec.align},`, 10);
    writer.writeLine(`},`, 8);
  }

  //
  if (section.specArea) {
    writer.writeLine(`specArea: {`, 8);
    if (section.specArea.centerX) writer.writeLine(`centerX: ${section.specArea.centerX},`, 10);
    if (section.specArea.centerY) writer.writeLine(`centerY: ${section.specArea.centerY},`, 10);
    if (section.specArea.range) writer.writeLine(`range: ${section.specArea.range},`, 10);
    if (section.specArea.other) writer.writeLine(`other: '${section.specArea.other}',`, 10);
    writer.writeLine(`},`, 8);
  }

  //
  writer.writeLine(`specQty: ${section.specQty},`, 8);
  if (section.specVarInc) writer.writeLine(`specVarInc: ${section.specVarInc},`, 8);
  if (section.specVarValue) writer.writeLine(`specVarValue: ${section.specVarValue},`, 8);
  if (section.specVarOperation) writer.writeLine(`specVarOperation: '${section.specVarOperation}',`, 8);
  if (section.areaDiff1) writer.writeLine(`areaDiff1: ${section.areaDiff1},`, 8);
  if (section.areaDiff2) writer.writeLine(`areaDiff2: ${section.areaDiff2},`, 8);
  if (section.areaDiff3) writer.writeLine(`areaDiff3: ${section.areaDiff3},`, 8);
  writer.writeLine(`creFile: '${escapeSingleQuote(section.creFile)}',`, 8);
  if (section.createQty) writer.writeLine(`createQty: ${section.createQty},`, 8);
  if (section.scriptName) writer.writeLine(`scriptName: '${escapeSingleQuote(section.scriptName)}',`, 8);
  if (section.aiEa) writer.writeLine(`aiEa: ${section.aiEa},`, 8);
  if (section.aiGeneral) writer.writeLine(`aiGeneral: ${section.aiGeneral},`, 8);
  if (section.aiRace) writer.writeLine(`aiRace: ${section.aiRace},`, 8);
  if (section.aiClass) writer.writeLine(`aiClass: ${section.aiClass},`, 8);
  if (section.aiGender) writer.writeLine(`aiGender: ${section.aiGender},`, 8);
  if (section.aiSpecifics) writer.writeLine(`aiSpecifics: ${section.aiSpecifics},`, 8);
  if (section.aiAlignment) writer.writeLine(`aiAlignment: ${section.aiAlignment},`, 8);
  if (section.aiFaction) writer.writeLine(`aiFaction: ${section.aiFaction},`, 8);
  if (section.aiTeam) {
    if (typeof section.aiTeam === 'string') writer.writeLine(`aiTeam: '${escapeSingleQuote(section.aiTeam)}',`, 8);
    else writer.writeLine(`aiTeam: ${section.aiTeam},`, 8);
  }
  if (section.scriptOverride) writer.writeLine(`scriptOverride: '${escapeSingleQuote(section.scriptOverride)}',`, 8);
  if (section.scriptClass) writer.writeLine(`scriptClass: '${escapeSingleQuote(section.scriptClass)}',`, 8);
  if (section.scriptRace) writer.writeLine(`scriptRace: '${escapeSingleQuote(section.scriptRace)}',`, 8);
  if (section.scriptGeneral) writer.writeLine(`scriptGeneral: '${escapeSingleQuote(section.scriptGeneral)}',`, 8);
  if (section.scriptDefault) writer.writeLine(`scriptDefault: '${escapeSingleQuote(section.scriptDefault)}',`, 8);
  if (section.scriptArea) writer.writeLine(`scriptArea: '${escapeSingleQuote(section.scriptArea)}',`, 8);
  if (section.scriptSpecifics) writer.writeLine(`scriptSpecifics: '${escapeSingleQuote(section.scriptSpecifics)}',`, 8);
  if (section.scriptSpecial1) writer.writeLine(`scriptSpecial1: '${escapeSingleQuote(section.scriptSpecial1)}',`, 8);
  if (section.scriptTeam) writer.writeLine(`scriptTeam: '${escapeSingleQuote(section.scriptTeam)}',`, 8);
  if (section.scriptSpecial2) writer.writeLine(`scriptSpecial2: '${escapeSingleQuote(section.scriptSpecial2)}',`, 8);
  if (section.scriptCombat) writer.writeLine(`scriptCombat: '${escapeSingleQuote(section.scriptCombat)}',`, 8);
  if (section.scriptSpecial3) writer.writeLine(`scriptSpecial3: '${escapeSingleQuote(section.scriptSpecial3)}',`, 8);
  if (section.scriptMovement) writer.writeLine(`scriptMovement: '${escapeSingleQuote(section.scriptMovement)}',`, 8);
  if (section.dialog) writer.writeLine(`dialog: '${escapeSingleQuote(section.dialog)}',`, 8);
  if (section.goodMod) writer.writeLine(`goodMod: ${section.goodMod},`, 8);
  if (section.lawMod) writer.writeLine(`lawMod: ${section.lawMod},`, 8);
  if (section.ladyMod) writer.writeLine(`ladyMod: ${section.ladyMod},`, 8);
  if (section.murderMod) writer.writeLine(`murderMod: ${section.murderMod},`, 8);
  if (section.deathScriptname) writer.writeLine(`deathScriptname: ${section.deathScriptname},`, 8);
  if (section.deathFaction) writer.writeLine(`deathFaction: ${section.deathFaction},`, 8);
  if (section.deathTeam) writer.writeLine(`deathTeam: ${section.deathTeam},`, 8);

  //
  if (section.spawnPoint) {
    writer.writeLine(`spawnPoint: [`, 8);
    for (const point of section.spawnPoint) {
      writer.writeLine(`{`, 10);
      writer.writeLine(`x: ${point.x},`, 12);
      writer.writeLine(`y: ${point.y},`, 12);
      writer.writeLine(`direction: '${escapeSingleQuote(point.direction)}',`, 12);
      writer.writeLine(`},`, 10);
    }
    writer.writeLine(`],`, 8);
  }
  else {
    writer.writeLine(`spawnPoint: [],`, 8);
  }

  //
  if (section.pointSelect) writer.writeLine(`pointSelect: '${section.pointSelect}',`, 8);
  if (section.pointSelectVar) writeScopedVar(writer, 'pointSelectVar', section.pointSelectVar, 8);
  if (section.facing) writer.writeLine(`facing: '${escapeSingleQuote(section.facing)}',`, 8);
  if (section.ignoreCanSee) writer.writeLine(`ignoreCanSee: ${section.ignoreCanSee},`, 8);
  if (section.checkCrowd) writer.writeLine(`checkCrowd: ${section.checkCrowd},`, 8);
  writer.writeLine(`findSafestPoint: ${section.findSafestPoint},`, 8);
  if (section.saveSelectedPoint) writeScopedVar(writer, 'saveSelectedPoint', section.saveSelectedPoint, 8);
  if (section.saveSelectedFacing) writeScopedVar(writer, 'saveSelectedFacing', section.saveSelectedFacing, 8);
  if (section.spawnPointGlobal) writeScopedVar(writer, 'spawnPointGlobal', section.spawnPointGlobal, 8);
  if (section.spawnFacingGlobal) writeScopedVar(writer, 'spawnFacingGlobal', section.spawnFacingGlobal, 8);
  if (section.incSpawnPointIndex) writer.writeLine(`incSpawnPointIndex: ${section.incSpawnPointIndex},`, 8);
  if (section.holdSelectedPointKey) writer.writeLine(`holdSelectedPointKey: ${section.holdSelectedPointKey},`, 8);
  if (section.checkByViewPort) writer.writeLine(`checkByViewPort: ${section.checkByViewPort},`, 8);
  if (section.doNotSpawn) writer.writeLine(`doNotSpawn: ${section.doNotSpawn},`, 8);
  if (section.autoBuddy) writer.writeLine(`autoBuddy: ${section.autoBuddy},`, 8);
  if (section.timeOfDay) writer.writeLine(`timeOfDay: '${escapeSingleQuote(section.timeOfDay)}',`, 8);
  if (section.disableRenderer) writer.writeLine(`disableRenderer: ${section.disableRenderer},`, 8);
  writer.writeLine(`},`, 6);
};

export const buildIniSkeleton = (ini: GhostIni): string => {
  const writer = createWriter();
  const id = withoutExtension(ini.resourceName);

  writer.writeLine(`import type { GhostIni } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${ini.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}IniSkeleton = () => {`);
  writer.writeLine(`const ini: GhostIni = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(ini.resourceName)}',`, 4);

  //
  if (ini.nameless) {
    writer.writeLine(`nameless: {`, 4);
    writer.writeLine(`destare: '${escapeSingleQuote(ini.nameless.destare)}',`, 6);
    writePoint(writer, 'point', ini.nameless.point, 6);
    writer.writeLine(`state: ${ini.nameless.state},`, 6);
    if (ini.nameless.partyPoint) writePoint(writer, 'partyPoint', ini.nameless.partyPoint, 6);
    if (ini.nameless.partyArea) writer.writeLine(`partyArea: '${ini.nameless.partyArea}',`, 6);
    writer.writeLine(`},`, 4);
  }

  //
  if (ini.namelessvar) {
    writer.writeLine('namelessvar: new Map<string, number>([', 4);
    for (const [key, value] of ini.namelessvar) writer.writeLine(`['${escapeSingleQuote(key)}', ${value}],`, 6);
    writer.writeLine(`]),`, 4);
  }

  //
  if (ini.locals) {
    writer.writeLine(`locals: new Map<string, string>([`, 4);
    for (const [key, value] of ini.locals) writer.writeLine(`['${escapeSingleQuote(key)}', '${escapeSingleQuote(value)}'],`, 6);
    writer.writeLine(`]),`, 4);
  }

  //
  if (ini.spawnMain) {
    writer.writeLine(`spawnMain: {`, 4);
    if (ini.spawnMain.enter) writer.writeLine(`enter: '${ini.spawnMain.enter}',`, 6);
    if (ini.spawnMain.exit) writer.writeLine(`exit: '${ini.spawnMain.exit}',`, 6);
    if (ini.spawnMain.events) writer.writeLine(`events: '${ini.spawnMain.events}',`, 6);
    writer.writeLine(`},`, 4);
  }

  //
  if (ini.general) {
    writer.writeLine(`general: {`, 4);
    writer.writeLine(`animationType: '${escapeSingleQuote(ini.general.animationType)}',`, 6);
    writer.writeLine(`moveScale: ${ini.general.moveScale},`, 6);
    writer.writeLine(`ellipse: ${ini.general.ellipse},`, 6);
    writer.writeLine(`colorBlood: ${ini.general.colorBlood},`, 6);
    writer.writeLine(`colorChunks: ${ini.general.colorChunks},`, 6);
    writer.writeLine(`soundFreq: ${ini.general.soundFreq},`, 6);
    writer.writeLine(`personalSpace: ${ini.general.personalSpace},`, 6);
    writer.writeLine(`castFrame: ${ini.general.castFrame},`, 6);
    writer.writeLine(`},`, 4);
  }

  //
  if (ini.monsterPlanescape) {
    writer.writeLine(`monsterPlanescape: {`, 4);
    if (ini.monsterPlanescape.attack1) writer.writeLine(`attack1: '${ini.monsterPlanescape.attack1}',`, 6);
    if (ini.monsterPlanescape.attack2) writer.writeLine(`attack2: '${ini.monsterPlanescape.attack2}',`, 6);
    if (ini.monsterPlanescape.stance2stand) writer.writeLine(`stance2stand: '${ini.monsterPlanescape.stance2stand}',`, 6);
    if (ini.monsterPlanescape.stancefidget1) writer.writeLine(`stancefidget1: '${ini.monsterPlanescape.stancefidget1}',`, 6);
    if (ini.monsterPlanescape.diebackward) writer.writeLine(`diebackward: '${ini.monsterPlanescape.diebackward}',`, 6);
    if (ini.monsterPlanescape.getup) writer.writeLine(`getup: '${ini.monsterPlanescape.getup}',`, 6);
    if (ini.monsterPlanescape.gethit) writer.writeLine(`gethit: '${ini.monsterPlanescape.gethit}',`, 6);
    if (ini.monsterPlanescape.run) writer.writeLine(`run: '${ini.monsterPlanescape.run}',`, 6);
    if (ini.monsterPlanescape.stand2stance) writer.writeLine(`stand2stance: '${ini.monsterPlanescape.stand2stance}',`, 6);
    if (ini.monsterPlanescape.standfidget1) writer.writeLine(`standfidget1: '${ini.monsterPlanescape.standfidget1}',`, 6);
    if (ini.monsterPlanescape.spell1) writer.writeLine(`spell1: '${ini.monsterPlanescape.spell1}',`, 6);
    if (ini.monsterPlanescape.spell2) writer.writeLine(`spell2: '${ini.monsterPlanescape.spell2}',`, 6);
    if (ini.monsterPlanescape.stance) writer.writeLine(`stance: '${ini.monsterPlanescape.stance}',`, 6);
    if (ini.monsterPlanescape.stand) writer.writeLine(`stand: '${ini.monsterPlanescape.stand}',`, 6);
    if (ini.monsterPlanescape.talk1) writer.writeLine(`talk1: '${ini.monsterPlanescape.talk1}',`, 6);
    if (ini.monsterPlanescape.walk) writer.writeLine(`walk: '${ini.monsterPlanescape.walk}',`, 6);
    if (ini.monsterPlanescape.runscale) writer.writeLine(`runscale: ${ini.monsterPlanescape.runscale},`, 6);
    if (ini.monsterPlanescape.bestiary) writer.writeLine(`bestiary: ${ini.monsterPlanescape.bestiary},`, 6);
    if (ini.monsterPlanescape.armor) writer.writeLine(`armor: ${ini.monsterPlanescape.armor},`, 6);
    writer.writeLine(`},`, 4);
  }

  //
  if (ini.sounds) {
    writer.writeLine(`sounds: {`, 4);
    if (ini.sounds.hitsound) writeStringArray(writer, 'hitsound', ini.sounds.hitsound, 6);
    else writer.writeLine('hitsound: [],', 6);
    if (ini.sounds.hitframe) writer.writeLine(`hitframe: ${ini.sounds.hitframe},`, 6);
    if (ini.sounds.dfbsound) writer.writeLine(`dfbsound: '${ini.sounds.dfbsound}',`, 6);
    if (ini.sounds.dfbframe) writer.writeLine(`dfbframe: ${ini.sounds.dfbframe},`, 6);
    if (ini.sounds.at1Sound) writer.writeLine(`at1Sound: '${ini.sounds.at1Sound}',`, 6);
    if (ini.sounds.at1frame) writer.writeLine(`at1frame: ${ini.sounds.at1frame},`, 6);
    if (ini.sounds.at2Sound) writer.writeLine(`at2Sound: '${ini.sounds.at2Sound}',`, 6);
    if (ini.sounds.at2frame) writer.writeLine(`at2frame: ${ini.sounds.at2frame},`, 6);
    if (ini.sounds.cf1Sound) writer.writeLine(`cf1Sound: '${ini.sounds.cf1Sound}',`, 6);
    if (ini.sounds.cf1frame) writer.writeLine(`cf1frame: ${ini.sounds.cf1frame},`, 6);
    writer.writeLine(`},`, 4);
  }

  //
  if (ini.numberedSections.length) {
    writer.writeLine(`numberedSections: [`, 4);
    for (const section of ini.numberedSections) {
      writer.writeLine(`{`, 6);
      if (section.hitsound) writeStringArray(writer, 'hitsound', section.hitsound, 8);
      else writer.writeLine('hitsound: [],', 8);
      if (section.hitframe)writer.writeLine(`hitframe: ${section.hitframe},`, 8);
      if (section.dfbsound)writer.writeLine(`dfbsound: '${section.dfbsound}',`, 8);
      if (section.dfbframe)writer.writeLine(`dfbframe: ${section.dfbframe},`, 8);
      if (section.at1Sound)writer.writeLine(`at1Sound: '${section.at1Sound}',`, 8);
      if (section.at1frame)writer.writeLine(`at1frame: ${section.at1frame},`, 8);
      if (section.at2Sound)writer.writeLine(`at2Sound: '${section.at2Sound}',`, 8);
      if (section.at2frame)writer.writeLine(`at2frame: ${section.at2frame},`, 8);
      if (section.cf1Sound)writer.writeLine(`cf1Sound: '${section.cf1Sound}',`, 8);
      if (section.cf1frame)writer.writeLine(`cf1frame: ${section.cf1frame},`, 8);
      if (section.attack1)writer.writeLine(`attack1: '${section.attack1}',`, 8);
      if (section.attack2)writer.writeLine(`attack2: '${section.attack2}',`, 8);
      if (section.stance2stand)writer.writeLine(`stance2stand: '${section.stance2stand}',`, 8);
      if (section.stancefidget1)writer.writeLine(`stancefidget1: '${section.stancefidget1}',`, 8);
      if (section.diebackward)writer.writeLine(`diebackward: '${section.diebackward}',`, 8);
      if (section.getup)writer.writeLine(`getup: '${section.getup}',`, 8);
      if (section.gethit)writer.writeLine(`gethit: '${section.gethit}',`, 8);
      if (section.run)writer.writeLine(`run: '${section.run}',`, 8);
      if (section.stand2stance)writer.writeLine(`stand2stance: '${section.stand2stance}',`, 8);
      if (section.standfidget1)writer.writeLine(`standfidget1: '${section.standfidget1}',`, 8);
      if (section.spell1)writer.writeLine(`spell1: '${section.spell1}',`, 8);
      if (section.spell2)writer.writeLine(`spell2: '${section.spell2}',`, 8);
      if (section.stance)writer.writeLine(`stance: '${section.stance}',`, 8);
      if (section.stand)writer.writeLine(`stand: '${section.stand}',`, 8);
      if (section.talk1)writer.writeLine(`talk1: '${section.talk1}',`, 8);
      if (section.walk)writer.writeLine(`walk: '${section.walk}',`, 8);
      if (section.walkscale)writer.writeLine(`walkscale: ${section.walkscale},`, 8);
      if (section.runscale)writer.writeLine(`runscale: ${section.runscale},`, 8);
      if (section.bestiary)writer.writeLine(`bestiary: ${section.bestiary},`, 8);
      if (section.armor)writer.writeLine(`armor: ${section.armor},`, 8);
      writer.writeLine(`},`, 6);
    }
    writer.writeLine(`],`, 4);
  }
  else {
    writer.writeLine(`numberedSections: [],`, 4);
  }

  //
  if (ini.groupSections.length) {
    writer.writeLine(`groupSections: [`, 4);
    for (const section of ini.groupSections) {
      writer.writeLine(`{`, 6);
      writer.writeLine(`name: '${escapeSingleQuote(section.name)}',`, 8);
      writeStringArray(writer, 'critters', section.critters, 8);
      if (section.interval) writer.writeLine(`interval: ${section.interval},`, 8);
      if (section.detailLevel) writer.writeLine(`detailLevel: '${section.detailLevel}',`, 8);
      if (section.controlVar) writer.writeLine(`controlVar: '${section.controlVar}',`, 8);
      if (section.spawnTimeOfDay) writer.writeLine(`spawnTimeOfDay: '${section.spawnTimeOfDay}',`, 8);
      writer.writeLine(`},`, 6);
    }
    writer.writeLine(`],`, 4);
  }
  else {
    writer.writeLine(`groupSections: [],`, 4);
  }

  //
  if (ini.creatureSections.length) {
    writer.writeLine(`creatureSections: [`, 4);
    for (const section of ini.creatureSections) writeCreatureSection(writer, section);
    writer.writeLine(`],`, 4);
  }
  else {
    writer.writeLine(`creatureSections: [],`, 4);
  }

  writer.writeLine('};', 2);
  writer.writeLine('return ini;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}IniSkeleton;`);

  return writer.done();
};
