import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/fs/openDir/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const body = z.object({
  dir: z.string().min(1, 'Directory path is required'),
});
const responseOk = z.object({});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND', 'NOT_A_DIRECTORY', 'OPEN_FAILED']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/fs/openDir',
  tags: ['fs'],
  description: 'Opens a directory in the OS file manager on the asclepius host',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Directory opened',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    400: {
      description: 'Path is not a directory',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    404: {
      description: 'Directory not found',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    500: {
      description: 'Failed to open directory',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.post('/api/fs/openDir',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        dir: req.body.dir,
      });

      if (result.ok) {
        return res.status(200).json({});
      }

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
