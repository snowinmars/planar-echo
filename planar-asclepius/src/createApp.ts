import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import ghostDirAction from '@/services/fs/ghostDir/action.js';
import shellDirAction from '@/services/fs/shellDir/action.js';

import router from './controllers/router.js';
import { attachPlanarPaths } from './middleware/attachPlanarDirs.js';
import swaggerSpec from './swagger/swagger.json' with { type: 'json' };

import type { Express, Response } from 'express';
import type { JsonObject } from 'swagger-ui-express';

import type { Paths } from '@/shared/createPaths.types.js';

export type CreatedApp = Readonly<{
  app: Express;
  paths: Paths;
}>;

const sendFile = (res: Response, fullPath: string) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (fullPath.endsWith('.js')) {
    res.type('application/javascript');
  }
  return res.status(200).sendFile(fullPath);
};

export const createApp = (paths: Paths): CreatedApp => {
  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3000', // TODO [snow]: do not hardcode it
    credentials: true,
  }));
  app.use(attachPlanarPaths(paths));

  app.get('/api/swagger/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec as JsonObject));

  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    const ghostFileRequested = req.path.startsWith('/ghost');
    if (ghostFileRequested) {
      // copypaste from controllers/fs/ghostDir
      const result = await ghostDirAction({
        path: req.path.slice('/ghost'.length),
        ghostDir: req.planarPaths.ghost.root,
      });

      if (result.ok) return sendFile(res, result.data.fullPath);

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    }

    // copypaste from controllers/fs/shellDir
    const result = await shellDirAction({
      path: req.path,
      shellDir: req.planarPaths.shell.dist,
    });

    if (result.ok) return sendFile(res, result.data.fullPath);

    return res.status(result.error.status).json({
      error: {
        message: result.error.message,
        code: result.error.code,
      },
    });
  });

  app.use(router);

  return { app, paths };
};
