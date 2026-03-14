import { parseDecOrThrow, parseDecOrDefault, parseDecOrNothing } from '../../../../shared/customParsers.js';
import { nothing } from '../../../../shared/maybe.js';
import { parseIniFromString } from './iniParser.js';

import type { PartialWriteable } from '../../../../shared/types.js';
import type { Maybe } from '../../../../shared/maybe.js';
import type {
  CreatureIniPointSelect,
  CreatureIniScopedVariable,
  CreatureIniSection,
  CreatureIniSpawnPoint,
  CreatureIniSpec,
  CreatureIniSpecArea,
  CreatureIniSpecVarOperation,
  Direction,
  GroupIniSection,
  Ini,
  NamelessIniSection,
  SpawnMainIniSection,
} from '../types.js';
import type { Section, SectionEntry } from './iniParserTypes.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> =>
  entries.find(e => e.key === key)?.value;

const parseDirection = (s: Maybe<string>): Direction => {
  if (!s) throw new Error(`Cannot parse Direction from nothing`);

  /* eslint-disable @stylistic/no-multi-spaces */
  switch (s) {
    case '0'  : return  '0=south';
    case '1'  : return  '1=south-south-west';
    case '2'  : return  '2=south-west';
    case '3'  : return  '3=south-west-west';
    case '4'  : return  '4=west';
    case '5'  : return  '5=north-west-west';
    case '6'  : return  '6=north-west';
    case '7'  : return  '7=north-north-west';
    case '8'  : return  '8=north';
    case '9'  : return  '9=north-north-east';
    case '10' : return '10=north-east';
    case '11' : return '11=north-east-east';
    case '12' : return '12=east';
    case '13' : return '13=south-east-east';
    case '14' : return '14=south-east';
    case '15' : return '15=south-south-east';
    default: throw new Error(`Cannot parse Direction from ${s}`);
  }
  /* eslint-enable */
};

const parseSpawnPoint = (s: string): CreatureIniSpawnPoint => {
  const [coords, directionPart] = s.split(':');
  if (!coords) throw new Error(`Supported format are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...', but you passed '${s}'. Why?`);

  const [x, y] = coords.split('.').map(parseDecOrThrow);
  if (!x || !y) throw new Error(`Supported format are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...', but you passed '${s}'. Why?`);

  return {
    x,
    y,
    direction: directionPart ? parseDirection(directionPart) : '0=south',
  };
};

const parseCommaSeparatedSpawnPoints = (s: string): CreatureIniSpawnPoint[] =>
  s.split(',').map(batch => parseSpawnPoint(batch.slice(1, -1)));

const parseBracketSeparatedSpawnPoints = (s: string): CreatureIniSpawnPoint[] =>
  s.slice(1, -1).split('][').map(parseSpawnPoint);

const parseSpawnPoints = (s: Maybe<string>): CreatureIniSpawnPoint[] => {
  if (!s) throw new Error(`Cannot parse SpawnPoint from nothing`);

  return s.includes(',')
    ? parseCommaSeparatedSpawnPoints(s)
    : parseBracketSeparatedSpawnPoints(s);
};

const parseCoords = (s: Maybe<string>): [number, number] => {
  if (!s) throw new Error(`Cannot parse Coords from nothing`);

  const stringCoords = s.slice(1, -1).split('.');
  if (stringCoords.length !== 2) throw new Error(`Suported format is '[x.y]', but you passed '${s}'. Why?`);

  const x = parseDecOrThrow(stringCoords[0]);
  const y = parseDecOrThrow(stringCoords[1]);
  return [x, y];
};

const parseScopedVariable = (s: Maybe<string>): CreatureIniScopedVariable => {
  if (!s) throw new Error(`Cannot parse ScopedVariable from nothing`);
  const items = s.split('::');

  switch (items.length) {
    case 1: {
      const variableName = items[0];
      if (!variableName) throw new Error(`Suported format is 'scope::varible_name', but you passed '${s}'. Why?`);
      return {
        scope: 'GLOBAL',
        variableName: variableName.trim(),
      };
    }
    case 2: {
      const scope = items[0];
      const variableName = items[1];
      if (!scope || !variableName) throw new Error(`Suported format is 'scope::varible_name', but you passed '${s}'. Why?`);

      return {
        scope: scope.trim(),
        variableName: variableName.trim(),
      };
    }
    default: throw new Error(`Suported format is 'scope::varible_name', but you passed '${s}'. Why?`);
  }
};

const parseSpec = (s: Maybe<string>): string | CreatureIniSpec => {
  if (!s) throw new Error(`Cannot parse Spec variable from nothing`);

  const seemsScriptName = !s.startsWith('[') && !s.endsWith(']');
  if (seemsScriptName) return s;

  // [EA.FACTION.TEAM.GENERAL.RACE.CLASS.SPECIFIC.GENDER.ALIGN]
  const items = s.slice(1, -1).split('.');
  return {
    ea: parseDecOrDefault(items[0], 0),
    faction: parseDecOrDefault(items[1], 0),
    team: parseDecOrDefault(items[2], 0),
    general: parseDecOrDefault(items[3], 0),
    race: parseDecOrDefault(items[4], 0),
    class: parseDecOrDefault(items[5], 0),
    specific: parseDecOrDefault(items[6], 0),
    gender: parseDecOrDefault(items[7], 0),
    align: parseDecOrDefault(items[8], 0),
  };
};

const parseSpecArea = (s: Maybe<string>): CreatureIniSpecArea => {
  if (!s) throw new Error(`Cannot parse SpecArea from nothing`);

  // [centerX,centerY,range,unknown?]
  const items = s.slice(1, -1).split(',');

  return {
    centerX: parseDecOrNothing(items[0]),
    centerY: parseDecOrNothing(items[1]),
    range: parseDecOrNothing(items[2]),
    other: items[3],
  };
};

const parseSpecVarOperation = (s: Maybe<string>): CreatureIniSpecVarOperation => {
  if (!s) throw new Error(`Cannot parse SpecVarOperation from nothing`);

  switch (s) {
    case 'greater_than':
    case 'less_than':
    case 'equal_to':
    case 'not_equal_to':
      return s;
    default: throw new Error(`Cannot parse SpecVarOperation from '${s}'`);
  }
};

const parseBoolean = (s: Maybe<string>): boolean => {
  if (!s) throw new Error(`Cannot parse Boolean from nothing`);

  switch (s.toLowerCase()) {
    case '0':
    case 'false':
      return false;
    case '1':
    case 'true':
      return true;
    default: throw new Error(`Cannot parse Boolean from '${s}'`);
  }
};

const parsePointSelect = (s: string | undefined): CreatureIniPointSelect => {
  if (!s) throw new Error(`Cannot parse PointSelect from nothing`);

  switch (s.toLowerCase()) {
    case 'e': return 'e=POINT_SELECT_EXPLICIT';
    case 'i': return 'i=POINT_SELECT_INDEXED_SEQUENTIAL';
    case 'r': return 'r=POINT_SELECT_RANDOM_SEQUENTIAL';
    case 's': return 's=POINT_SELECT_SEQUENTIAL';
    default: throw new Error(`Cannot parse PointSelect from ${s}`);
  }
};

const parseNamelessSection = (section: Section): Maybe<NamelessIniSection> => {
  if (section.name !== 'nameless') throw new Error(`Expect section '${section.name}' to be 'nameless' section`);
  if (!section.entries.length) return nothing();

  /* eslint-disable @stylistic/no-multi-spaces */
  const destare    = findEntry(section.entries, 'destare');
  const point      = findEntry(section.entries, 'point');
  const state      = findEntry(section.entries, 'state');
  const partyPoint = findEntry(section.entries, 'partyPoint');
  const partyArea  = findEntry(section.entries, 'partyArea');
  /* eslint-enable */

  if (!destare) throw new Error('Destare is not optional in the \'nameless\' section');
  if (!point) throw new Error('Point is not optional in the \'nameless\' section');
  if (!state) throw new Error('State is not optional in the \'nameless\' section');

  return {
    destare,
    point: parseCoords(point),
    state: parseDecOrThrow(state),
    partyPoint: partyPoint ? parseCoords(partyPoint) : undefined,
    partyArea,
  };
};

const parseNamelessvarSection = (section: Section): Maybe<Map<string, number>> => {
  if (section.name !== 'namelessvar') throw new Error(`Expect section '${section.name}' to be 'namelessvar' section`);
  if (!section.entries.length) return nothing();

  return new Map(section.entries.map(({ key, value }) => [key, parseDecOrThrow(value)]));
};

const parseLocalsSection = (section: Section): Maybe<Map<string, string>> => {
  if (section.name !== 'locals') throw new Error(`Expect section '${section.name}' to be 'locals' section`);
  if (!section.entries.length) return nothing();

  return new Map(section.entries.map(({ key, value }) => [key, value]));
};

const parseSpawnMainSection = (section: Section): Maybe<SpawnMainIniSection> => {
  if (section.name !== 'spawn_main') throw new Error(`Expect section '${section.name}' to be 'spawn_main' section`);
  if (!section.entries.length) return nothing();

  /* eslint-disable @stylistic/no-multi-spaces */
  const enter  = findEntry(section.entries, 'enter');
  const exit   = findEntry(section.entries, 'exit');
  const events = findEntry(section.entries, 'events');
  /* eslint-enable */

  const foundNothing = !enter && !exit && !events;
  if (foundNothing) return nothing();
  return { enter, exit, events };
};

const parseGroupSection = (section: Section): Maybe<GroupIniSection> => {
  const entries = Object.fromEntries(section.entries.map(({ key, value }) => [key, value]));

  if (!entries['critters']) throw new Error(`Critters should not be optional for group ini section ${section.name}`);

  return {
    name: section.name,
    critters: entries['critters'].split(','),
    interval: parseDecOrNothing(entries['interval']),
    detail_level: entries['detail_level'],
    control_var: entries['control_var'],
    spawn_time_of_day: entries['spawn_time_of_day'],
  };
};

const parseCreatureSection = (section: Section): Maybe<CreatureIniSection> => {
  const tmp: PartialWriteable<CreatureIniSection> = {};

  for (const entry of section.entries) {
  /* eslint-disable @stylistic/no-multi-spaces */
    if (entry.key === 'spec_var')                tmp.specVar              = parseScopedVariable(entry.value);
    if (entry.key === 'spec')                    tmp.spec                 = parseSpec(entry.value);
    if (entry.key === 'spec_area')               tmp.specArea             = parseSpecArea(entry.value);
    if (entry.key === 'spec_qty')                tmp.specQty              = parseDecOrThrow(entry.value);
    if (entry.key === 'spec_var_inc')            tmp.specVarInc           = parseDecOrThrow(entry.value);
    if (entry.key === 'spec_var_value')          tmp.specVarValue         = parseDecOrThrow(entry.value);
    if (entry.key === 'spec_var_operation')      tmp.specVarOperation     = parseSpecVarOperation(entry.value);
    if (entry.key === 'area_diff_1')             tmp.areaDiff1            = parseBoolean(entry.value);
    if (entry.key === 'area_diff_2')             tmp.areaDiff2            = parseBoolean(entry.value);
    if (entry.key === 'area_diff_3')             tmp.areaDiff3            = parseBoolean(entry.value);
    if (entry.key === 'cre_file')                tmp.creFile              = entry.value;
    if (entry.key === 'create_qty')              tmp.createQty            = parseDecOrDefault(entry.value, 1);
    if (entry.key === 'script_name')             tmp.scriptName           = entry.value;
    if (entry.key === 'ai_ea')                   tmp.aiEa                 = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_general')              tmp.aiGeneral            = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_race')                 tmp.aiRace               = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_class')                tmp.aiClass              = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_gender')               tmp.aiGender             = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_specifics')            tmp.aiSpecifics          = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_alignment')            tmp.aiAlignment          = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_faction')              tmp.aiFaction            = parseDecOrThrow(entry.value);
    if (entry.key === 'ai_team')                 tmp.aiTeam               = parseDecOrThrow(entry.value);
    if (entry.key === 'script_override')         tmp.scriptOverride       = entry.value;
    if (entry.key === 'script_class')            tmp.scriptClass          = entry.value;
    if (entry.key === 'script_race')             tmp.scriptRace           = entry.value;
    if (entry.key === 'script_general')          tmp.scriptGeneral        = entry.value;
    if (entry.key === 'script_default')          tmp.scriptDefault        = entry.value;
    if (entry.key === 'script_area')             tmp.scriptArea           = entry.value;
    if (entry.key === 'script_specifics')        tmp.scriptSpecifics      = entry.value;
    if (entry.key === 'script_special_1')        tmp.scriptSpecial1       = entry.value;
    if (entry.key === 'script_team')             tmp.scriptTeam           = entry.value;
    if (entry.key === 'script_special_2')        tmp.scriptSpecial2       = entry.value;
    if (entry.key === 'script_combat')           tmp.scriptCombat         = entry.value;
    if (entry.key === 'script_special_3')        tmp.scriptSpecial3       = entry.value;
    if (entry.key === 'script_movement')         tmp.scriptMovement       = entry.value;
    if (entry.key === 'dialog')                  tmp.dialog               = entry.value;
    if (entry.key === 'good_mod')                tmp.goodMod              = parseDecOrThrow(entry.value);
    if (entry.key === 'law_mod')                 tmp.lawMod               = parseDecOrThrow(entry.value);
    if (entry.key === 'lady_mod')                tmp.ladyMod              = parseDecOrThrow(entry.value);
    if (entry.key === 'murder_mod')              tmp.murderMod            = parseDecOrThrow(entry.value);
    if (entry.key === 'death_scriptname')        tmp.deathScriptname      = parseBoolean(entry.value);
    if (entry.key === 'death_faction')           tmp.deathFaction         = parseBoolean(entry.value);
    if (entry.key === 'death_team')              tmp.deathTeam            = parseBoolean(entry.value);
    if (entry.key === 'spawn_point')             tmp.spawnPoint           = parseSpawnPoints(entry.value);
    if (entry.key === 'point_select')            tmp.pointSelect          = parsePointSelect(entry.value);
    if (entry.key === 'point_select_var')        tmp.pointSelectVar       = parseScopedVariable(entry.value);
    if (entry.key === 'facing')                  tmp.facing               = parseDirection(entry.value);
    if (entry.key === 'ignore_can_see')          tmp.ignoreCanSee         = parseBoolean(entry.value);
    if (entry.key === 'check_crowd')             tmp.checkCrowd           = parseBoolean(entry.value);
    if (entry.key === 'find_safest_point')       tmp.findSafestPoint      = parseBoolean(entry.value);
    if (entry.key === 'save_selected_point')     tmp.saveSelectedPoint    = parseScopedVariable(entry.value);
    if (entry.key === 'save_selected_facing')    tmp.saveSelectedFacing   = parseScopedVariable(entry.value);
    if (entry.key === 'spawn_point_global')      tmp.spawnPointGlobal     = parseScopedVariable(entry.value);
    if (entry.key === 'spawn_facing_global')     tmp.spawnFacingGlobal    = parseScopedVariable(entry.value);
    if (entry.key === 'inc_spawn_point_index')   tmp.incSpawnPointIndex   = parseBoolean(entry.value);
    if (entry.key === 'hold_selected_point_key') tmp.holdSelectedPointKey = parseBoolean(entry.value);
    if (entry.key === 'check_by_view_port')      tmp.checkByViewPort      = parseBoolean(entry.value);
    if (entry.key === 'do_not_spawn')            tmp.doNotSpawn           = parseBoolean(entry.value);
    if (entry.key === 'auto_buddy')              tmp.autoBuddy            = parseBoolean(entry.value);
    if (entry.key === 'time_of_day')             tmp.timeOfDay            = entry.value;
    if (entry.key === 'disable_renderer')        tmp.disableRenderer      = parseBoolean(entry.value);
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

const patchIniSyntax = (content: string, resourceName: string): string => {
  switch (resourceName) {
    case 'ar0203.ini': return content.replace('[repetitive', '[repetitive]');
    case 'ar1600.ini': return content.replaceAll('[3898,1705:8]', '[3898.1705:8]');
    default: return content;
  }
};

const parseIniV1FromBuffer = (buffer: Buffer, resourceName: string): Ini => {
  const content = patchIniSyntax(buffer.toString(), resourceName);
  const ini = parseIniFromString(content);

  let nameless: Maybe<Ini['nameless']> = nothing();
  let namelessvar: Maybe<Ini['namelessvar']> = nothing();
  let locals: Maybe<Ini['locals']> = nothing();
  let spawnMain: Maybe<Ini['spawnMain']> = nothing();
  const groupSections: Ini['groupSections'] = [];
  const creatureSections: Ini['creatureSections'] = [];

  for (const section of ini.sections) {
    switch (section.name) {
      case 'nameless': {
        nameless = parseNamelessSection(section);
        continue;
      }
      case 'namelessvar': {
        namelessvar = parseNamelessvarSection(section);
        continue;
      }
      case 'locals': {
        locals = parseLocalsSection(section);
        continue;
      }
      case 'spawn_main': {
        spawnMain = parseSpawnMainSection(section);
        continue;
      }
      default: break;
    }

    const entryKeys = new Set(section.entries.map(e => e.key));

    const isGroupSection = entryKeys.has('critters');
    if (isGroupSection) {
      const group = parseGroupSection(section);
      if (group) groupSections.push(group);
      continue;
    }

    const isCreatureSection = entryKeys.has('spec');
    if (isCreatureSection) {
      const creature = parseCreatureSection(section);
      if (creature) creatureSections.push(creature);
      continue;
    }

    throw new Error(`Cannot parse section ${section.name}`);
  }

  return {
    resourceName,
    nameless: nameless,
    namelessvar: namelessvar,
    locals: locals,
    spawnMain: spawnMain,
    groupSections: groupSections,
    creatureSections: creatureSections,
  };
};

export default parseIniV1FromBuffer;
