import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import type { FC } from 'react';

import type { ClientMount, SessionFrame } from '@planar/shared';

import styles from './Play.module.scss';

type Dot = { entityId: number; x: number; y: number };

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const readDots = (rows: unknown): Dot[] => {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    if (!isRecord(row) || typeof row.entityId !== 'number' || !isRecord(row.value)) return [];
    if (typeof row.value.x !== 'number' || typeof row.value.y !== 'number') return [];
    return [{ entityId: row.entityId, x: row.value.x, y: row.value.y }];
  });
};

const Play: FC = () => {
  const [params] = useSearchParams();
  const requested = params.get('seat') === 'bravo' ? 'bravo' : 'alpha';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const [clientOrigin, setClientOrigin] = useState('http://localhost:3003');
  const [sessionOrigin, setSessionOrigin] = useState('http://localhost:3003');
  const [status, setStatus] = useState('idle');
  const [seat, setSeat] = useState(requested);

  useEffect(() => {
    setSeat(requested);
  }, [requested]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return undefined;
  //   const socketRef = { current: null as WebSocket | null };
  //   const disposeRef = { current: null as (() => void) | null };
  //   let disposed = false;

  //   const fail = (message: string): void => {
  //     if (!disposed) setStatus(message);
  //   };

  //   const run = async (): Promise<void> => {
  //     const clientUrl = new URL('/client-mods/conformance/client.js', clientOrigin).href;
  //     const loaded: unknown = await import(/* @vite-ignore */ clientUrl);
  //     if (disposed) return;
  //     if (!isRecord(loaded) || typeof loaded.mount !== 'function') {
  //       fail('client mod has no mount');
  //       return;
  //     }
  //     const mount = loaded.mount as ClientMount;
  //     const wsUrl = new URL('/api/session', sessionOrigin);
  //     wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  //     const socket = new WebSocket(wsUrl.href);
  //     socketRef.current = socket;
  //     let epoch = 0;
  //     let moveWireId = 0;
  //     let ownedEntityId = 0;

  //     socket.addEventListener('message', (event) => {
  //       const parsed: unknown = JSON.parse(String(event.data));
  //       if (!isRecord(parsed) || typeof parsed.type !== 'string') return;
  //       const frame = parsed as SessionFrame;
  //       switch (frame.type) {
  //         case 'offer':
  //           moveWireId = frame.moveWireId;
  //           socket.send(JSON.stringify({ type: 'hello', principalId: seat, lockHash: frame.lockHash }));
  //           return;
  //         case 'welcome':
  //           epoch = frame.connectionEpoch;
  //           ownedEntityId = frame.ownedEntityId;
  //           dotsRef.current = readDots(frame.rows);
  //           setStatus(`${frame.principalId} tick ${frame.tick}`);
  //           disposeRef.current?.();
  //           disposeRef.current = mount({
  //             canvas,
  //             principalId: frame.principalId,
  //             ownedEntityId,
  //             sendMove: (dx, dy) => {
  //               socket.send(JSON.stringify({
  //                 type: 'command',
  //                 commandWireId: moveWireId,
  //                 connectionEpoch: epoch,
  //                 payload: { dx, dy },
  //               }));
  //             },
  //             readTransforms: () => dotsRef.current,
  //           });
  //           return;
  //         case 'replication':
  //           dotsRef.current = readDots(frame.rows);
  //           setStatus(`${seat} tick ${frame.tick}`);
  //           return;
  //         case 'reject':
  //           fail(frame.reason);
  //           return;
  //         case 'bye':
  //           fail(frame.reason);
  //           return;
  //         default:
  //           return;
  //       }
  //     });
  //     socket.addEventListener('close', () => {
  //       if (!disposed) setStatus('socket closed');
  //     });
  //     socket.addEventListener('error', () => {
  //       fail('socket error');
  //     });
  //   };

  //   run().catch((error: unknown) => {
  //     fail(error instanceof Error ? error.message : 'play failed');
  //   });

  //   return () => {
  //     disposed = true;
  //     disposeRef.current?.();
  //     socketRef.current?.close();
  //   };
  // }, [clientOrigin, sessionOrigin, seat]);

  return (
    <Stack spacing={2} className={styles.page}>
      <Typography variant="h5">Conformance dot</Typography>
      <Stack direction="row" spacing={1}>
        <Button component={RouterLink} to="/play?seat=alpha" variant={seat === 'alpha' ? 'contained' : 'outlined'}>
          alpha
        </Button>
        <Button component={RouterLink} to="/play?seat=bravo" variant={seat === 'bravo' ? 'contained' : 'outlined'}>
          bravo
        </Button>
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField label="clientOrigin" value={clientOrigin} onChange={event => setClientOrigin(event.target.value)} fullWidth />
        <TextField label="sessionOrigin" value={sessionOrigin} onChange={event => setSessionOrigin(event.target.value)} fullWidth />
      </Stack>
      <Typography>{status}</Typography>
      <canvas ref={canvasRef} width={480} height={480} className={styles.canvas} />
    </Stack>
  );
};

export default Play;
