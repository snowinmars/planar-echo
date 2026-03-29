import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { join } from 'path';
import { createServer } from 'http';
import { ghostDir, shellDir } from './shared/folders.js';
import swaggerSpec from './swagger/swagger.json' with { type: 'json' }; ;
import router from './controllers/router.js';
import createWsRouter from './wsController/router.js';

import type { JsonObject } from 'swagger-ui-express';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false,
}));

app.use('/ghost', express.static(join(ghostDir, 'dist')));
app.use(express.static(join(shellDir, 'dist')));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (req.path.startsWith('/assets')) {
    return next();
  }
  if (req.path.startsWith('/ghostDir')) {
    return next();
  }
  res.sendFile(join(shellDir, 'dist', 'index.html'));
});

app.get('/api/swagger/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec as JsonObject));

app.use(router);

const server = createServer(app);

createWsRouter(server);

server.listen(PORT, () => {
  console.log(`Asclepius is running http://localhost:${PORT}`);
  console.log(`  Swagger at http://localhost:${PORT}/api/swagger/`);
  console.log(`  Generated swagger.json at http://localhost:${PORT}/api/openApi/`);
});
