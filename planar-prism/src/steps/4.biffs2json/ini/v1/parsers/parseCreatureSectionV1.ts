import { parseDecOrThrow, parseDecOrDefault } from '@/shared/customParsers.js';
import parseDirectionV1 from './parseDirectionV1.js';
import parseSpawnPointsV1 from './parseSpawnPointsV1.js';
import parseScopedVariableV1 from './parseScopedVariableV1.js';
import parseSpecV1 from './parseSpecV1.js';
import parseSpecAreaV1 from './parseSpecAreaV1.js';
import parseSpecVarOperationV1 from './parseSpecVarOperationV1.js';
import parseBooleanV1 from './parseBooleanV1.js';
import parsePointSelectV1 from './parsePointSelectV1.js';

import type { PartialWriteable, Maybe } from '@planar/shared';
import type { CreatureIniSection } from '../../types.js';
import type { Section } from '../../iniParser/iniParserTypes.js';
import type { Signature, Versions } from '../../types.js';
import type { Meta } from '../../../types.js';

const parseCreatureSectionV1 = (section: Section, meta: Meta<Signature, Versions>): Maybe<CreatureIniSection> => {
  const tmp: PartialWriteable<CreatureIniSection> = {};

  for (const entry of section.entries) {
  /* eslint-disable @stylistic/no-multi-spaces */
    switch (entry.key) {
      case 'spec_var':                { tmp.specVar              = parseScopedVariableV1(entry.value); break; }
      case 'spec':                    { tmp.spec                 = parseSpecV1(entry.value); break; }
      case 'spec_area':               { tmp.specArea             = parseSpecAreaV1(entry.value); break; }
      case 'spec_qty':                { tmp.specQty              = parseDecOrThrow(entry.value); break; }
      case 'spec_var_inc':            { tmp.specVarInc           = parseDecOrThrow(entry.value); break; }
      case 'spec_var_value':          { tmp.specVarValue         = parseDecOrThrow(entry.value); break; }
      case 'spec_var_operation':      { tmp.specVarOperation     = parseSpecVarOperationV1(entry.value); break; }
      case 'area_diff_1':             { tmp.areaDiff1            = parseBooleanV1(entry.value); break; }
      case 'area_diff_2':             { tmp.areaDiff2            = parseBooleanV1(entry.value); break; }
      case 'area_diff_3':             { tmp.areaDiff3            = parseBooleanV1(entry.value); break; }
      case 'cre_file':                { tmp.creFile              = entry.value; break; }
      case 'create_qty':              { tmp.createQty            = parseDecOrDefault(entry.value, 1); break; }
      case 'script_name':             { tmp.scriptName           = entry.value; break; }
      case 'ai_ea':                   { tmp.aiEa                 = parseDecOrThrow(entry.value); break; }
      case 'ai_general':              { tmp.aiGeneral            = parseDecOrThrow(entry.value); break; }
      case 'ai_race':                 { tmp.aiRace               = parseDecOrThrow(entry.value); break; }
      case 'ai_class':                { tmp.aiClass              = parseDecOrThrow(entry.value); break; }
      case 'ai_gender':               { tmp.aiGender             = parseDecOrThrow(entry.value); break; }
      case 'ai_specifics':            { tmp.aiSpecifics          = parseDecOrThrow(entry.value); break; }
      case 'ai_alignment':            { tmp.aiAlignment          = parseDecOrThrow(entry.value); break; }
      case 'ai_faction':              { tmp.aiFaction            = parseDecOrThrow(entry.value); break; }
      case 'ai_team':                 {
        if (meta.isPstee) tmp.aiTeam = entry.value;
        else tmp.aiTeam = parseDecOrThrow(entry.value);
        break;
      }
      case 'script_override':         { tmp.scriptOverride       = entry.value; break; }
      case 'script_class':            { tmp.scriptClass          = entry.value; break; }
      case 'script_race':             { tmp.scriptRace           = entry.value; break; }
      case 'script_general':          { tmp.scriptGeneral        = entry.value; break; }
      case 'script_default':          { tmp.scriptDefault        = entry.value; break; }
      case 'script_area':             { tmp.scriptArea           = entry.value; break; }
      case 'script_specifics':        { tmp.scriptSpecifics      = entry.value; break; }
      case 'script_special_1':        { tmp.scriptSpecial1       = entry.value; break; }
      case 'script_team':             { tmp.scriptTeam           = entry.value; break; }
      case 'script_special_2':        { tmp.scriptSpecial2       = entry.value; break; }
      case 'script_combat':           { tmp.scriptCombat         = entry.value; break; }
      case 'script_special_3':        { tmp.scriptSpecial3       = entry.value; break; }
      case 'script_movement':         { tmp.scriptMovement       = entry.value; break; }
      case 'dialog':                  { tmp.dialog               = entry.value; break; }
      case 'good_mod':                { tmp.goodMod              = parseDecOrThrow(entry.value); break; }
      case 'law_mod':                 { tmp.lawMod               = parseDecOrThrow(entry.value); break; }
      case 'lady_mod':                { tmp.ladyMod              = parseDecOrThrow(entry.value); break; }
      case 'murder_mod':              { tmp.murderMod            = parseDecOrThrow(entry.value); break; }
      case 'death_scriptname':        { tmp.deathScriptname      = parseBooleanV1(entry.value); break; }
      case 'death_faction':           { tmp.deathFaction         = parseBooleanV1(entry.value); break; }
      case 'death_team':              { tmp.deathTeam            = parseBooleanV1(entry.value); break; }
      case 'spawn_point':             { tmp.spawnPoint           = parseSpawnPointsV1(entry.value); break; }
      case 'point_select':            { tmp.pointSelect          = parsePointSelectV1(entry.value); break; }
      case 'point_select_var':        { tmp.pointSelectVar       = parseScopedVariableV1(entry.value); break; }
      case 'facing':                  { tmp.facing               = parseDirectionV1(entry.value); break; }
      case 'ignore_can_see':          { tmp.ignoreCanSee         = parseBooleanV1(entry.value); break; }
      case 'check_crowd':             { tmp.checkCrowd           = parseBooleanV1(entry.value); break; }
      case 'find_safest_point':       { tmp.findSafestPoint      = parseBooleanV1(entry.value); break; }
      case 'save_selected_point':     { tmp.saveSelectedPoint    = parseScopedVariableV1(entry.value); break; }
      case 'save_selected_facing':    { tmp.saveSelectedFacing   = parseScopedVariableV1(entry.value); break; }
      case 'spawn_point_global':      { tmp.spawnPointGlobal     = parseScopedVariableV1(entry.value); break; }
      case 'spawn_facing_global':     { tmp.spawnFacingGlobal    = parseScopedVariableV1(entry.value); break; }
      case 'inc_spawn_point_index':   { tmp.incSpawnPointIndex   = parseBooleanV1(entry.value); break; }
      case 'hold_selected_point_key': { tmp.holdSelectedPointKey = parseBooleanV1(entry.value); break; }
      case 'check_by_view_port':      { tmp.checkByViewPort      = parseBooleanV1(entry.value); break; }
      case 'do_not_spawn':            { tmp.doNotSpawn           = parseBooleanV1(entry.value); break; }
      case 'auto_buddy':              { tmp.autoBuddy            = parseBooleanV1(entry.value); break; }
      case 'time_of_day':             { tmp.timeOfDay            = entry.value; break; }
      case 'disable_renderer':        { tmp.disableRenderer      = parseBooleanV1(entry.value); break; }
    }
  /* eslint-enable */
  }

  if (!tmp.specQty) tmp.specQty = tmp.createQty ?? 1;

  if (!tmp.spec) throw new Error(`Spec should not be optional for creature ini section ${section.name}`);

  return {
    name: section.name,
    specVar: tmp.specVar!,
    spec: tmp.spec,
    specArea: tmp.specArea!,
    specQty: tmp.specQty,
    specVarInc: tmp.specVarInc!,
    specVarValue: tmp.specVarValue!,
    specVarOperation: tmp.specVarOperation!,
    areaDiff1: tmp.areaDiff1!,
    areaDiff2: tmp.areaDiff2!,
    areaDiff3: tmp.areaDiff3!,
    creFile: tmp.creFile!,
    createQty: tmp.createQty!,
    scriptName: tmp.scriptName!,
    aiEa: tmp.aiEa!,
    aiGeneral: tmp.aiGeneral!,
    aiRace: tmp.aiRace!,
    aiClass: tmp.aiClass!,
    aiGender: tmp.aiGender!,
    aiSpecifics: tmp.aiSpecifics!,
    aiAlignment: tmp.aiAlignment!,
    aiFaction: tmp.aiFaction!,
    aiTeam: tmp.aiTeam!,
    scriptOverride: tmp.scriptOverride!,
    scriptClass: tmp.scriptClass!,
    scriptRace: tmp.scriptRace!,
    scriptGeneral: tmp.scriptGeneral!,
    scriptDefault: tmp.scriptDefault!,
    scriptArea: tmp.scriptArea!,
    scriptSpecifics: tmp.scriptSpecifics!,
    scriptSpecial1: tmp.scriptSpecial1!,
    scriptTeam: tmp.scriptTeam!,
    scriptSpecial2: tmp.scriptSpecial2!,
    scriptCombat: tmp.scriptCombat!,
    scriptSpecial3: tmp.scriptSpecial3!,
    scriptMovement: tmp.scriptMovement!,
    dialog: tmp.dialog!,
    goodMod: tmp.goodMod!,
    lawMod: tmp.lawMod!,
    ladyMod: tmp.ladyMod!,
    murderMod: tmp.murderMod!,
    deathScriptname: tmp.deathScriptname!,
    deathFaction: tmp.deathFaction!,
    deathTeam: tmp.deathTeam!,
    spawnPoint: tmp.spawnPoint!,
    pointSelect: tmp.pointSelect!,
    pointSelectVar: tmp.pointSelectVar!,
    facing: tmp.facing!,
    ignoreCanSee: tmp.ignoreCanSee!,
    checkCrowd: tmp.checkCrowd!,
    findSafestPoint: tmp.findSafestPoint!,
    saveSelectedPoint: tmp.saveSelectedPoint!,
    saveSelectedFacing: tmp.saveSelectedFacing!,
    spawnPointGlobal: tmp.spawnPointGlobal!,
    spawnFacingGlobal: tmp.spawnFacingGlobal!,
    incSpawnPointIndex: tmp.incSpawnPointIndex!,
    holdSelectedPointKey: tmp.holdSelectedPointKey!,
    checkByViewPort: tmp.checkByViewPort!,
    doNotSpawn: tmp.doNotSpawn!,
    autoBuddy: tmp.autoBuddy!,
    timeOfDay: tmp.timeOfDay!,
    disableRenderer: tmp.disableRenderer!,
  };
};

export default parseCreatureSectionV1;
