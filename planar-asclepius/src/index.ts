import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import swaggerSpec from './swagger/swagger.json' with { type: 'json' }; ;
import router from './controllers/router.js';
import createWsRouter from './wsController/router.js';
import ghostDirAction from '@/services/fs/ghostDir/action.js';
import shellDirAction from '@/services/fs/shellDir/action.js';

import type { JsonObject } from 'swagger-ui-express';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false,
}));

app.get('/api/swagger/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec as JsonObject));

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  // as this is 'controller', it can reference services
  // I cannot reuse contoller itself (I beleive)
  const ghostFileRequested = req.path.startsWith('/ghost');
  if (ghostFileRequested) {
    // copypaste from controllers/fs/ghostDir
    const result = await ghostDirAction({ path: req.path.slice('/ghost'.length) });

    if (result.ok) return res.status(200).sendFile(result.data.fullPath);

    return res.status(result.error.status).json({
      error: {
        message: result.error.message,
        code: result.error.code,
      },
    });
  }

  // copypaste from controllers/fs/shellDir
  const result = await shellDirAction({ path: req.path });

  if (result.ok) return res.status(200).sendFile(result.data.fullPath);

  return res.status(result.error.status).json({
    error: {
      message: result.error.message,
      code: result.error.code,
    },
  });
});

app.use(router);

const server = createServer(app);

createWsRouter(server);

server.listen(PORT, () => {
  console.log(`Asclepius is running http://localhost:${PORT}`);
  console.log(`  Swagger at http://localhost:${PORT}/api/swagger/`);
  console.log(`  Generated swagger.json at http://localhost:${PORT}/api/openApi/`);
});
