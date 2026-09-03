import validate from 'express-zod-safe';
import { z } from 'zod';

import { ghostTypes } from '@planar/shared';

import action from '@/services/ghost/search/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const ghostType = z.enum(ghostTypes);

const body = z.object({
  ghostDir: z.string().min(1, 'Ghost directory path is required'),
  partialName: z.string(),
});
const responseOk = z.array(z.object({
  type: ghostType,
  id: z.string(),
}));
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/ghost/search',
  tags: ['ghostSearch'],
  description: 'Search ghost skeleton filenames across workbench resource types',
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
      description: 'Matching ghost files (max 20), sorted by id',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Ghost directory is not found by this path',
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

  router.post('/api/ghost/search',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        ghostDir: req.body.ghostDir,
        partialName: req.body.partialName.trim().toLowerCase(),
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
