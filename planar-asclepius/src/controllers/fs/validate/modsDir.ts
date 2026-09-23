import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/fs/validate/modsDir/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const body = z.object({
  modsDir: z.string().min(1, 'Mods directory path is required').openapi({
    example: '/abs/modsRuntime',
  }),
});
const responseOk = z.object({});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/fs/validate/modsDir',
  tags: ['fs'],
  description: 'Validates mods directory exists',
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
      description: 'Mods directory is valid',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Mods directory not found',
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

  router.post('/api/fs/validate/modsDir',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        modsDir: req.body.modsDir,
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
