import { useEffect } from 'react';

import type { RefObject } from 'react';

import type { Maybe } from '@planar/shared';

type RunProps = Readonly<{
  canvasRef: RefObject<Maybe<HTMLCanvasElement>>,
}>;

const run = ({
canvasRef
}: RunProps) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const socketRef = { current: null as WebSocket | null };
        const disposeRef = { current: null as (() => void) | null };
        let disposed = false;
    
        const fail = (message: string): void => {
          if (!disposed) setStatus(message);
        };
    
        const run = async (): Promise<void> => {
          const clientUrl = new URL('/client-mods/conformance/client.js', clientOrigin).href;
          const loaded: unknown = await import(/* @vite-ignore */ clientUrl);
          if (disposed) return;
          if (!isRecord(loaded) || typeof loaded.mount !== 'function') {
            fail('client mod has no mount');
            return;
          }
          const mount = loaded.mount as ClientMount;
          const wsUrl = new URL('/api/session', sessionOrigin);
          wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
          const socket = new WebSocket(wsUrl.href);
          socketRef.current = socket;
          let epoch = 0;
          let moveWireId = 0;
          let ownedEntityId = 0;
    
          socket.addEventListener('message', (event) => {
            const parsed: unknown = JSON.parse(String(event.data));
            if (!isRecord(parsed) || typeof parsed.type !== 'string') return;
            const frame = parsed as SessionFrame;
            switch (frame.type) {
              case 'offer':
                moveWireId = frame.moveWireId;
                socket.send(JSON.stringify({ type: 'hello', principalId: seat, lockHash: frame.lockHash }));
                return;
              case 'welcome':
                epoch = frame.connectionEpoch;
                ownedEntityId = frame.ownedEntityId;
                dotsRef.current = readDots(frame.rows);
                setStatus(`${frame.principalId} tick ${frame.tick}`);
                disposeRef.current?.();
                disposeRef.current = mount({
                  canvas,
                  principalId: frame.principalId,
                  ownedEntityId,
                  sendMove: (dx, dy) => {
                    socket.send(JSON.stringify({
                      type: 'command',
                      commandWireId: moveWireId,
                      connectionEpoch: epoch,
                      payload: { dx, dy },
                    }));
                  },
                  readTransforms: () => dotsRef.current,
                });
                return;
              case 'replication':
                dotsRef.current = readDots(frame.rows);
                setStatus(`${seat} tick ${frame.tick}`);
                return;
              case 'reject':
                fail(frame.reason);
                return;
              case 'bye':
                fail(frame.reason);
                return;
              default:
                return;
            }
          });
          socket.addEventListener('close', () => {
            if (!disposed) setStatus('socket closed');
          });
          socket.addEventListener('error', () => {
            fail('socket error');
          });
        };
    
        run().catch((error: unknown) => {
          fail(error instanceof Error ? error.message : 'play failed');
        });
    
        return () => {
          disposed = true;
          disposeRef.current?.();
          socketRef.current?.close();
        };
      }, [clientOrigin, sessionOrigin, seat]);
}