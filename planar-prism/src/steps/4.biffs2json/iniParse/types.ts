import type { Maybe } from '../../../shared/maybe.js';

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
    | '1=south-south-west'
    | '2=south-west'
    | '3=south-west-west'
    | '4=west'
    | '5=north-west-west'
    | '6=north-west'
    | '7=north-north-west'
    | '8=north'
    | '9=north-north-east'
    | '10=north-east'
    | '11=north-east-east'
    | '12=east'
    | '13=south-east-east'
    | '14=south-east'
    | '15=south-south-east'
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
  specVar: CreatureIniScopedVariable;
  spec: string | CreatureIniSpec;
  specArea: CreatureIniSpecArea;
  specQty: number;
  specVarInc: number;
  specVarValue: number;
  specVarOperation: CreatureIniSpecVarOperation;
  areaDiff1: boolean;
  areaDiff2: boolean;
  areaDiff3: boolean;
  creFile: string;
  createQty: number;
  scriptName: string;
  aiEa: number;
  aiGeneral: number;
  aiRace: number;
  aiClass: number;
  aiGender: number;
  aiSpecifics: number;
  aiAlignment: number;
  aiFaction: number;
  aiTeam: number;
  scriptOverride: string;
  scriptClass: string;
  scriptRace: string;
  scriptGeneral: string;
  scriptDefault: string;
  scriptArea: string;
  scriptSpecifics: string;
  scriptSpecial1: string;
  scriptTeam: string;
  scriptSpecial2: string;
  scriptCombat: string;
  scriptSpecial3: string;
  scriptMovement: string;
  dialog: string;
  goodMod: number;
  lawMod: number;
  ladyMod: number;
  murderMod: number;
  deathScriptname: boolean;
  deathFaction: boolean;
  deathTeam: boolean;
  spawnPoint: CreatureIniSpawnPoint[];
  pointSelect: CreatureIniPointSelect;
  pointSelectVar: CreatureIniScopedVariable;
  facing: Direction;
  ignoreCanSee: boolean;
  checkCrowd: boolean;
  findSafestPoint: boolean;
  saveSelectedPoint: CreatureIniScopedVariable;
  saveSelectedFacing: CreatureIniScopedVariable;
  spawnPointGlobal: CreatureIniScopedVariable;
  spawnFacingGlobal: CreatureIniScopedVariable;
  incSpawnPointIndex: boolean;
  holdSelectedPointKey: boolean;
  checkByViewPort: boolean;
  doNotSpawn: boolean;
  autoBuddy: boolean;
  timeOfDay: string;
  disableRenderer: boolean;
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
