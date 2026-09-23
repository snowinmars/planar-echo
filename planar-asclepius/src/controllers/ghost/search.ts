import validate from 'express-zod-safe';
import { z } from 'zod';

import { ghostTypes } from '@planar/shared';

import action from '@/services/ghost/search/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const ghostType = z.enum(ghostTypes);

const query = z.object({
  partialName: z.string().optional().openapi({
    example: 'morte',
  }),
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
  method: 'get',
  path: '/api/ghost',
  tags: ['ghost'],
  description: 'Search ghost skeleton filenames across workbench resource types. Empty query matches all, anyway - cap 20',
  request: {
    query,
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

  router.get('/api/ghost',
    validate({ query }),
    async (req, res) => {
      const result = await action({
        ghostDir: req.planarPaths.ghost.root,
        partialName: req.query.partialName?.trim().toLowerCase(),
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
