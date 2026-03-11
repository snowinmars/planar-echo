import { join } from 'path';
import { readFile } from 'fs/promises';
import { parseIniFromString } from './iniParser.js';
import type { DecompiledItem, Maybe, PartialWriteable, Pathes } from '../../shared/types.js';
import type {
  CreatureIniPointSelect,
  CreatureIniSection,
  CreatureIniSpawnPoint,
  CreatureIniSpec,
  CreatureIniSpecArea,
  CreatureIniSpecVarOperation,
  Direction,
  GroupIniSection,
  Ini,
  NamelessIniSection,
  CreatureIniScopedVariable,
  SpawnMainIniSection,
} from './convertIniTypes.js';
import type { Section } from './iniParserTypes.js';

const parseCoords = (s: string | undefined): [number, number] => {
  if (!s) throw new Error(`Cannot parse coords from empty string`);
  const stringCoords = s.slice(1, -1).split('.');
  if (stringCoords.length !== 2) throw new Error(`Why do you want to parse string coords from line '${s}', if the format is [x.y]?`);

  const x = parseInt(stringCoords[0]!, 10);
  const y = parseInt(stringCoords[1]!, 10);
  return [x, y];
};

const parseScopedVariable = (s: string | undefined): CreatureIniScopedVariable => {
  if (!s) throw new Error(`Cannot parse scoped variable from empty string`);
  const items = s.split('::');

  // length of 1 is ok because scope is optional
  // length of 2 is ok because scope::variableName
  if (items.length === 0 || items.length > 2) throw new Error(`Why do you want to parse scoped variable from line '${s}', if the format is 'scope::varible_name'?`);

  const hasScope = items.length === 2;
  if (hasScope) {
    const scope = items[0]!.trim();
    const variableName = items[1]!.trim();

    return { scope, variableName };
  }

  const scope = 'GLOBAL';
  const variableName = items[0]!.trim();

  return { scope, variableName };
};

const parseSpec = (s: string | undefined): string | CreatureIniSpec => {
  if (!s) throw new Error(`Cannot parse spec from empty string`);

  const seemsScriptName = !s.startsWith('[') && !s.endsWith(']');
  if (seemsScriptName) return s;

  // [EA.FACTION.TEAM.GENERAL.RACE.CLASS.SPECIFIC.GENDER.ALIGN]
  const items = s.slice(1, -1).split('.');
  return {
    ea: parseInt(items[0] ?? '0'),
    faction: parseInt(items[1] ?? '0'),
    team: parseInt(items[2] ?? '0'),
    general: parseInt(items[3] ?? '0'),
    race: parseInt(items[4] ?? '0'),
    class: parseInt(items[5] ?? '0'),
    specific: parseInt(items[6] ?? '0'),
    gender: parseInt(items[7] ?? '0'),
    align: parseInt(items[8] ?? '0'),
  };
};

const parseSpecArea = (s: string | undefined): CreatureIniSpecArea => {
  if (!s) throw new Error(`Cannot parse spec area from empty string`);

  // [centerX,centerY,range,unknown?]
  const items = s.slice(1, -1).split(',');

  return {
    centerX: items[0] ? parseInt(items[0]) : undefined,
    centerY: items[1] ? parseInt(items[1]) : undefined,
    range: items[2] ? parseInt(items[2]) : undefined,
    other: items[3],
  };
};
const parseSpecVarOperation = (s: string | undefined): CreatureIniSpecVarOperation => {
  if (!s) throw new Error(`Cannot parse spec_var_operation from empty string`);
  if (s === 'greater_than') return s;
  if (s === 'less_than') return s;
  if (s === 'equal_to') return s;
  if (s === 'not_equal_to') return s;
  throw new Error(`Unknown spec_var_operation '${s}'`);
};

const parseBoolean = (s: string | undefined): boolean => {
  if (s === '0') return false;
  if (s && s.toLowerCase() === 'false') return false;
  if (s === '1') return true;
  if (s && s.toLowerCase() === 'true') return true;
  throw new Error(`Cannot parse boolean from '${s}'`);
};

const parseDirection = (s: string | undefined): Direction => {
  switch (s) {
    case '0': return '0=south';
    case '1': return '1';
    case '2': return '2=south-west';
    case '3': return '3';
    case '4': return '4=west';
    case '5': return '5';
    case '6': return '6=north-west';
    case '7': return '7';
    case '8': return '8=north';
    case '9': return '9';
    case '10': return '10=north-east';
    case '11': return '11';
    case '12': return '12=east';
    case '13': return '13';
    case '14': return '14=south-east';
    case '15': return '15';
    default: throw new Error(`Cannot parse direction from ${s}`);
  }
};

const parsePointSelect = (s: string | undefined): CreatureIniPointSelect => {
  if (!s) throw new Error(`Cannot parse point select from empty string`);
  switch (s.toLowerCase()) {
    case 'e': return 'e=POINT_SELECT_EXPLICIT';
    case 'i': return 'i=POINT_SELECT_INDEXED_SEQUENTIAL';
    case 'r': return 'r=POINT_SELECT_RANDOM_SEQUENTIAL';
    case 's': return 's=POINT_SELECT_SEQUENTIAL';
    default: throw new Error(`Cannot parse point select from ${s}`);
  }
};

const parseSpawnPoints = (s: string | undefined): CreatureIniSpawnPoint[] => {
  if (!s) throw new Error(`Cannot parse spawn points from empty string`);
  const isCommaSeparatedFormat = s.includes(',');
  if (isCommaSeparatedFormat) {
    return s.split(',').map((batch): CreatureIniSpawnPoint => {
      const isOkFormat = batch.includes('.');
      if (!isOkFormat) {
        throw new Error(`Why do you want to parse spawn points from line '${s}', if the formats are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...'?`);
      }

      // [x.y:dir],[x.y:dir]
      const a = batch.slice(1, -1).split('.');
      const b = a[1]!.split(':');

      const x = parseInt(a[0]!);
      const y = parseInt(b[0]!);
      const direction = b[1] ? parseDirection(b[1]) : '0=south';

      return {
        x, y, direction,
      };
    });
  }
  else {
    return s.slice(1, -1).split('][').map((batch): CreatureIniSpawnPoint => {
      const isOkFormat = batch.includes('.');
      if (!isOkFormat) {
        throw new Error(`Why do you want to parse spawn points from line '${s}', if the formats are '[x.y:dir][x.y:dir]...' / '[x.y:dir][x.y:dir]...'?`);
      }

      // [x.y:dir][x.y:dir]
      const a = batch.split('.');
      const b = a[1]!.split(':');

      const x = parseInt(a[0]!);
      const y = parseInt(b[0]!);
      const direction = b[1] ? parseDirection(b[1]) : '0=south';

      return {
        x, y, direction,
      };
    });
  }
};

const parseNamelessSection = (section: Section): Maybe<NamelessIniSection> => {
  if (section.name !== 'nameless') throw new Error(`Wrong parsing section '${section.name}' as nameless`);
  if (!section.entries.length) return undefined;

  const destare = section.entries.find(x => x.key === 'destare')?.value;
  const point = section.entries.find(x => x.key === 'point')?.value;
  const state = section.entries.find(x => x.key === 'state')?.value;
  const partyPoint = section.entries.find(x => x.key === 'partyPoint')?.value;
  const partyArea = section.entries.find(x => x.key === 'partyArea')?.value;

  if (!destare) throw new Error('Destare should be optional, change the source code');
  if (!point) throw new Error('Point should be optional, change the source code');
  if (!state) throw new Error('State should be optional, change the source code');

  return {
    destare,
    point: parseCoords(point),
    state: parseInt(state, 10),
    partyPoint: partyPoint ? parseCoords(partyPoint) : undefined,
    partyArea,
  };
};

const parseNamelessvarSection = (section: Section): Maybe<Map<string, number>> => {
  if (section.name !== 'namelessvar') throw new Error(`Wrong parsing section '${section.name}' as namelessvar`);
  if (!section.entries.length) return undefined;

  const map = new Map<string, number>();
  for (const entry of section.entries) {
    map.set(entry.key, parseInt(entry.value));
  }

  return map;
};

const parseLocalsSection = (section: Section): Maybe<Map<string, string>> => {
  if (section.name !== 'locals') throw new Error(`Wrong parsing section '${section.name}' as locals`);
  if (!section.entries.length) return undefined;

  const map = new Map<string, string>();
  for (const entry of section.entries) {
    map.set(entry.key, entry.value);
  }

  return map;
};

const parseSpawnMainSection = (section: Section): Maybe<SpawnMainIniSection> => {
  if (section.name !== 'spawn_main') throw new Error(`Wrong parsing section '${section.name}' as spawn_main`);
  if (!section.entries.length) return undefined;

  const enter = section.entries.find(x => x.key === 'enter')?.value;
  const exit = section.entries.find(x => x.key === 'exit')?.value;
  const events = section.entries.find(x => x.key === 'events')?.value;

  if (!enter && !exit && !events) return undefined;
  return {
    enter,
    exit,
    events,
  };
};

const parseGroupSection = (section: Section): Maybe<GroupIniSection> => {
  const tmp: PartialWriteable<GroupIniSection> = {};

  for (const entry of section.entries) {
    if (entry.key === 'critters') tmp.critters = entry.value.split(',');
    if (entry.key === 'interval') tmp.interval = entry.value ? parseInt(entry.value) : undefined;
    if (entry.key === 'detail_level') tmp.detail_level = entry.value;
    if (entry.key === 'control_var') tmp.control_var = entry.value;
    if (entry.key === 'spawn_time_of_day') tmp.spawn_time_of_day = entry.value;
  }

  if (!tmp.critters) throw new Error(`Critters should not be optional for group ini section ${section.name}`);

  return {
    name: section.name,
    critters: tmp.critters,
    interval: tmp.interval,
    detail_level: tmp.detail_level,
    control_var: tmp.control_var,
    spawn_time_of_day: tmp.spawn_time_of_day,
  };
};

const parseCreatureSection = (section: Section): Maybe<CreatureIniSection> => {
  const tmp: PartialWriteable<CreatureIniSection> = {};

  for (const entry of section.entries) {
    if (entry.key === 'spec_var') tmp.spec_var = parseScopedVariable(entry.value);
    if (entry.key === 'spec') tmp.spec = parseSpec(entry.value);
    if (entry.key === 'spec_area') tmp.spec_area = parseSpecArea(entry.value);
    if (entry.key === 'spec_qty') tmp.spec_qty = parseInt(entry.value, 10);
    if (entry.key === 'spec_var_inc') tmp.spec_var_inc = parseInt(entry.value, 10);
    if (entry.key === 'spec_var_value') tmp.spec_var_value = parseInt(entry.value, 10);
    if (entry.key === 'spec_var_operation') tmp.spec_var_operation = parseSpecVarOperation(entry.value);
    if (entry.key === 'area_diff_1') tmp.area_diff_1 = parseBoolean(entry.value);
    if (entry.key === 'area_diff_2') tmp.area_diff_2 = parseBoolean(entry.value);
    if (entry.key === 'area_diff_3') tmp.area_diff_3 = parseBoolean(entry.value);
    if (entry.key === 'cre_file') tmp.cre_file = entry.value;
    if (entry.key === 'create_qty') tmp.create_qty = entry.value ? parseInt(entry.value, 10) : 1;
    if (entry.key === 'script_name') tmp.script_name = entry.value;
    if (entry.key === 'ai_ea') tmp.ai_ea = parseInt(entry.value, 10);
    if (entry.key === 'ai_general') tmp.ai_general = parseInt(entry.value, 10);
    if (entry.key === 'ai_race') tmp.ai_race = parseInt(entry.value, 10);
    if (entry.key === 'ai_class') tmp.ai_class = parseInt(entry.value, 10);
    if (entry.key === 'ai_gender') tmp.ai_gender = parseInt(entry.value, 10);
    if (entry.key === 'ai_specifics') tmp.ai_specifics = parseInt(entry.value, 10);
    if (entry.key === 'ai_alignment') tmp.ai_alignment = parseInt(entry.value, 10);
    if (entry.key === 'ai_faction') tmp.ai_faction = parseInt(entry.value, 10);
    if (entry.key === 'ai_team') tmp.ai_team = parseInt(entry.value, 10);
    if (entry.key === 'script_override') tmp.script_override = entry.value;
    if (entry.key === 'script_class') tmp.script_class = entry.value;
    if (entry.key === 'script_race') tmp.script_race = entry.value;
    if (entry.key === 'script_general') tmp.script_general = entry.value;
    if (entry.key === 'script_default') tmp.script_default = entry.value;
    if (entry.key === 'script_area') tmp.script_area = entry.value;
    if (entry.key === 'script_specifics') tmp.script_specifics = entry.value;
    if (entry.key === 'script_special_1') tmp.script_special_1 = entry.value;
    if (entry.key === 'script_team') tmp.script_team = entry.value;
    if (entry.key === 'script_special_2') tmp.script_special_2 = entry.value;
    if (entry.key === 'script_combat') tmp.script_combat = entry.value;
    if (entry.key === 'script_special_3') tmp.script_special_3 = entry.value;
    if (entry.key === 'script_movement') tmp.script_movement = entry.value;
    if (entry.key === 'dialog') tmp.dialog = entry.value;
    if (entry.key === 'good_mod') tmp.good_mod = parseInt(entry.value, 10);
    if (entry.key === 'law_mod') tmp.law_mod = parseInt(entry.value, 10);
    if (entry.key === 'lady_mod') tmp.lady_mod = parseInt(entry.value, 10);
    if (entry.key === 'murder_mod') tmp.murder_mod = parseInt(entry.value, 10);
    if (entry.key === 'death_scriptname') tmp.death_scriptname = parseBoolean(entry.value);
    if (entry.key === 'death_faction') tmp.death_faction = parseBoolean(entry.value);
    if (entry.key === 'death_team') tmp.death_team = parseBoolean(entry.value);
    if (entry.key === 'spawn_point') tmp.spawn_point = parseSpawnPoints(entry.value);
    if (entry.key === 'point_select') tmp.point_select = parsePointSelect(entry.value);
    if (entry.key === 'point_select_var') tmp.point_select_var = parseScopedVariable(entry.value);
    if (entry.key === 'facing') tmp.facing = parseDirection(entry.value);
    if (entry.key === 'ignore_can_see') tmp.ignore_can_see = parseBoolean(entry.value);
    if (entry.key === 'check_crowd') tmp.check_crowd = parseBoolean(entry.value);
    if (entry.key === 'find_safest_point') tmp.find_safest_point = parseBoolean(entry.value);
    if (entry.key === 'save_selected_point') tmp.save_selected_point = parseScopedVariable(entry.value);
    if (entry.key === 'save_selected_facing') tmp.save_selected_facing = parseScopedVariable(entry.value);
    if (entry.key === 'spawn_point_global') tmp.spawn_point_global = parseScopedVariable(entry.value);
    if (entry.key === 'spawn_facing_global') tmp.spawn_facing_global = parseScopedVariable(entry.value);
    if (entry.key === 'inc_spawn_point_index') tmp.inc_spawn_point_index = parseBoolean(entry.value);
    if (entry.key === 'hold_selected_point_key') tmp.hold_selected_point_key = parseBoolean(entry.value);
    if (entry.key === 'check_by_view_port') tmp.check_by_view_port = parseBoolean(entry.value);
    if (entry.key === 'do_not_spawn') tmp.do_not_spawn = parseBoolean(entry.value);
    if (entry.key === 'auto_buddy') tmp.auto_buddy = parseBoolean(entry.value);
    if (entry.key === 'time_of_day') tmp.time_of_day = entry.value;
    if (entry.key === 'disable_renderer') tmp.disable_renderer = parseBoolean(entry.value);
  }

  if (!tmp.spec_qty) tmp.spec_qty = tmp.create_qty ?? 1;

  if (!tmp.spec) throw new Error(`Spec should not be optional for creature ini section ${section.name}`);

  return {
    name: section.name,
    spec_var: tmp.spec_var!,
    spec: tmp.spec!,
    spec_area: tmp.spec_area!,
    spec_qty: tmp.spec_qty!,
    spec_var_inc: tmp.spec_var_inc!,
    spec_var_value: tmp.spec_var_value!,
    spec_var_operation: tmp.spec_var_operation!,
    area_diff_1: tmp.area_diff_1!,
    area_diff_2: tmp.area_diff_2!,
    area_diff_3: tmp.area_diff_3!,
    cre_file: tmp.cre_file!,
    create_qty: tmp.create_qty!,
    script_name: tmp.script_name!,
    ai_ea: tmp.ai_ea!,
    ai_general: tmp.ai_general!,
    ai_race: tmp.ai_race!,
    ai_class: tmp.ai_class!,
    ai_gender: tmp.ai_gender!,
    ai_specifics: tmp.ai_specifics!,
    ai_alignment: tmp.ai_alignment!,
    ai_faction: tmp.ai_faction!,
    ai_team: tmp.ai_team!,
    script_override: tmp.script_override!,
    script_class: tmp.script_class!,
    script_race: tmp.script_race!,
    script_general: tmp.script_general!,
    script_default: tmp.script_default!,
    script_area: tmp.script_area!,
    script_specifics: tmp.script_specifics!,
    script_special_1: tmp.script_special_1!,
    script_team: tmp.script_team!,
    script_special_2: tmp.script_special_2!,
    script_combat: tmp.script_combat!,
    script_special_3: tmp.script_special_3!,
    script_movement: tmp.script_movement!,
    dialog: tmp.dialog!,
    good_mod: tmp.good_mod!,
    law_mod: tmp.law_mod!,
    lady_mod: tmp.lady_mod!,
    murder_mod: tmp.murder_mod!,
    death_scriptname: tmp.death_scriptname!,
    death_faction: tmp.death_faction!,
    death_team: tmp.death_team!,
    spawn_point: tmp.spawn_point!,
    point_select: tmp.point_select!,
    point_select_var: tmp.point_select_var!,
    facing: tmp.facing!,
    ignore_can_see: tmp.ignore_can_see!,
    check_crowd: tmp.check_crowd!,
    find_safest_point: tmp.find_safest_point!,
    save_selected_point: tmp.save_selected_point!,
    save_selected_facing: tmp.save_selected_facing!,
    spawn_point_global: tmp.spawn_point_global!,
    spawn_facing_global: tmp.spawn_facing_global!,
    inc_spawn_point_index: tmp.inc_spawn_point_index!,
    hold_selected_point_key: tmp.hold_selected_point_key!,
    check_by_view_port: tmp.check_by_view_port!,
    do_not_spawn: tmp.do_not_spawn!,
    auto_buddy: tmp.auto_buddy!,
    time_of_day: tmp.time_of_day!,
    disable_renderer: tmp.disable_renderer!,
  };
};

const patchIniSyntax = (content: string, resourceName: string): string => {
  switch (resourceName) {
    case 'ar0203.ini': return content.replace('[repetitive', '[repetitive]');
    case 'ar1600.ini': return content.replaceAll('[3898,1705:8]', '[3898.1705:8]');

    default: return content;
  }
};

const readIniFile = async (filePath: string, resourceName: string): Promise<Ini> => {
  const tmp: PartialWriteable<Ini> = {};
  tmp.groupSections = [];
  tmp.creatureSections = [];

  const buffer = await readFile(filePath);

  const helloDevs = patchIniSyntax(buffer.toString(), resourceName);

  const ini = parseIniFromString(helloDevs);

  for (const section of ini.sections) {
    if (section.name === 'nameless') {
      tmp.nameless = parseNamelessSection(section);
      continue;
    }

    if (section.name === 'namelessvar') {
      tmp.namelessvar = parseNamelessvarSection(section);
      continue;
    }

    if (section.name === 'locals') {
      tmp.locals = parseLocalsSection(section);
      continue;
    }

    if (section.name === 'spawn_main') {
      tmp.spawnMain = parseSpawnMainSection(section);
      continue;
    }

    const isGroupSection = !!section.entries.find(x => x.key === 'critters');
    if (isGroupSection) {
      const groupSection = parseGroupSection(section);
      if (groupSection) tmp.groupSections.push(groupSection);
      continue;
    }

    const isCreatureSection = !!section.entries.find(x => x.key === 'spec');
    if (isCreatureSection) {
      const creatureSection = parseCreatureSection(section);
      if (creatureSection) tmp.creatureSections.push(creatureSection);
    }
  }

  return {
    resourceName,
    nameless: tmp.nameless,
    namelessvar: tmp.namelessvar,
    locals: tmp.locals,
    spawnMain: tmp.spawnMain,
    groupSections: tmp.groupSections,
    creatureSections: tmp.creatureSections,
  };
};

const convertIni = (
  pathes: Pathes,
  decompiledItems: DecompiledItem[],
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): AsyncIterableIterator<Ini> => {
  let i = 0;

  const iterator: AsyncIterableIterator<Ini> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<Ini>> {
      if (i >= decompiledItems.length) {
        return { done: true, value: undefined };
      }

      const decompiledItem = decompiledItems[i]!;
      const item = await readIniFile(
        join(pathes.output.decimpiledBiff.root, decompiledItem.name),
        decompiledItem.name,
      );

      const percent = Math.round((i + 1) * 100 / decompiledItems.length);
      percentCallback?.(percent, item.resourceName);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default convertIni;
