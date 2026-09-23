import type { Point } from '../geometry.js';
import type { Maybe } from '../maybe.js';
import type { TICK_HZ } from './constants.js';
import type { Envelope } from './envelope.js';

export type WalkGrid = Readonly<{
  cellWidth: number;
  cellHeight: number;
  colsCount: number;
  rowsCount: number;
  grid: Uint8Array;
}>;

/**
 * Live session values
 */
export type MetaPatchRow = Readonly<{
  tickHz: typeof TICK_HZ;
  paused: boolean;
  nextId: number;
  areId: string;
}>;

/**
 * MetaPatchRow + live session clock
 */
export type Meta = MetaPatchRow & Readonly<{
  tick: number;
}>;

/**
 * Client / enqueueCommand.
 */
export type InputCommand
  = | Readonly<{ type: 'actor/move'; seatId: SeatId; actorId: EntityId; dest: Point }>
    | Readonly<{ type: 'pointer/click'; seatId: SeatId; x: number; y: number; button: 'left' | 'right' }>
    | Readonly<{ type: 'session/pause'; seatId: SeatId; paused: boolean }>
    | Readonly<{ type: 'session/loadArea'; seatId: SeatId; are: string; entrance?: Maybe<string> }>;

/**
 * WebSocket delta. Same discriminator style as InputCommand.
 */
export type Patch
  = | Readonly<{ type: 'entity/upsert'; id: EntityId; row: Envelope }>
    | Readonly<{ type: 'entity/remove'; id: EntityId }>
    | Readonly<{ type: 'meta/upsert'; row: MetaPatchRow }>
    | Readonly<{ type: 'mod/upsert'; modId: string; row: unknown }>
    | Readonly<{ type: 'command/rejected'; seq?: Maybe<number>; reason: string }>;

/**
 * Minimalistic client view after hello/sync/loadArea.
 */
export type Snapshot = Readonly<{
  tick: number;
  seq: number;
  tickHz: typeof TICK_HZ;
  paused: boolean;
  nextId: number;
  areId: string;
  entities: Envelope[];
  mods: Readonly<Record<string, unknown>>;
}>;

export type ToDaemon
  = | Readonly<{ type: 'command'; seq: number; command: InputCommand }>
    | Readonly<{ type: 'sync' }>
    | Readonly<{
      type: 'start';
      data: Readonly<{
        ghostDir: string;
        modsDir: string;
        are?: Maybe<string>;
        entrance?: Maybe<string>;
      }>;
    }>;

export type FromDaemon
  = | Readonly<{ type: 'hello'; tickHz: typeof TICK_HZ }>
    | Readonly<{ type: 'snapshot'; seq: number; snapshot: Snapshot }>
    | Readonly<{ type: 'patches'; seq: number; tick: number; patches: Patch[] }>
    | Readonly<{ type: 'tick'; seq: number; tick: number }>
    | Readonly<{ type: 'error'; message: string }>;

export type EntityId = number;
export type SeatId = number;
