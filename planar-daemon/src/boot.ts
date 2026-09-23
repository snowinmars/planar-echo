import { DEFAULT_ARE, isNothing, nothing, TICK_HZ } from '@planar/shared';

import { createIpcSession } from './createSession.js';
import { initializeWorld } from './initializeWorld.js';
import { applyEffects } from './mods/applyEffects.js';
import { bagOf, rematerializeFloor, wipeStorage } from './mods/createServerHost.js';
import { bootServerMods } from './mods/failClosed.js';
import { importServerMod } from './mods/importServerMod.js';
import { send } from './shared/send.js';

import type {
  InputCommand,
  Maybe,
  ServerHookName,
  ToDaemon,
  WorldEffect,
} from '@planar/shared';

import type { Ipc } from './createSession.types.js';
import type { AreaLoad } from './mods/applyEffects.js';
import type { HostSession, LoadedServerMod } from './mods/createServerHost.js';

const ipcError = (err: unknown): void => {
  send({ type: 'error', message: err instanceof Error ? err.message : String(err) });
};

const hookOrder = (
  session: HostSession,
  hook: ServerHookName,
): LoadedServerMod[] => {
  const modIds = session.active.serverHooks[hook] ?? [];
  const modsById = new Map(session.mods.map(mod => [mod.manifest.id, mod]));
  const ordered: LoadedServerMod[] = [];

  for (const modId of modIds) {
    const disabled = !session.active.enabled[modId];
    if (disabled) continue;

    const mod = modsById.get(modId);
    if (!mod) continue;

    const serverMod = mod.manifest.sides.includes('server');
    if (!serverMod) continue;

    const hasHook = mod.manifest.hooks.includes(hook);
    if (!hasHook) continue;

    ordered.push(mod);
  }

  return ordered;
};

const isHookEffects = (value: unknown): value is { effects: WorldEffect[] } => (
  Boolean(value)
  && typeof value === 'object'
  && Array.isArray((value as { effects?: unknown }).effects)
);

const applyHookEffects = (
  session: HostSession,
  modId: string,
  result: unknown,
  hook: string,
): Maybe<AreaLoad> => {
  if (!isHookEffects(result)) {
    throw new Error(`mod '${modId}' ${hook} must return { effects: WorldEffect[] }`);
  }
  return applyEffects(session, modId, result.effects);
};

const runOnAreaUnload = async (session: HostSession): Promise<void> => {
  for (const mod of hookOrder(session, 'onAreaUnload')) {
    await mod.exports.onAreaUnload?.(session.host, { bag: bagOf(session, mod.manifest.id) });
  }
};

const runOnAreaLoad = async (session: HostSession): Promise<Maybe<AreaLoad>> => {
  for (const mod of hookOrder(session, 'onAreaLoad')) {
    const missing = !mod.exports.onAreaLoad;
    if (missing) continue;

    const result = await mod.exports.onAreaLoad(session.host, { bag: bagOf(session, mod.manifest.id) });
    const load = applyHookEffects(session, mod.manifest.id, result, 'onAreaLoad');
    if (!isNothing(load)) return load;
  }
  return nothing();
};

const runOnTick = (session: HostSession): Maybe<AreaLoad> => {
  for (const mod of hookOrder(session, 'onTick')) {
    const missing = !mod.exports.onTick;
    if (missing) continue;

    const result = mod.exports.onTick(session.host, { bag: bagOf(session, mod.manifest.id) });
    const load = applyHookEffects(session, mod.manifest.id, result, 'onTick');
    if (!isNothing(load)) return load;
  }
  return nothing();
};

const runOnCommandOnce = (session: HostSession, command: InputCommand): {
  consumed: boolean;
  rejected?: string;
  load: Maybe<AreaLoad>;
} => {
  const pausedClick = command.type === 'pointer/click' && session.world.meta.paused;
  if (pausedClick) {
    return { consumed: false, rejected: 'paused', load: nothing() };
  }

  const chain = hookOrder(session, 'onCommand');
  const movement = command.type === 'pointer/click' || command.type === 'actor/move';
  const emptyChain = chain.length === 0 && movement;
  if (emptyChain) {
    return { consumed: false, rejected: 'unhandled', load: nothing() };
  }

  let any = false;
  for (const mod of chain) {
    const missing = !mod.exports.onCommand;
    if (missing) continue;

    const result = mod.exports.onCommand(session.host, {
      bag: bagOf(session, mod.manifest.id),
      command,
    });
    const invalid = !result || typeof result.consumed !== 'boolean' || !Array.isArray(result.effects);
    if (invalid) {
      return {
        consumed: false,
        rejected: `mod '${mod.manifest.id}' onCommand must return { consumed: boolean, effects: WorldEffect[] }`,
        load: nothing(),
      };
    }
    any = true;
    const load = applyEffects(session, mod.manifest.id, result.effects);
    if (!isNothing(load)) return { consumed: result.consumed, load };
    if (result.consumed) return { consumed: true, load: nothing() };
  }

  const unhandled = !any && movement;
  if (unhandled) {
    return { consumed: false, rejected: 'unhandled', load: nothing() };
  }

  return { consumed: false, load: nothing() };
};

const drainEmitCommands = (session: HostSession, ipc: Ipc): Maybe<AreaLoad> => {
  let depth = 0;
  let hop: Maybe<AreaLoad> = nothing();
  while (session.emitQueue.length > 0 && depth < 8) {
    const next = session.emitQueue.shift();
    if (!next) break;
    const result = runOnCommandOnce(session, next);
    if (!isNothing(result.load)) {
      hop = result.load;
      break;
    }
    if (result.rejected) {
      ipc.emitPatches([{ type: 'command/rejected', reason: result.rejected }]);
    }
    depth += 1;
  }
  session.emitQueue.length = 0;
  return hop;
};

const replaceWorld = async (
  session: HostSession,
  ipc: Ipc,
  are: string,
  entrance: Maybe<string>,
): Promise<void> => {
  let nextAre = are;
  let nextEntrance = entrance;
  for (let hop = 0; hop < 8; hop += 1) {
    const world = await initializeWorld(session.ghostDir, nextAre, nextEntrance);
    await runOnAreaUnload(session);
    wipeStorage(session);
    session.world = world;
    session.pending.splice(0, session.pending.length);
    const fromLoad = await runOnAreaLoad(session);
    if (!isNothing(fromLoad)) {
      nextAre = fromLoad.are;
      nextEntrance = fromLoad.entrance;
      continue;
    }
    rematerializeFloor(session);
    ipc.emitSnapshot();
    return;
  }
  throw new Error('loadArea depth exceeded');
};

const blockWhile = (
  session: HostSession,
  work: () => Promise<void>,
  onError: (err: unknown) => void,
): void => {
  session.blocked = true;
  work()
    .catch(onError)
    .finally(() => {
      session.blocked = false;
    });
};

const scheduleReplace = (
  session: HostSession,
  ipc: Ipc,
  load: AreaLoad,
  onError: (err: unknown) => void,
): void => {
  blockWhile(
    session,
    () => replaceWorld(session, ipc, load.are, load.entrance),
    onError,
  );
};

const rejectCommand = (session: HostSession, ipc: Ipc, clientSeq: number, err: unknown): void => {
  ipc.emitPatches([{
    type: 'command/rejected',
    seq: clientSeq,
    reason: err instanceof Error ? err.message : String(err),
  }]);
};

const onCommand = (session: HostSession, ipc: Ipc, command: InputCommand, clientSeq: number): void => {
  if (session.blocked) return;

  if (command.type === 'session/loadArea') {
    blockWhile(
      session,
      () => replaceWorld(session, ipc, command.are, command.entrance),
      (err: unknown) => rejectCommand(session, ipc, clientSeq, err),
    );
    return;
  }

  if (command.type === 'session/pause') {
    session.world.meta = {
      ...session.world.meta,
      paused: command.paused,
    };
    ipc.emitPatches([{
      type: 'meta/upsert',
      row: {
        tickHz: session.world.meta.tickHz,
        paused: session.world.meta.paused,
        nextId: session.world.meta.nextId,
        areId: session.world.meta.areId,
      },
    }]);
    return;
  }

  const handled = runOnCommandOnce(session, command);
  if (!isNothing(handled.load)) {
    scheduleReplace(session, ipc, handled.load, ipcError);
    return;
  }

  const drained = drainEmitCommands(session, ipc);
  if (!isNothing(drained)) {
    scheduleReplace(session, ipc, drained, ipcError);
    return;
  }

  const extra = ipc.flushPending();
  if (handled.rejected) {
    ipc.emitPatches([{
      type: 'command/rejected',
      seq: clientSeq,
      reason: handled.rejected,
    }, ...extra]);
    return;
  }
  ipc.emitPatches(extra);
};

export const boot = async (
  ghostDir: string,
  modsDir: string,
  are: Maybe<string>,
  entrance: Maybe<string>,
): Promise<(msg: ToDaemon) => void> => {
  const { active, manifests } = await bootServerMods(modsDir);

  const world = await initializeWorld(ghostDir, are ?? DEFAULT_ARE, entrance);
  const { session, ipc } = createIpcSession(ghostDir, world, active);

  for (const [id, manifest] of manifests) {
    const enabledMod = active.enabled[id];
    if (!enabledMod) continue;

    const serverMod = manifest.sides.includes('server');
    if (!serverMod) continue;

    const exports = await importServerMod(modsDir, manifest);
    session.mods.push({
      manifest,
      exports,
    });
  }

  send({ type: 'hello', tickHz: TICK_HZ });

  const fromLoad = await runOnAreaLoad(session);
  if (!isNothing(fromLoad)) {
    await replaceWorld(session, ipc, fromLoad.are, fromLoad.entrance);
  }
  else {
    rematerializeFloor(session);
    ipc.emitSnapshot();
  }

  const clock = setInterval(() => {
    if (session.blocked) return;

    session.world.meta = {
      ...session.world.meta,
      tick: session.world.meta.tick + 1,
    };

    rematerializeFloor(session);

    const tickLoad = runOnTick(session);
    if (!isNothing(tickLoad)) {
      scheduleReplace(session, ipc, tickLoad, ipcError);
      return;
    }

    const extra = ipc.flushPending();
    if (extra.length === 0) {
      ipc.emitTick();
      return;
    }
    ipc.emitPatches(extra);
  }, 1000 / TICK_HZ);

  const onMessage = (msg: ToDaemon): void => {
    if (msg.type === 'sync') {
      ipc.emitSnapshot();
      return;
    }

    if (msg.type === 'command') {
      onCommand(session, ipc, msg.command, msg.seq);
    }
  };

  process.on('disconnect', () => {
    clearInterval(clock);
    process.off('message', onMessage);
  });

  return onMessage;
};
