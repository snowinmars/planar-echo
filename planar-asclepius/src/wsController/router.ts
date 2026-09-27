import { WebSocketServer } from 'ws';

import { just } from '@planar/shared';

import { attachPrismIndexWs } from './prism/attachPrismIndexWs.js';

import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { Duplex } from 'stream';

import type { SessionGateway } from '@/session/gateway.js';
import type { Paths } from '@/shared/createPaths.types.js';

const pathnameOf = (req: IncomingMessage): string => {
  const raw = just(req.url);
  const q = raw.indexOf('?');
  return q === -1 ? raw : raw.slice(0, q);
};

const createWsRouter = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
  paths: Paths,
  gateway: SessionGateway | null,
): void => {
  const prismWss = new WebSocketServer({ noServer: true });
  attachPrismIndexWs(prismWss, paths);
  const sessionWss = gateway ? new WebSocketServer({ noServer: true }) : null;

  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const pathname = pathnameOf(req);

    if (pathname === '/api/prism/index') return prismWss
      .handleUpgrade(req, socket, head, (ws) => {
        prismWss.emit('connection', ws, req);
      });

    if (pathname === '/api/session' && sessionWss && gateway) return sessionWss
      .handleUpgrade(req, socket, head, (ws) => {
        gateway.attach(ws);
      });

    socket.destroy();
  });
};

export default createWsRouter;
