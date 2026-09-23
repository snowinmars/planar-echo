import type { Maybe } from '../maybe.js';
import type { Envelope, EnvelopePatch } from './envelope.js';
import type { EntityId, InputCommand } from './protocol.js';

/**
 * Kernel-Daemon models.
 */
export type WorldEffect
  = | Readonly<{ type: 'spawn'; row: Omit<Envelope, 'id'> }>
    | Readonly<{ type: 'despawn'; id: EntityId }>
    | Readonly<{ type: 'entityPatch'; id: EntityId; patch: EnvelopePatch }>
    | Readonly<{ type: 'publish'; row: unknown }>
    | Readonly<{ type: 'loadArea'; are: string; entrance?: Maybe<string> }>
    | Readonly<{ type: 'enqueueCommand'; command: InputCommand }>;

export type HookEffects = Readonly<{
  effects: WorldEffect[];
}>;

export type ConsumableHookEffects = HookEffects & Readonly<{
  consumed: boolean;
}>;
