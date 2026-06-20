import { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/settings/setGhost/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const body = z.object({
  ghostDir: z.string().min(1, 'Ghost directory path is required'),
});
const responseOk = z.object({
  ghostDir: z.string(),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/settings/ghostDir',
  tags: ['settings'],
  description: 'Set current ghost directory path settings',
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
      description: 'Current ghost directory path settings',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'No such directory for ghost directory',
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

  router.post('/api/settings/ghostDir',
    validate({ body }),
    async (req, res) => {
      const result = await action({ ghostDir: req.body.ghostDir });

      if (result.ok) return res.status(200).json(result.data);

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
