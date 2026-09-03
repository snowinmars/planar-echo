import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/bcs/list/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const body = z.object({
  ghostDir: z.string().min(1, 'Ghost directory path is required'),
  partialName: z.string().optional(),
});
const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/ghost/bcs',
  tags: ['ghostBcs'],
  description: 'Get available bcs in ghost format',
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
      description: 'Available bcs in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Available bcs are not found by this path',
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

  router.post('/api/ghost/bcs',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        ghostDir: req.body.ghostDir,
        partialName: req.body.partialName?.toLowerCase(),
      });

      if (result.ok) {
        return res.status(200).json(result.data);
      }

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
