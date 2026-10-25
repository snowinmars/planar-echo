import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { SessionGateway } from '@/session/gateway.js';
import { readRole, canServeClient, canServeServer } from '@/session/role.js';
import logger from '@/shared/logger.js';
import { loadPaths } from '@/shared/pathsStore.js';

import { createApp } from './createApp.js';
import createWsRouter from './wsController/router.js';
import { nothing } from '@planar/shared';
import type { Paths } from './shared/createPaths.types.js';

const PORT = process.env.PORT || 3003;

const hostServer = async (paths: Paths): Promise<void> => {
  const gateway = new SessionGateway();
  await gateway.start();

  const { app } = createApp(paths, { serveClientMods: false });
  const server = createServer(app);
  createWsRouter(server, paths, gateway);

  const shutdown = (): void => {
    gateway.stop();
    server.close();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.listen(PORT, () => {
    logger.info(`Asclepius hosts a server on http://localhost:${PORT}`);
    logger.info(`  Swagger at http://localhost:${PORT}/api/swagger/`);
    logger.info(`  Live OpenAPI at http://localhost:${PORT}/api/openApi/`);
  });
}

const hostClient = async (paths: Paths) => {
  const { app } = createApp(paths, { serveClientMods: true });
  const server = createServer(app);
  createWsRouter(server, paths, nothing());

  const shutdown = (): void => {
    server.close();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.listen(PORT, () => {
    logger.info(`Asclepius hosts a client on http://localhost:${PORT}`);
    logger.info(`  Swagger at http://localhost:${PORT}/api/swagger/`);
    logger.info(`  Live OpenAPI at http://localhost:${PORT}/api/openApi/`);
  });
}

const hostBoth = async (paths: Paths): Promise<void> => {
  const gateway = new SessionGateway();
  await gateway.start();

  const { app } = createApp(paths, { serveClientMods: true });
  const server = createServer(app);
  createWsRouter(server, paths, gateway);

  const shutdown = (): void => {
    gateway.stop();
    server.close();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.listen(PORT, () => {
    logger.info(`Asclepius hosts both server and client on http://localhost:${PORT}`);
    logger.info(`  Swagger at http://localhost:${PORT}/api/swagger/`);
    logger.info(`  Live OpenAPI at http://localhost:${PORT}/api/openApi/`);
  });
}

const defaultsFile = join(dirname(fileURLToPath(import.meta.url)), 'asclepius.defaults.json');
const paths = loadPaths(defaultsFile);
const role = readRole();
switch (role) {
  case 'host-server': await hostServer(paths);
  case 'host-client': await hostClient(paths)
  case 'host-both': await hostBoth(paths);
}

