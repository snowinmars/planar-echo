import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/are/areId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerAreIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'are_areId',
    z.string().min(1, 'Are id is required').openapi({
      param: {
        name: 'areId',
        in: 'path',
        description: 'Are id',
      },
      example: 'ar0202.are',
    }),
  );
};
const body = z.object({
  ghostDir: z.string().min(1, 'Ghost directory path is required'),
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
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'post',
  path: '/api/ghost/are/{areId}/skeleton',
  tags: ['ghostAre'],
  description: 'Get skeleton of the are in ghost format',
  request: {
    params,
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
      description: 'Are skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Are is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const areId = registerAreIdParam(registry);
  registry.registerPath(routeConfig(z.object({ areId })));

  router.post('/api/ghost/are/:areId/skeleton',
    validate({ body, params: { areId } }),
    async (req, res) => {
      const result = await action({
        areId: req.params.areId,
        ghostDir: req.body.ghostDir,
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
