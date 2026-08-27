import { WebSocketServer } from 'ws';
import { attachPlayWs } from '../wsController/play/attachPlayWs.js';
import { getGhostDir } from '@/services/settings/storage.js';
import { attachPrismIndexWs } from './prism/attachPrismIndexWs.js';

import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { Duplex } from 'stream';
import { just } from '@planar/shared';

// drops ?.. from url
const pathnameOf = (req: IncomingMessage): string => {
  const raw = just(req.url);
  const q = raw.indexOf('?');
  return q === -1 ? raw : raw.slice(0, q);
};

const createWsRouter = (server: Server<typeof IncomingMessage, typeof ServerResponse>): void => {
  const ghostDir = getGhostDir();

  const prismWss = new WebSocketServer({ noServer: true });
  const playWss = new WebSocketServer({ noServer: true });
  attachPrismIndexWs(prismWss);
  attachPlayWs(ghostDir, playWss);

  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const pathname = pathnameOf(req);

    if (pathname === '/api/prism/index') return prismWss
      .handleUpgrade(req, socket, head, (ws) => {
        prismWss.emit('connection', ws, req);
      });

    if (pathname === '/api/play') return playWss
      .handleUpgrade(req, socket, head, (ws) => {
        playWss.emit('connection', ws, req);
      });

    socket.destroy();
  });
};

export default createWsRouter;
