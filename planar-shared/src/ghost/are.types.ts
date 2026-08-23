import type { Direction } from '../direction.js';
import type { Point, Rectangle } from '../geometry.js';
import type { Maybe } from '../maybe.js';

export type GhostAreHeader = Readonly<{
  signature: 'area';
  version: 'v1.0';
  wed: string;
  lastSaved: number;
  flags: string[];
  northAreaRef?: Maybe<string>;
  northAreaFlags: string[];
  eastAreaRef?: Maybe<string>;
  eastAreaFlags: string[];
  southAreaRef?: Maybe<string>;
  southAreaFlags: string[];
  westAreaRef?: Maybe<string>;
  westAreaFlags: string[];
  areaType: string[];
  rainProbability: number;
  snowProbability: number;
  fogProbability: number;
  lightningProbability: number;
  overlayTransparency: number;
  areaScript: string;
  restMovieDay?: Maybe<string>;
  restMovieNight?: Maybe<string>;
}>;

export type GhostAreActor = Readonly<{
  name: string;
  at: Point;
  destX: number;
  destY: number;
  flags: string[];
  isSpawnedAsRandomMonster: boolean;
  creResrefLetter?: Maybe<string>;
  animation: string;
  direction: Direction;
  expiryTime: number;
  wanderDistance: number;
  followDistance: number;
  presentedAt: string[];
  numTimesTalkedTo: number;
  dialog?: Maybe<string>;
  scriptOverride?: Maybe<string>;
  scriptGeneral: string;
  scriptClass?: Maybe<string>;
  scriptRace?: Maybe<string>;
  scriptDefault?: Maybe<string>;
  scriptSpecifics?: Maybe<string>;
  cre: string;
}>;

export type GhostAreVertex = Readonly<{
  x: number;
  y: number;
}>;

export type GhostAreRegion = Readonly<{
  name: string;
  type: string;
  boundingBox: Rectangle;
  vertices: GhostAreVertex[];
  triggerValue: number;
  cursorIndex: number;
  destinationArea: string;
  entranceName: string;
  flags: string[];
  infoPointTextRef?: Maybe<number>;
  trapDetectionDifficulty: number;
  trapRemovalDifficulty: number;
  trapped: boolean;
  trapDetected: boolean;
  trapLaunchAt: Point;
  key?: Maybe<string>;
  script?: Maybe<string>;
  activation: Point;
  sound: string;
  speaker: Point;
  speakerNameRef: number;
  dialog: string;
}>;

export type GhostAreSpawnPoint = Readonly<{
  name: string;
  at: Point;
  creatures: string[];
  encounterDifficulty: number;
  spawnRate: number;
  method: string[];
  duration: number;
  wanderDistance: number;
  followDistance: number;
  maxCreatures: number;
  enabled: boolean;
  presentedAt: string[];
  probabilityDay: number;
  probabilityNight: number;
  frequency: number;
  countdown: number;
  weights: number[];
}>;

export type GhostAreEntrance = Readonly<{
  name: string;
  at: Point;
  direction: Direction;
}>;

export type GhostAreItem = Readonly<{
  resref: string;
  expiryTime: number;
  quantity1: number;
  quantity2: number;
  quantity3: number;
  flags: string[];
}>;

export type GhostAreContainer = Readonly<{
  name: string;
  at: Point;
  type: string;
  lockDifficulty: number;
  flags: string[];
  trapDetectionDifficulty: number;
  trapRemovalDifficulty: number;
  trapped: boolean;
  trapDetected: boolean;
  launch: Point;
  boundingBox: Rectangle;
  items: GhostAreItem[];
  trapScript?: Maybe<string>;
  vertices: GhostAreVertex[];
  triggerRange: number;
  owner?: Maybe<string>;
  key?: Maybe<string>;
  breakDifficulty: number;
  lockpickStringRef: number;
}>;

export type GhostAreAmbient = Readonly<{
  name: string;
  at: Point;
  radius: number;
  height: number;
  pitchVariation: number;
  volumeVariation: number;
  volume: number;
  sounds: string[];
  intervalBase: number;
  intervalVariation: number;
  presentedAt: string[];
  flags: string[];
}>;

export type GhostAreVariable = Readonly<{
  name: string;
  type: string;
  resourceType: number;
  dwordValue: number;
  intValue: number;
  doubleValue: number;
  scriptNameValue: string;
}>;

export type GhostAreDoorGeometry = Readonly<{
  boundingBox: Rectangle;
  vertices: GhostAreVertex[];
  impeded: GhostAreVertex[];
}>;

export type GhostAreDoor = Readonly<{
  name: string;
  doorId: string;
  flags: string[];
  openedGeometry: GhostAreDoorGeometry;
  closedGeometry: GhostAreDoorGeometry;
  hitPoints: number;
  armorClass: number;
  openSound?: Maybe<string>;
  closeSound?: Maybe<string>;
  cursorIndex: number;
  trapDetectionDifficulty: number;
  trapRemovalDifficulty: number;
  trapped: boolean;
  trapDetected: boolean;
  launch: Point;
  key?: Maybe<string>;
  script?: Maybe<string>;
  detectionDifficulty: number;
  lockDifficulty: number;
  openLocation: Point;
  closeLocation: Point;
  lockpickStringRef?: Maybe<number>;
  travelTriggerName?: Maybe<string>;
  speakerNameRef?: Maybe<number>;
  dialog?: Maybe<string>;
}>;

export type GhostAreAnimation = Readonly<{
  name: string;
  at: Point;
  presentedAt: string[];
  animationResref: string;
  bamSequenceNumber: number;
  bamFrameNumber: number;
  flags: string[];
  height: number;
  transparency: number;
  startFrame: number;
  loopProbability: number;
  skipCycles: number;
  palette: string;
  animationWidth: number;
  animationHeight: number;
}>;

export type GhostAreTiledObject = Readonly<{
  name: string;
  tileId: string;
  flags: string[];
  openImpeded: GhostAreVertex[];
  closedImpeded: GhostAreVertex[];
}>;

export type GhostAreAutomapNote = Readonly<{
  at: Point;
  textRef: number;
  strrefLocation: string;
  markerColor: string;
  controlId: number;
}>;

export type GhostAreProjectileTrap = Readonly<{
  projectile: string;
  missileId: number;
  ticksUntilCheck: number;
  triggersRemaining: number;
  x: number;
  y: number;
  z: number;
  enemyAlly: number;
  indexOfPartyMemberWhoCreatedIt: number;
}>;

export type GhostAreSong = Readonly<{
  daySong: string;
  nightSong: string;
  winSong: string;
  battleSong: string;
  loseSong: string;
  altMusic1: string;
  altMusic2: string;
  altMusic3: string;
  altMusic4: string;
  altMusic5: string;
  mainDayAmbient1: string;
  mainDayAmbient2: string;
  mainDayAmbientVolume: number;
  mainNightAmbient1: string;
  mainNightAmbient2: string;
  mainNightAmbientVolume: number;
  reverb: number;
}>;

export type GhostAreRestInterruptions = Readonly<{
  name: string;
  explanationRefs: number[];
  creatures: string[];
  difficulty: number;
  removalTime: number;
  wanderDistance: number;
  followDistance: number;
  maxCreatures: number;
  enabled: boolean;
  probabilityDay: number;
  probabilityNight: number;
}>;

export type GhostAre = Readonly<{
  resourceName: string;
  header: GhostAreHeader;
  actors: GhostAreActor[];
  regions: GhostAreRegion[];
  spawnPoints: GhostAreSpawnPoint[];
  entrances: GhostAreEntrance[];
  containers: GhostAreContainer[];
  ambients: GhostAreAmbient[];
  variables: GhostAreVariable[];
  exploredBitmaskName?: Maybe<string>;
  doors: GhostAreDoor[];
  animations: GhostAreAnimation[];
  automapNotes: GhostAreAutomapNote[];
  tiledObjects: GhostAreTiledObject[];
  projectileTraps: GhostAreProjectileTrap[];
  song?: Maybe<GhostAreSong>;
  restInterruptions?: Maybe<GhostAreRestInterruptions>;
}>;
