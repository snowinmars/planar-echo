import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import ghostDirAction from '@/services/fs/ghostDir/action.js';
import shellDirAction from '@/services/fs/shellDir/action.js';
import modsFileAction from '@/services/mods/file/action.js';

import router from './controllers/router.js';
import { attachPlanarPaths } from './middleware/attachPlanarDirs.js';
import { PathsStore } from './shared/pathsStore.js';
import swaggerSpec from './swagger/swagger.json' with { type: 'json' };

import type { Express, Response } from 'express';
import type { JsonObject } from 'swagger-ui-express';

export type CreatedApp = Readonly<{
  app: Express;
  paths: PathsStore;
}>;

const sendFile = (res: Response, fullPath: string) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  if (fullPath.endsWith('.js')) {
    res.type('application/javascript');
  }
  return res.status(200).sendFile(fullPath);
};

export const createApp = (): CreatedApp => {
  const paths = new PathsStore('asclepius.defaults.json');

  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3000', // TODO [snow]: do not hardcode it
    credentials: true,
  }));
  app.set('paths', paths);
  app.use(attachPlanarPaths(paths.current));

  app.get('/api/swagger/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec as JsonObject));

  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    // as this is 'controller', it can reference services
    // I cannot reuse contoller itself (I beleive)
    const modsRequested = req.path.startsWith('/mods');
    if (modsRequested) {
    // copypaste from controllers/fs/ghostDir
      const result = await modsFileAction({
        path: req.path.slice('/mods'.length),
        modsRuntimeDir: req.planarPaths.modsRuntime.root,
      });

      if (result.ok) return sendFile(res, result.data.fullPath);

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    }

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
