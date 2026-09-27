import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { SessionGateway } from '@/session/gateway.js';
import { readRole, servesClient, servesSession } from '@/session/role.js';
import logger from '@/shared/logger.js';
import { loadPaths } from '@/shared/pathsStore.js';

import { createApp } from './createApp.js';
import createWsRouter from './wsController/router.js';

const PORT = process.env.PORT || 3003;
const role = readRole();

const defaultsFile = join(dirname(fileURLToPath(import.meta.url)), 'asclepius.defaults.json');
const paths = loadPaths(defaultsFile);
const gateway = servesSession(role) ? new SessionGateway() : null;
if (gateway) await gateway.start();

const { app } = createApp(paths, { serveClientMods: servesClient(role) });
const server = createServer(app);
createWsRouter(server, paths, gateway);

const shutdown = (): void => {
  gateway?.stop();
  server.close();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  logger.info(`Asclepius (${role}) is running http://localhost:${PORT}`);
  logger.info(`  Swagger at http://localhost:${PORT}/api/swagger/`);
  logger.info(`  Live OpenAPI at http://localhost:${PORT}/api/openApi/`);
});
