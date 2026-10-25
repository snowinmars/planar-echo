import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { RefObject } from 'react';

import { isRecord, nothing, type ClientAnnouncedSessionLock, type ClientMount, type Maybe, type SessionFrame } from '@planar/shared';

type Dot = { entityId: number; x: number; y: number };
type Seat = 'alpha' | 'bravo';

const readDots = (rows: unknown): Dot[] => {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    if (!isRecord(row) || typeof row.entityId !== 'number' || !isRecord(row.value)) return [];
    if (typeof row.value.x !== 'number' || typeof row.value.y !== 'number') return [];
    return [{ entityId: row.entityId, x: row.value.x, y: row.value.y }];
  });
};

const readSeat = (params: URLSearchParams): Seat => params.get('seat') === 'bravo' ? 'bravo' : 'alpha';

type LoadedClient = Readonly<{
  origin: string;
  mount: ClientMount;
  commandId: string;
}>;

type UsePlayResponse = Readonly<{
  canvasRef: RefObject<HTMLCanvasElement | null>;
  seat: Seat;
  status: string;
  clientOrigin: string;
  setClientOrigin: (value: string) => void;
  serverOrigin: string;
  setServerOrigin: (value: string) => void;
}>;
export const usePlay = (): UsePlayResponse => {
  const seat = readSeat(useSearchParams()[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const [clientOrigin, setClientOrigin] = useState('http://localhost:3003');
  const [serverOrigin, setServerOrigin] = useState('http://localhost:3003');
  const [status, setStatus] = useState('idle');
  const [loadedClient, setLoadedClient] = useState<LoadedClient | null>(null);
  const mount = loadedClient?.origin === clientOrigin ? loadedClient.mount : null;
  const commandId = loadedClient?.origin === clientOrigin ? loadedClient.commandId : null;

  useEffect(() => {
    let disposed = false;
    setStatus('idle');

    const load = async (): Promise<void> => {
      const clientUrl = new URL('/client-mods/conformance/client.js', clientOrigin).href;
      const conformanceMod: Record<string, unknown> = await import(/* @vite-ignore */ clientUrl);
      if (disposed) return;
      if (typeof conformanceMod.commandId !== 'string' || conformanceMod.commandId.length === 0) {
        throw new Error('Client mod has no commandId');
      }
      setLoadedClient({
        origin: clientOrigin,
        mount: conformanceMod.mount as ClientMount,
        commandId: conformanceMod.commandId,
      });
    };

    load().catch((error: unknown) => {
      if (disposed) return;
      console.error(error);
      setStatus(error instanceof Error ? error.message : 'play failed');
    });

    return () => {
      disposed = true;
    };
  }, [clientOrigin]);

  useEffect(() => {
    const readyToRun = mount && commandId && canvasRef.current;
    if (!readyToRun) return undefined;

    let socket: Maybe<WebSocket> = nothing();
    let dispose: Maybe<(() => void)> = nothing();
    let disposed = false;

    const wsUrl = new URL('/api/session', serverOrigin);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(wsUrl.href);

    let epoch = 0;
    let ownedEntityId = 0;

    socket.addEventListener('message', (event) => {
      const frame: SessionFrame = JSON.parse(String(event.data));

      const brokenFrame = !isRecord(frame) || typeof frame.type !== 'string';
      if (brokenFrame) {
        const errorText = `What is wrong with frame '${frame}'?`;
        console.error(errorText);
        throw new Error(errorText);
      }

      switch (frame.type) {
        case 'announceSessionLock': {
          const message: ClientAnnouncedSessionLock = {
            type: 'announcedSessionLock',
            principalId: seat,
            lockHash: frame.lockHash
          };
          socket.send(JSON.stringify(message));

          return;
        }
        case 'joinedSession': {
          epoch = frame.connectionEpoch;
          ownedEntityId = frame.ownedEntityId;
          dotsRef.current = readDots(frame.rows);
          setStatus(`${frame.principalId} tick ${frame.tick}`);
          dispose?.();
          dispose = mount({
            canvas: canvasRef.current!,
            principalId: frame.principalId,
            ownedEntityId,
            sendMove: (dx, dy) => {
              socket.send(JSON.stringify({
                type: 'command',
                commandId,
                connectionEpoch: epoch,
                payload: { dx, dy },
              }));
            },
            readTransforms: () => dotsRef.current,
          });
          return;
        }
        case 'replicateTo': {
          dotsRef.current = readDots(frame.rows);
          setStatus(`${seat} tick ${frame.tick}`);
          return;
        }
        case 'reject': {
          setStatus(frame.reason);
          return;
        }
        case 'bye': {
          setStatus(frame.reason);
          return;
        }
        default:
          return;
      }
    });
    socket.addEventListener('close', () => {
      if (!disposed) setStatus('socket closed');
    });
    socket.addEventListener('error', (e: unknown) => {
      console.error(e);
      throw e;
    });

    return () => {
      disposed = true;
      dispose?.();
      socket?.close();
    };
  }, [commandId, mount, serverOrigin, seat]);

  return {
    canvasRef,
    seat,
    status,
    clientOrigin,
    setClientOrigin,
    serverOrigin,
    setServerOrigin,
  };
};
