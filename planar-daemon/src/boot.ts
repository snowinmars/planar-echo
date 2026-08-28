import {
  apply,
  cloneWorld,
  DEFAULT_ARE,
  TICK_HZ,
} from '@planar/kernel';
import { loadAreaWalk } from './loadAreaWalk.js';

import type { AreaTravel, InputCommand, Patch, ToDaemon, World } from '@planar/kernel';
import type { Maybe } from '@planar/shared';
import { send } from './shared/send.js';

type Session = {
  ghostDir: string;
  world: World;
  blocked: boolean;
  nextSeq: () => number;
  emitTick: () => void;
  emitPatches: (patches: Patch[]) => void;
  emitSnapshot: () => void;
};

const createSession = (ghostDir: string, world: World): Session => {
  let seq = 0;

  const nextSeq = (): number => {
    seq++;
    return seq;
  };

  const emitTick = (): void => {
    send({
      type: 'tick',
      seq: nextSeq(),
      tick: session.world.meta.tick,
    });
  };

  const emitPatches = (patches: Patch[]): void => {
    if (patches.length === 0) return;

    send({
      type: 'patches',
      seq: nextSeq(),
      tick: session.world.meta.tick,
      patches,
    });
  };

  const emitSnapshot = (): void => {
    const snapshotSeq = nextSeq();
    send({
      type: 'snapshot',
      seq: snapshotSeq,
      snapshot: cloneWorld(session.world, snapshotSeq),
    });
  };

  const session: Session = {
    ghostDir,
    world,
    blocked: false,
    nextSeq,
    emitTick,
    emitPatches,
    emitSnapshot,
  };

  return session;
};

const replaceWorld = async (
  session: Session,
  are: string,
  entrance: Maybe<string>,
): Promise<void> => {
  const world = await loadAreaWalk(session.ghostDir, are, entrance);
  session.world = world;
  session.emitSnapshot();
};

const blockWhile = (
  session: Session,
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

const rejectCommand = (session: Session, clientSeq: number, err: unknown): void => {
  session.emitPatches([{
    op: 'command/rejected',
    seq: clientSeq,
    reason: err instanceof Error ? err.message : String(err),
  }]);
};

const startAreaTravel = (session: Session, travel: AreaTravel, onError: (err: unknown) => void): void => {
  blockWhile(
    session,
    () => replaceWorld(session, travel.are, travel.entrance),
    onError,
  );
};

const onCommand = (session: Session, command: InputCommand, clientSeq: number): void => {
  if (session.blocked) return;

  if (command.type === 'session/loadArea') {
    startAreaTravel(
      session,
      { are: command.are, entrance: command.entrance },
      (err: unknown) => rejectCommand(session, clientSeq, err),
    );
    return;
  }

  const result = apply(session.world, command);

  if (result.travel) {
    startAreaTravel(
      session,
      result.travel,
      (err: unknown) => {
        send({ type: 'error', message: err instanceof Error ? err.message : String(err) });
      },
    );
    return;
  }

  session.emitPatches(result.events.map(event => (
    event.op === 'command/rejected' ? { ...event, seq: clientSeq } : event
  )));
};

export const boot = async (
  ghostDir: string,
  are: Maybe<string>,
  entrance: Maybe<string>,
): Promise<(msg: ToDaemon) => void> => {
  const world = await loadAreaWalk(ghostDir, are ?? DEFAULT_ARE, entrance);
  const session = createSession(ghostDir, world);

  send({ type: 'hello', tickHz: TICK_HZ });

  session.emitSnapshot();

  const clock = setInterval(() => {
    if (session.blocked) return;
    if (session.world.meta.paused) return;

    const result = apply(session.world, { type: 'clock/tick' });

    if (result.travel) {
      startAreaTravel(
        session,
        result.travel,
        (err: unknown) => {
          send({ type: 'error', message: err instanceof Error ? err.message : String(err) });
        },
      );
      return;
    }

    if (result.events.length === 0) {
      session.emitTick();
      return;
    }

    session.emitPatches(result.events);
  }, 1000 / TICK_HZ);

  const onMessage = (msg: ToDaemon): void => {
    if (msg.type === 'sync') {
      session.emitSnapshot();
      return;
    }

    if (msg.type === 'command') {
      onCommand(session, msg.command, msg.seq);
    }
  };

  process.on('disconnect', () => {
    clearInterval(clock);
    process.off('message', onMessage);
  });

  return onMessage;
};
