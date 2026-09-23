import validate from 'express-zod-safe';
import { z } from 'zod';

import { ghostTypes } from '@planar/shared';

import action from '@/services/ghost/skeleton/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const params = z.object({
  resourceType: z.enum(ghostTypes).openapi({
    example: 'dlg',
  }),
  resourceName: z.string().min(1, 'Resource name is required').openapi({
    example: 'dmorte.dlg',
  }),
});
const responseOk = z.object({
  data: z.object({
    content: z.string(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/ghost/{resourceType}/{resourceName}/skeleton',
  tags: ['ghost'],
  description: 'Get skeleton of a ghost resource',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Skeleton content in ghost format',
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
      description: 'Resource is not found by this path',
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

  router.get('/api/ghost/:resourceType/:resourceName/skeleton',
    validate({ params }),
    async (req, res) => {
      const result = await action({
        ghostDir: req.planarPaths.ghost.root,
        resourceType: req.params.resourceType,
        resourceName: req.params.resourceName,
      });

      if (result.ok) {
        return res.status(200).json({
          data: {
            content: result.data.content,
          },
        });
      }

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
