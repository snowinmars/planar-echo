import { snapshotWorld } from '@planar/kernel';
import { nothing } from '@planar/shared';

import { createServerHost } from './mods/createServerHost.js';
import { send } from './shared/send.js';

import type { World } from '@planar/kernel';
import type {
  ActiveJsonMods,
  ModBag,
  Patch,
} from '@planar/shared';

import type { Ipc } from './createSession.types.js';
import type { HostSession } from './mods/createServerHost.js';

const makeIpc = (session: HostSession): Ipc => {
  let seq = 0;
  const nextSeq = (): number => {
    seq += 1;
    return seq;
  };

  return {
    nextSeq,
    emitTick: (): void => {
      send({
        type: 'tick',
        seq: nextSeq(),
        tick: session.world.meta.tick,
      });
    },
    emitPatches: (patches: Patch[]): void => {
      if (patches.length === 0) return;
      send({
        type: 'patches',
        seq: nextSeq(),
        tick: session.world.meta.tick,
        patches,
      });
    },
    emitSnapshot: (): void => {
      const snapshotSeq = nextSeq();
      const snapshot = snapshotWorld(session.world, snapshotSeq);
      send({
        type: 'snapshot',
        seq: snapshotSeq,
        snapshot: {
          ...snapshot,
          mods: Object.fromEntries(session.published),
        },
      });
    },
    flushPending: (): Patch[] => session.pending.splice(0, session.pending.length),
  };
};

const createSession = (ghostDir: string, world: World, active: ActiveJsonMods): HostSession => {
  const session = {
    ghostDir,
    world,
    areCache: nothing(),
    bags: new Map<string, ModBag>(),
    published: new Map<string, unknown>(),
    emitQueue: [] as HostSession['emitQueue'],
    pending: [] as HostSession['pending'],
    active,
    mods: [] as HostSession['mods'],
    blocked: false,
    querying: false,
  } as unknown as HostSession;
  session.host = createServerHost(session);
  return session;
};

type CreateIpcSessionResponse = Readonly<{
  session: HostSession;
  ipc: Ipc;
}>;
export const createIpcSession = (ghostDir: string, world: World, active: ActiveJsonMods): CreateIpcSessionResponse => {
  const session = createSession(ghostDir, world, active);
  const ipc = makeIpc(session);

  return { session, ipc };
};
