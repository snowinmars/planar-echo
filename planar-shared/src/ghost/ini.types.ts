import type { Direction } from '../direction.js';
import type { Maybe } from '../maybe.js';
import type { GhostIniAnimationSlotKey } from './iniKind.js';

export type FacingCycle = 'five' | 'nine';

export type GhostIniNamelessSection = Readonly<{
  destare: string;
  point: [number, number];
  state: number;
  partyPoint?: Maybe<[number, number]>;
  partyArea?: Maybe<string>;
}>;

export type GhostIniSpawnMainSection = Readonly<{
  enter?: Maybe<string>;
  exit?: Maybe<string>;
  events?: Maybe<string>;
}>;

export type GhostIniGeneralSection = Readonly<{
  animationType: string;
  moveScale: number;
  ellipse: number;
  colorBlood: number;
  colorChunks: number;
  soundFreq: number;
  personalSpace: number;
  castFrame: number;
}>;

export type GhostIniAnimationSlot = Readonly<{
  bam: string;
  facingCycle: FacingCycle;
}>;

export type GhostIniMonsterPlanescapeSection = Readonly<
  { [K in GhostIniAnimationSlotKey]?: Maybe<GhostIniAnimationSlot> } & {
    runscale?: Maybe<number>;
    bestiary?: Maybe<number>;
    armor?: Maybe<number>;
  }
>;

export type GhostIniSoundsSection = Readonly<{
  hitSounds: string[];
  hitframe?: Maybe<number>;
  dfbSounds: string[];
  dfbframe?: Maybe<number>;
  at1Sounds: string[];
  at1frame?: Maybe<number>;
  at2Sounds: string[];
  at2frame?: Maybe<number>;
  cf1Sounds: string[];
  cf1frame?: Maybe<number>;
}>;

export type GhostIniNumberedSection = Readonly<{
  name: string;
  hitSounds: string[];
  hitframe?: Maybe<number>;
  dfbSounds: string[];
  dfbframe?: Maybe<number>;
  at1Sounds: string[];
  at1frame?: Maybe<number>;
  at2Sounds: string[];
  at2frame?: Maybe<number>;
  cf1Sounds: string[];
  cf1frame?: Maybe<number>;
  attack1?: Maybe<string>;
  attack2?: Maybe<string>;
  stance2stand?: Maybe<string>;
  stancefidget1?: Maybe<string>;
  diebackward?: Maybe<string>;
  getup?: Maybe<string>;
  gethit?: Maybe<string>;
  run?: Maybe<string>;
  stand2stance?: Maybe<string>;
  standfidget1?: Maybe<string>;
  spell1?: Maybe<string>;
  spell2?: Maybe<string>;
  stance?: Maybe<string>;
  stand?: Maybe<string>;
  talk1?: Maybe<string>;
  walk?: Maybe<string>;
  walkscale?: Maybe<number>;
  runscale?: Maybe<number>;
  bestiary?: Maybe<number>;
  armor?: Maybe<number>;
}>;

export type GhostIniGroupSection = Readonly<{
  name: string;
  critters: string[];
  interval?: Maybe<number>;
  detailLevel?: Maybe<string>;
  controlVar?: Maybe<string>;
  spawnTimeOfDay?: Maybe<string>;
}>;

export type GhostIniCreaturePointSelect
  = | 'e=POINT_SELECT_EXPLICIT'
    | 'i=POINT_SELECT_INDEXED_SEQUENTIAL'
    | 'r=POINT_SELECT_RANDOM_SEQUENTIAL'
    | 's=POINT_SELECT_SEQUENTIAL';

export type GhostIniCreatureScopedVariable = Readonly<{
  scope: string;
  variableName: string;
}>;

export type GhostIniCreatureSpawnPoint = Readonly<{
  x: number;
  y: number;
  direction: Direction;
}>;

export type GhostIniCreatureSpecArea = Readonly<{
  centerX: Maybe<number>;
  centerY: Maybe<number>;
  range: Maybe<number>;
  other: Maybe<string>;
}>;

export type GhostIniCreatureSpec = Readonly<{
  ea?: Maybe<string>;
  faction?: Maybe<string>;
  team?: Maybe<string>;
  general?: Maybe<string>;
  race?: Maybe<string>;
  class?: Maybe<string>;
  specifics?: Maybe<string>;
  gender?: Maybe<string>;
  alignment?: Maybe<string>;
}>;

export type GhostIniCreatureSpecVarOperation
  = | 'greater_than'
    | 'less_than'
    | 'equal_to'
    | 'not_equal_to';

export type GhostIniCreatureSection = Readonly<{
  name: string;
  specVar?: Maybe<GhostIniCreatureScopedVariable>;
  spec: string | GhostIniCreatureSpec;
  specArea?: Maybe<GhostIniCreatureSpecArea>;
  specQty: number;
  specVarInc?: Maybe<number>;
  specVarValue?: Maybe<number>;
  specVarOperation?: Maybe<GhostIniCreatureSpecVarOperation>;
  areaDiff1?: Maybe<boolean>;
  areaDiff2?: Maybe<boolean>;
  areaDiff3?: Maybe<boolean>;
  creFile: string;
  createQty?: Maybe<number>;
  scriptName?: Maybe<string>;
  ai?: Maybe<GhostIniCreatureSpec>;
  scriptOverride?: Maybe<string>;
  scriptClass?: Maybe<string>;
  scriptRace?: Maybe<string>;
  scriptGeneral?: Maybe<string>;
  scriptDefault?: Maybe<string>;
  scriptArea?: Maybe<string>;
  scriptSpecifics?: Maybe<string>;
  scriptSpecial1?: Maybe<string>;
  scriptTeam?: Maybe<string>;
  scriptSpecial2?: Maybe<string>;
  scriptCombat?: Maybe<string>;
  scriptSpecial3?: Maybe<string>;
  scriptMovement?: Maybe<string>;
  dialog?: Maybe<string>;
  goodMod?: Maybe<number>;
  lawMod?: Maybe<number>;
  ladyMod?: Maybe<number>;
  murderMod?: Maybe<number>;
  deathScriptname?: Maybe<boolean>;
  deathFaction?: Maybe<boolean>;
  deathTeam?: Maybe<boolean>;
  spawnPoint: GhostIniCreatureSpawnPoint[];
  pointSelect?: Maybe<GhostIniCreaturePointSelect>;
  pointSelectVar?: Maybe<GhostIniCreatureScopedVariable>;
  facing?: Maybe<Direction>;
  ignoreCanSee?: Maybe<boolean>;
  checkCrowd?: Maybe<boolean>;
  findSafestPoint?: boolean;
  saveSelectedPoint?: Maybe<GhostIniCreatureScopedVariable>;
  saveSelectedFacing?: Maybe<GhostIniCreatureScopedVariable>;
  spawnPointGlobal?: Maybe<GhostIniCreatureScopedVariable>;
  spawnFacingGlobal?: Maybe<GhostIniCreatureScopedVariable>;
  incSpawnPointIndex?: Maybe<boolean>;
  holdSelectedPointKey?: Maybe<boolean>;
  checkByViewPort?: Maybe<boolean>;
  doNotSpawn?: Maybe<boolean>;
  autoBuddy?: Maybe<boolean>;
  timeOfDay?: Maybe<string>;
  disableRenderer?: Maybe<boolean>;
}>;

export type GhostIniResdata = Readonly<{
  resourceName: string;
  numberedSections: GhostIniNumberedSection[];
}>;

export type GhostIniAnimation = Readonly<{
  resourceName: string;
  general: GhostIniGeneralSection;
  monsterPlanescape: GhostIniMonsterPlanescapeSection;
  sounds?: Maybe<GhostIniSoundsSection>;
}>;

export type GhostIniArea = Readonly<{
  resourceName: string;
  nameless?: Maybe<GhostIniNamelessSection>;
  namelessvar?: Maybe<Map<string, number>>;
  locals?: Maybe<Map<string, string>>;
  spawnMain?: Maybe<GhostIniSpawnMainSection>;
  groupSections: GhostIniGroupSection[];
  creatureSections: GhostIniCreatureSection[];
}>;
