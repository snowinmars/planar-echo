import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import logger from '@/shared/logger.js';
import { loadPaths } from '@/shared/pathsStore.js';

import { createApp } from './createApp.js';
import createWsRouter from './wsController/router.js';

const PORT = process.env.PORT || 3003;

const defaultsFile = join(dirname(fileURLToPath(import.meta.url)), 'asclepius.defaults.json');
const paths = loadPaths(defaultsFile);
const { app } = createApp(paths);
const server = createServer(app);
createWsRouter(server, paths);

server.listen(PORT, () => {
  logger.info(`Asclepius is running http://localhost:${PORT}`);
  logger.info(`  Swagger at http://localhost:${PORT}/api/swagger/`);
  logger.info(`  Live OpenAPI at http://localhost:${PORT}/api/openApi/`);
});
