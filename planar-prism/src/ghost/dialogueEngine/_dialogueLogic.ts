import type { Maybe } from './_types.js';
import type {
  AlignmentId,
  ClassId,
  DoorId,
  EnvId,
  ItemId,
  JournalId,
  LocationId,
  WhoId,
  SceneId,
  SoundId,
  StatId,
  VariableId,
  ScriptId,
  MovieId,
  TimeMeasure,
  SpellId,
  SlotId,
  TriggerId,
} from './enums.js';

export type DialogueLogic = Readonly<{
  getValue: (args: Readonly<{ variable: VariableId; env?: Maybe<EnvId> }>) => number;
  setValue: (args: Readonly<{ variable: VariableId; env?: Maybe<EnvId>; amount: number }>) => number;
  increment: (args: Readonly<{ variable: VariableId; env?: Maybe<EnvId>; key?: Maybe<VariableId>; amount: number }>) => number;
  setJournal: (journalId: JournalId) => void;
  isNpcInParty: (whoId: WhoId) => boolean;
  isNearbyDialog: (whoId: WhoId) => boolean;
  changeMorale: (args: Readonly<{ whoId: WhoId; amount: number }>) => void;
  isNpcDead: (whoId: WhoId) => boolean;
  createItem: (args: Readonly<{ itemId: ItemId; whoId?: Maybe<WhoId>; amount: number; identified: boolean; slot: number }>) => void;
  giveItem: (args: Readonly<{ itemId: ItemId; whoId: WhoId }>) => void;
  takeItem: (args: Readonly<{ itemId: ItemId; whoId: WhoId }>) => void;
  takePartyItems: (args: Readonly<{ itemId: ItemId; amount: number }>) => void;
  hasItem: (args: Readonly<{ itemId: ItemId; whoId: WhoId }>) => boolean;
  destroyItem: (args: Readonly<{ itemId: ItemId; whoId: WhoId; all?: Maybe<boolean> }>) => void;
  getNpcStat: (args: Readonly<{ whoId: WhoId; stat: StatId }>) => number;
  changeNpcStat: (args: Readonly<{ whoId: WhoId; stat: StatId; amount: number }>) => number;
  setNpcStat: (args: Readonly<{ whoId: WhoId; stat: StatId; amount: number }>) => number;
  attack: (args: Readonly<{ targetId: WhoId; whoId?: Maybe<WhoId>; force?: Maybe<boolean> }>) => void;
  startCutScene: (args: Readonly<{ scene: SceneId; checkConditions?: Maybe<boolean> }>) => void;
  fullHeal: (whoId: WhoId) => void;
  addExp: (args: Readonly<{ amount: number; whoId: WhoId }>) => void;
  changeGold: (args: Readonly<{ amount: number; operation: 'take' | 'destroy' | 'give'; force?: Maybe<boolean> }>) => number;
  getGold: () => number;
  playSound: (args: Readonly<{ sound: SoundId; notRanged?: Maybe<boolean> }>) => void;
  enemy: () => void;
  getTimesTalkedToNpc: () => number;
  setTimesTalkedToNpc: (amount: number) => number;
  exists: (whoId: WhoId) => boolean;
  transformItem: (args: Readonly<{ fromItemId: ItemId; toItemId: ItemId; targetId: WhoId; charge1?: Maybe<number>; charge2?: Maybe<number>; charge3?: Maybe<number> }>) => void;
  getAlignment: (whoId: WhoId) => AlignmentId;
  generateModronMaze: () => void;
  countPartyMembers: () => number;
  setPortalCursor: (args: Readonly<{ location: LocationId; portal: string; reset: boolean }>) => void;
  trade: (args: Readonly<{ shop: WhoId; customer: WhoId }>) => void;
  getClass: (whoId: WhoId) => ClassId;
  setNamelessClass: (clas: ClassId) => void;
  setAnimation: (args: Readonly<{ whoId: WhoId; animation: string }>) => void;
  showFloatingRebusAbove: (whoId: WhoId) => void;
  destroySelf: () => void;
  deactivate: (whoId: WhoId) => void;
  fadeColor: (args: Readonly<{ operation: 'to' | 'from'; x: number; y: number; unknown: number }>) => void;
  wait: (seconds: number) => void;
  kill: (whoId: WhoId) => void;
  help: () => void;
  playAnimation: (args: Readonly<{ animation: string; x: number; y: number; blendingMode: number }>) => void;
  rest: (args: Readonly<{ gold: number; hpBonus: number; disableMoving: boolean }>) => void;
  teleportParty: (args: Readonly<{ location: LocationId; x: number; y: number; face: number }>) => void;
  changeScript: (args: Readonly<{ whoId: WhoId; script: ScriptId; level: string }>) => void;
  disableScript: (args: Readonly<{ whoId: WhoId; level: string }>) => void;
  joinParty: (args: Readonly<{ again?: Maybe<boolean>; joinGroup?: Maybe<boolean> }>) => void;
  turnKeyInDoor: (args: Readonly<{ door: DoorId; isLocked: boolean }>) => void;
  openDoor: (door: DoorId) => void;
  getLastNpcTalkedTo: () => WhoId;
  leaveParty: () => void;
  startCutsceneMode: () => void;
  startMovie: (movieId: MovieId) => void;
  runAway: (args: Readonly<{ whoId: WhoId; time: number; timeMeasure: TimeMeasure; noAttack: boolean }>) => void;
  clearActions: (whoId: WhoId) => void;
  roll: (max: number) => number;
  applySpell: (args: Readonly<{ whoId: WhoId; spellId: SpellId }>) => void;
  damageBy: (args: Readonly<{ whoId: WhoId; amount: number }>) => void;
  damageTo: (args: Readonly<{ whoId: WhoId; amount: number }>) => void;
  getHp: (whoId: WhoId) => number;
  changeWeaponProficiency: (args: Readonly<{ whoId: WhoId; slotId: SlotId; amount: number }>) => void;
  changeExtraProficiency: (args: Readonly<{ whoId: WhoId; amount: number }>) => void;
  escapeArea: () => void;
  createCreatureNearTo: (args: Readonly<{ creatureWhoId: WhoId; nearToWhoId: WhoId }>) => void;
  creatureInLocation: (args: Readonly<{ creatureWhoId: WhoId; location: LocationId }>) => boolean;
  changeTrigger: (args: Readonly<{ triggerId: TriggerId; active: boolean }>) => void;
}>;

export const createDialogueLogic = (): DialogueLogic => ({
  getValue: ({ variable, env }: Readonly<{ variable: VariableId; env?: Maybe<EnvId> }>): number => {
    return 0;
  },
  setValue: ({ variable, env, amount }: Readonly<{ variable: VariableId; env?: Maybe<EnvId>; amount: number }>): number => {
    return 0;
  },
  increment: ({ variable, env, key, amount }: Readonly<{ variable: VariableId; env?: Maybe<EnvId>; key?: Maybe<VariableId>; amount: number }>): number => {
    return 0;
  },
  setJournal: (journalId: JournalId): void => {

  },
  isNpcInParty: (whoId: WhoId): boolean => {
    return false;
  },
  isNearbyDialog: (whoId: WhoId): boolean => {
    return false;
  },
  changeMorale: ({ whoId, amount }: Readonly<{ whoId: WhoId; amount: number }>): void => {
    return;
  },
  isNpcDead: (whoId: WhoId): boolean => {
    return false;
  },
  createItem: ({ itemId, whoId, amount, identified, slot }: Readonly<{ itemId: ItemId; whoId?: Maybe<WhoId>; amount: number; identified: boolean; slot: number }>): void => {
    return;
  },
  giveItem: ({ itemId, whoId }: Readonly<{ itemId: ItemId; whoId: WhoId }>): void => {
    return;
  },
  takeItem: ({ itemId, whoId }: Readonly<{ itemId: ItemId; whoId: WhoId }>): void => {
    return;
  },
  takePartyItems: ({ itemId, amount }: Readonly<{ itemId: ItemId; amount: number }>): void => {
    return;
  },
  hasItem: ({ itemId, whoId }: Readonly<{ itemId: ItemId; whoId: WhoId }>): boolean => {
    return false;
  },
  destroyItem: ({ itemId, all }: Readonly<{ itemId: ItemId; all?: Maybe<boolean> }>): void => {
    return;
  },
  getNpcStat: ({ whoId, stat }: Readonly<{ whoId: WhoId; stat: StatId }>): number => {
    return 0;
  },
  changeNpcStat: ({ whoId, stat, amount }: Readonly<{ whoId: WhoId; stat: StatId; amount: number }>): number => {
    return 0;
  },
  setNpcStat: ({ whoId, stat, amount }: Readonly<{ whoId: WhoId; stat: StatId; amount: number }>): number => {
    return 0;
  },
  attack: ({ targetId, whoId, force }: Readonly<{ targetId: WhoId; whoId?: Maybe<WhoId>; force?: Maybe<boolean> }>): void => {
    return;
  },
  startCutScene: ({ scene, checkConditions }: Readonly<{ scene: SceneId; checkConditions?: Maybe<boolean> }>): void => {
    return;
  },
  fullHeal: (whoId: WhoId): void => {
    return;
  },
  addExp: ({ amount, whoId }: Readonly<{ amount: number; whoId: WhoId }>): void => {
    return;
  },
  changeGold: ({ amount, operation, force }: Readonly<{ amount: number; operation: 'take' | 'destroy' | 'give'; force?: Maybe<boolean> }>): number => {
    return 0;
  },
  getGold: (): number => {
    return 0;
  },
  playSound: ({ sound, notRanged }: Readonly<{ sound: SoundId; notRanged?: Maybe<boolean> }>): void => {
    return;
  },
  enemy: (): void => {
    return;
  },
  getTimesTalkedToNpc: (): number => {
    return 0;
  },
  setTimesTalkedToNpc: (amount: number): number => {
    return 0;
  },
  exists: (whoId: WhoId): boolean => {
    return false;
  },
  transformItem: ({ fromItemId, toItemId, targetId, charge1, charge2, charge3 }: Readonly<{ fromItemId: ItemId; toItemId: ItemId; targetId: WhoId; charge1?: Maybe<number>; charge2?: Maybe<number>; charge3?: Maybe<number> }>): void => {
    return;
  },
  getAlignment: (whoId: WhoId): AlignmentId => {
    return '';
  },
  generateModronMaze: () => {
    return;
  },
  countPartyMembers: (): number => {
    return 0;
  },
  setPortalCursor: ({ location, portal, reset }: Readonly<{ location: LocationId; portal: string; reset: boolean }>): void => {
    return;
  },
  trade: ({ shop, customer }: Readonly<{ shop: WhoId; customer: WhoId }>): void => {
    return;
  },
  getClass: (whoId: WhoId): ClassId => {
    return '';
  },
  setNamelessClass: (clas: ClassId): void => {
    return;
  },
  setAnimation: ({ whoId, animation }: Readonly<{ whoId: WhoId; animation: string }>): void => {

  },
  showFloatingRebusAbove: (whoId: WhoId): void => {
    return;
  },
  destroySelf: (): void => {
    return;
  },
  deactivate: (whoId: WhoId): void => {
    return;
  },
  fadeColor: ({ operation, x, y, unknown }: Readonly<{ operation: 'to' | 'from'; x: number; y: number; unknown: number }>): void => {
    return;
  },
  wait: (seconds: number): void => {
    return;
  },
  kill: (whoId: WhoId): void => {
    return;
  },
  help: (): void => {
    return;
  },
  playAnimation: ({ animation, x, y, blendingMode }: Readonly<{ animation: string; x: number; y: number; blendingMode: number }>): void => {
    return;
  },
  rest: ({ gold, hpBonus, disableMoving }: Readonly<{ gold: number; hpBonus: number; disableMoving: boolean }>): void => {
    return;
  },
  teleportParty: ({ location, x, y, face }: Readonly<{ location: LocationId; x: number; y: number; face: number }>): void => {
    return;
  },
  changeScript: ({ whoId, script, level }: Readonly<{ whoId: WhoId; script: ScriptId; level: string }>): void => {

  },
  disableScript: ({ whoId, level }: Readonly<{ whoId: WhoId; level: string }>): void => {
    return;
  },
  joinParty: (args: Readonly<{ again?: Maybe<boolean>; joinGroup?: Maybe<boolean> }>): void => {
    return;
  },
  turnKeyInDoor: ({ door, isLocked }: Readonly<{ door: DoorId; isLocked: boolean }>): void => {
    return;
  },
  openDoor: (door: DoorId): void => {
    return;
  },
  getLastNpcTalkedTo: (): WhoId => {
    return '';
  },
  leaveParty: (): void => {
    return;
  },
  startCutsceneMode: (): void => {
    return;
  },
  startMovie: (movieId: MovieId): void => {
    return;
  },
  runAway: ({ whoId, time, timeMeasure, noAttack }: Readonly<{ whoId: WhoId; time: number; timeMeasure: TimeMeasure; noAttack: boolean }>): void => {
    return;
  },
  clearActions: (whoId: WhoId): void => {

  },
  roll: (max: number): number => {
    return 0;
  },
  applySpell: ({ whoId, spellId }: Readonly<{ whoId: WhoId; spellId: SpellId }>): void => {
    return;
  },
  damageBy: ({ whoId, amount }: Readonly<{ whoId: WhoId; amount: number }>): void => {
    return;
  },
  damageTo: ({ whoId, amount }: Readonly<{ whoId: WhoId; amount: number }>): void => {
    return;
  },
  getHp: (whoId: WhoId): number => {
    return 0;
  },
  changeWeaponProficiency: ({ whoId, slotId, amount }: Readonly<{ whoId: WhoId; slotId: SlotId; amount: number }>): void => {
    return;
  },
  changeExtraProficiency: ({ whoId, amount }: Readonly<{ whoId: WhoId; amount: number }>): void => {
    return;
  },
  escapeArea: (): void => {
    return;
  },
  createCreatureNearTo: ({ creatureWhoId, nearToWhoId }: Readonly<{ creatureWhoId: WhoId; nearToWhoId: WhoId }>): void => {
    return;
  },
  creatureInLocation: ({ creatureWhoId, location }: Readonly<{ creatureWhoId: WhoId; location: LocationId }>): boolean => {
    return false;
  },
  changeTrigger: ({ triggerId, active }: Readonly<{ triggerId: TriggerId; active: boolean }>): void => {
    return;
  },
});
