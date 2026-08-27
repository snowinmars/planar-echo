import type { GhostAreDoor, Maybe } from '@planar/shared';

export type EntityId = number;
export type SeatId = number;

export const UNPASSABLE_WALK = 0;
export const PASSABLE_WALK = 1;

export const TICK_HZ = 30;

export const DEFAULT_ARE = 'ar0202.are';

export const PST_OPERATING_DISTANCE = 120;

export const DEFAULT_SPEED_PX_PER_TICK = 16;

export type Point = Readonly<{
  x: number;
  y: number;
}>;

export type WalkGrid = Readonly<{
  cellWidth: number;
  cellHeight: number;
  colsCount: number;
  rowsCount: number;
  grid: Uint8Array;
}>;

export type DoorView = Readonly<{
  id: string;
  open: boolean;
}>;

export type Body = Readonly<{
  pos: Point;
  speedPxPerTick: number;
  dest?: Maybe<Point>;
  path: Point[];
  pendingDoorId?: Maybe<string>;
}>;

export type Actor = Readonly<{
  exists: true;
}>;

export type MetaPatchRow = Readonly<{
  tickHz: typeof TICK_HZ;
  paused: boolean;
  nextId: number;
  areId: string;
}>;

export type Meta = MetaPatchRow & Readonly<{
  tick: number;
}>;

export type World = {
  meta: Meta;
  walkBase: Uint8Array;
  walkGrid: WalkGrid;
  doors: Map<string, GhostAreDoor>;
  doorOpen: Map<string, boolean>;
  bodies: Map<EntityId, Body>;
  actors: Map<EntityId, Actor>;
};

export type TickCommand = Readonly<{
  type: 'clock/tick';
}>;

export type InputCommand
  = | Readonly<{ type: 'actor/move'; seatId: SeatId; actorId: EntityId; dest: Point }>
    | Readonly<{ type: 'pointer/click'; seatId: SeatId; x: number; y: number }>
    | Readonly<{ type: 'session/pause'; seatId: SeatId; paused: boolean }>
    | Readonly<{ type: 'session/loadArea'; seatId: SeatId; are: string; entrance?: Maybe<string> }>;

export type AppliableCommand = InputCommand | TickCommand;

export type Patch
  = | Readonly<{ table: 'bodies'; id: EntityId; op: 'upsert'; row: Body }>
    | Readonly<{ table: 'meta'; op: 'upsert'; row: MetaPatchRow }>
    | Readonly<{ table: 'actors'; id: EntityId; op: 'upsert'; row: Actor }>
    | Readonly<{ table: 'doors'; id: string; op: 'upsert'; row: DoorView }>
    | Readonly<{ op: 'command/rejected'; seq?: Maybe<number>; reason: string }>;

export type Snapshot = Readonly<{
  tick: number;
  seq: number;
  tickHz: typeof TICK_HZ;
  paused: boolean;
  nextId: number;
  areId: string;
  doors: DoorView[]; // TODO [snow]: to map
  bodies: [EntityId, Body][];// TODO [snow]: to map
  actors: [EntityId, Actor][];// TODO [snow]: to map
}>;

export type ToDaemon
  = | Readonly<{ type: 'command'; seq: number; command: InputCommand }>
    | Readonly<{ type: 'sync' }>
    | Readonly<{
      type: 'start';
      data: Readonly<{
        ghostDir: string;
        are?: Maybe<string>;
        entrance?: Maybe<string>;
      }>;
    }>;

export type FromDaemon
  = | Readonly<{ type: 'hello'; tickHz: typeof TICK_HZ }>
    | Readonly<{ type: 'snapshot'; seq: number; snapshot: Snapshot }>
    | Readonly<{ type: 'patches'; seq: number; tick: number; patches: readonly Patch[] }>
    | Readonly<{ type: 'tick'; seq: number; tick: number }>
    | Readonly<{ type: 'error'; message: string }>;

export type ApplyResult = Readonly<{
  events: Patch[];
}>;
