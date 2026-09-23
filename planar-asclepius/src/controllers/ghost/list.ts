import validate from 'express-zod-safe';
import { z } from 'zod';

import { ghostTypes } from '@planar/shared';

import action from '@/services/ghost/list/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const params = z.object({
  resourceType: z.enum(ghostTypes).openapi({
    example: 'dlg',
  }),
});
const query = z.object({
  partialName: z.string().optional().openapi({
    example: 'morte',
  }),
});
const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/ghost/{resourceType}',
  tags: ['ghost'],
  description: 'List ghost skeletons of a resource type',
  request: {
    params,
    query,
  },
  responses: {
    200: {
      description: 'Available resources in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    400: {
      description: 'Unknown resourceType',
    },
    404: {
      description: 'Available resources are not found by this path',
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

  router.get('/api/ghost/:resourceType',
    validate({ params, query }),
    async (req, res) => {
      const result = await action({
        ghostDir: req.planarPaths.ghost.root,
        resourceType: req.params.resourceType,
        partialName: req.query.partialName?.toLowerCase(),
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
