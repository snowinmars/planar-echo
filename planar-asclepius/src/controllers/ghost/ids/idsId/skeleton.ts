import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/ids/idsId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerIdsIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'ids_idsId',
    z.string().min(1, 'Ids id is required').openapi({
      param: {
        name: 'idsId',
        in: 'path',
        description: 'Ids id',
      },
      example: 'class.ids',
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
  path: '/api/ghost/ids/{idsId}/skeleton',
  tags: ['ghostIds'],
  description: 'Get skeleton of the ids in ghost format',
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
      description: 'Ids skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Ids is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const idsId = registerIdsIdParam(registry);
  registry.registerPath(routeConfig(z.object({ idsId })));

  router.post('/api/ghost/ids/:idsId/skeleton',
    validate({ body, params: { idsId } }),
    async (req, res) => {
      const result = await action({
        idsId: req.params.idsId,
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
