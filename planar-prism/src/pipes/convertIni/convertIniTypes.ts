import type { Maybe } from '../../shared/types.js';

export type NamelessIniSection = Readonly<{
  destare: string;
  point: [number, number];
  state: number;
  partyPoint: Maybe<[number, number]>;
  partyArea: Maybe<string>;
}>;

export type SpawnMainIniSection = Readonly<{
  enter: Maybe<string>;
  exit: Maybe<string>;
  events: Maybe<string>;
}>;

export type GroupIniSection = Readonly<{
  name: string;
  critters: string[];
  interval: Maybe<number>;
  detail_level: Maybe<string>;
  control_var: Maybe<string>;
  spawn_time_of_day: Maybe<string>;
}>;

export type CreatureIniSpec = Readonly<{
  ea: number;
  faction: number;
  team: number;
  general: number;
  race: number;
  class: number;
  specific: number;
  gender: number;
  align: number;
}>;
export type Direction
  = | '0=south'
    | '1'
    | '2=south-west'
    | '3'
    | '4=west'
    | '5'
    | '6=north-west'
    | '7'
    | '8=north'
    | '9'
    | '10=north-east'
    | '11'
    | '12=east'
    | '13'
    | '14=south-east'
    | '15'
;
export type CreatureIniSpecArea = Readonly<{
  centerX: Maybe<number>;
  centerY: Maybe<number>;
  range: Maybe<number>;
  other: Maybe<string>;
}>;
export type CreatureIniSpawnPoint = Readonly<{
  x: number;
  y: number;
  direction: Direction;
}>;
export type CreatureIniScopedVariable = Readonly<{
  scope: string;
  variableName: string;
}>;
export type CreatureIniSpecVarOperation = | 'greater_than' | 'less_than' | 'equal_to' | 'not_equal_to';
export type CreatureIniPointSelect = | 'e=POINT_SELECT_EXPLICIT' | 'i=POINT_SELECT_INDEXED_SEQUENTIAL' | 'r=POINT_SELECT_RANDOM_SEQUENTIAL' | 's=POINT_SELECT_SEQUENTIAL';
export type CreatureIniSection = Readonly<{
  name: string;
  spec_var: CreatureIniScopedVariable;
  spec: string | CreatureIniSpec;
  spec_area: CreatureIniSpecArea;
  spec_qty: number;
  spec_var_inc: number;
  spec_var_value: number;
  spec_var_operation: CreatureIniSpecVarOperation;
  area_diff_1: boolean;
  area_diff_2: boolean;
  area_diff_3: boolean;
  cre_file: string;
  create_qty: number;
  script_name: string;
  ai_ea: number;
  ai_general: number;
  ai_race: number;
  ai_class: number;
  ai_gender: number;
  ai_specifics: number;
  ai_alignment: number;
  ai_faction: number;
  ai_team: number;
  script_override: string;
  script_class: string;
  script_race: string;
  script_general: string;
  script_default: string;
  script_area: string;
  script_specifics: string;
  script_special_1: string;
  script_team: string;
  script_special_2: string;
  script_combat: string;
  script_special_3: string;
  script_movement: string;
  dialog: string;
  good_mod: number;
  law_mod: number;
  lady_mod: number;
  murder_mod: number;
  death_scriptname: boolean;
  death_faction: boolean;
  death_team: boolean;
  spawn_point: CreatureIniSpawnPoint[];
  point_select: CreatureIniPointSelect;
  point_select_var: CreatureIniScopedVariable;
  facing: Direction;
  ignore_can_see: boolean;
  check_crowd: boolean;
  find_safest_point: boolean;
  save_selected_point: CreatureIniScopedVariable;
  save_selected_facing: CreatureIniScopedVariable;
  spawn_point_global: CreatureIniScopedVariable;
  spawn_facing_global: CreatureIniScopedVariable;
  inc_spawn_point_index: boolean;
  hold_selected_point_key: boolean;
  check_by_view_port: boolean;
  do_not_spawn: boolean;
  auto_buddy: boolean;
  time_of_day: string;
  disable_renderer: boolean;
}>;

export type Ini = Readonly<{
  resourceName: string;
  nameless: Maybe<NamelessIniSection>;
  namelessvar: Maybe<Map<string, number>>;
  locals: Maybe<Map<string, string>>;
  spawnMain: Maybe<SpawnMainIniSection>;
  groupSections: GroupIniSection[];
  creatureSections: CreatureIniSection[];
}>;
