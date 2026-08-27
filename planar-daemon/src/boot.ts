import {
  apply,
  cloneWorld,
  DEFAULT_ARE,
  TICK_HZ,
} from '@planar/kernel';
import { loadAreaWalk } from './loadAreaWalk.js';

import type { InputCommand, Patch, ToDaemon, World } from '@planar/kernel';
import type { Maybe } from '@planar/shared';
import { send } from './shared/send.js';

type Session = {
  ghostDir: string;
  world: World;
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
    nextSeq,
    emitTick,
    emitPatches,
    emitSnapshot,
  };

  return session;
};

const onCommand = (session: Session, command: InputCommand, clientSeq: number): void => {
  if (command.type === 'session/loadArea') {
    loadAreaWalk(session.ghostDir, command.are, command.entrance)
      .then((world) => {
        session.world = world;
        session.emitSnapshot();
      }).catch((err: unknown) => {
        session.emitPatches([{
          op: 'command/rejected',
          seq: clientSeq,
          reason: err instanceof Error ? err.message : String(err),
        }]);
      });

    return;
  }

  const result = apply(session.world, command);

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
    if (session.world.meta.paused) return;

    const result = apply(session.world, { type: 'clock/tick' });
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
