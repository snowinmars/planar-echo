import { createServer } from 'http';

import logger from '@/shared/logger.js';

import { createApp } from './createApp.js';
import createWsRouter from './wsController/router.js';

const PORT = process.env.PORT || 3003;

const { app, paths } = createApp();
const server = createServer(app);
createWsRouter(server, paths);

server.listen(PORT, () => {
  logger.info(`Asclepius is running http://localhost:${PORT}`);
  logger.info(`  Swagger at http://localhost:${PORT}/api/swagger/`);
  logger.info(`  Live OpenAPI at http://localhost:${PORT}/api/openApi/`);
});
