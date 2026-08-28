import { isNothing, nothing } from '@planar/shared';
import { attachPlayView } from './attachPlayView.js';

import type { FromDaemon, InputCommand, Patch, SeatId, ToDaemon } from '@planar/kernel';
import type { Maybe } from '@planar/shared';
import type { PlaySessionApi, PlaySocketState, PlayView } from './types.js';

const SEAT_ID: SeatId = 1;

const wsUrlFromHttp = (httpUrl: string): string => `${httpUrl.replace(/^http/u, 'ws')}/api/play`; // TODO [snow]: generate websocket client

const isRejectedPatch = (patch: Patch): patch is Extract<Patch, { op: 'command/rejected' }> => (
  patch.op === 'command/rejected'
);

export type CreatePlaySessionProps = Readonly<{
  renderHost: HTMLDivElement;
  serverUrl: string;
  ghostDir: string;
  onHudUpdate: (tick: number, paused: boolean, areId: string) => void;
  onPlaySocketStateChanged: (socket: PlaySocketState) => void;
  onError: (message: string) => void;
}>;
export const createPlaySession = ({
  renderHost,
  serverUrl,
  ghostDir,
  onHudUpdate,
  onPlaySocketStateChanged,
  onError,
}: CreatePlaySessionProps): PlaySessionApi => {
  const websocketUrl = wsUrlFromHttp(serverUrl);
  console.info(`Creating websocket at '${websocketUrl}'`);
  const ws = new WebSocket(websocketUrl);

  let view: Maybe<PlayView> = nothing();
  let disposed = false;
  let seq = 0;
  let wsOpen = false;
  let renderHostReady = false;
  let alive = false;
  let followRequested = false;

  const closeWs = (): void => {
    const alreadyClosed = ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED;
    if (!alreadyClosed) ws.close();
  };

  const onPageHide = (): void => teardown();

  const teardown = (): void => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not teardown`);
      return;
    }

    disposed = true;
    alive = false;

    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('beforeunload', onPageHide);

    view?.destroy();
    view = nothing();

    closeWs();
  };

  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('beforeunload', onPageHide);

  const sendInputCommand = (command: InputCommand): void => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not send command '${JSON.stringify(command)}'`);
      return;
    }

    if (!alive) {
      console.warn(`Not alive, and therefore will not send command '${JSON.stringify(command)}'`);
      return;
    }

    seq++;

    const toDaemon: ToDaemon = {
      type: 'command',
      seq,
      command,
    };

    ws.send(JSON.stringify(toDaemon));
  };

  const tryGoLive = (): void => { // it calls twice because I need both ws and renderHost to be ready. First call is always miss
    if (disposed) {
      console.warn(`Disposed, and therefore will not do alive`);
      return;
    }

    if (alive) {
      console.warn(`Already, alive and therefore will not do alive`);
      return;
    }

    const bothReady = wsOpen && renderHostReady;
    if (!bothReady) {
      console.warn(`Both websocket and render host are not ready, and therefore it will not try to go alive`);
      return;
    }

    const sync: ToDaemon = { type: 'sync' };
    ws.send(JSON.stringify(sync));
  };

  const handleFromDaemon = (fromDaemon: FromDaemon): void => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not handle message from daemon '${JSON.stringify(fromDaemon)}'`);
      return;
    }

    if (fromDaemon.type === 'error') {
      onError(fromDaemon.message);
      return;
    }

    if (fromDaemon.type === 'snapshot') {
      const bothReady = wsOpen && renderHostReady;
      if (!bothReady) {
        console.warn(`Both websocket and render host are not ready, and therefore it will not go alive`);
        return;
      }

      alive = true;
    }

    if (!alive) return;

    if (fromDaemon.type === 'patches') {
      const rejected = fromDaemon.patches.find(isRejectedPatch);
      if (rejected) {
        onError(rejected.reason);
        return;
      }
    }

    if (isNothing(view)) throw new Error(`View should not be empty here`);
    view.handleFromDaemon(fromDaemon);
  };

  attachPlayView({
    renderHost,
    serverUrl,
    ghostDir,
    onClick: ({ x, y, button }) => {
      if (disposed) {
        console.warn(`Disposed, and therefore will not open websocket`);
        return;
      }

      sendInputCommand({
        type: 'pointer/click',
        seatId: SEAT_ID,
        x,
        y,
        button,
      });
    },
    onHudUpdate: (tick, paused, areId) => {
      if (disposed) {
        console.warn(`Disposed, and therefore will not open websocket`);
        return;
      }

      onHudUpdate(tick, paused, areId);
    },
  }).then((nextView) => {
    if (disposed) {
      nextView.destroy();
      return;
    }

    view = nextView;
    renderHostReady = true;

    nextView.setFollow(followRequested);

    tryGoLive();
  }).catch((err: unknown) => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not show error`);
      console.warn(err);
      return;
    }

    onError(err instanceof Error ? err.message : String(err));
  });

  ws.addEventListener('open', () => {
    if (disposed) {
      closeWs();
      return;
    }

    wsOpen = true;
    onPlaySocketStateChanged('open');
    tryGoLive();
  });

  ws.addEventListener('close', () => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not close websocket`);
      return;
    }

    wsOpen = false;
    alive = false;
    onPlaySocketStateChanged('closed');
  });

  ws.addEventListener('error', () => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not catch error from websocket`);
      return;
    }

    onPlaySocketStateChanged('error');
  });

  ws.addEventListener('message', (event) => {
    if (disposed) {
      console.warn(`Disposed, and therefore will not handle message from websocket`);
      return;
    }

    const fromDaemon = JSON.parse(event.data as string) as FromDaemon;
    handleFromDaemon(fromDaemon);
  });

  return {
    loadArea: (are, entrance) => {
      sendInputCommand({
        type: 'session/loadArea',
        seatId: SEAT_ID,
        are,
        entrance,
      });
    },
    setPaused: (paused) => {
      sendInputCommand({
        type: 'session/pause',
        seatId: SEAT_ID,
        paused,
      });
    },
    setFollow: (follow) => {
      followRequested = follow;
      if (isNothing(view)) return;
      view.setFollow(follow);
    },
    destroy: () => {
      teardown();
    },
  };
};
