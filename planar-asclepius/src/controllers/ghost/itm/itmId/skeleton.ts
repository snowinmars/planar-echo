import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/itm/itmId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerItmIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'itm_itmId_skeleton',
    z.string().min(1, 'Skeleton itm id is required').openapi({
      param: {
        name: 'itmId',
        in: 'path',
        description: 'Skeleton itm id',
      },
      example: 'charchrm.itm',
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
  path: '/api/ghost/itm/{itmId}/skeleton',
  tags: ['ghostItm'],
  description: 'Get skeleton of the itm in ghost format',
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
      description: 'Itm skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Itm skeleton is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const itmId = registerItmIdParam(registry);
  registry.registerPath(routeConfig(z.object({ itmId })));

  router.post('/api/ghost/itm/:itmId/skeleton',
    validate({ body, params: { itmId } }),
    async (req, res) => {
      const result = await action({
        itmId: req.params.itmId,
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
