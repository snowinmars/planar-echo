import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/cre/creId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerCreIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'cre_creId_skeleton',
    z.string().min(1, 'Skeleton cre id is required').openapi({
      param: {
        name: 'creId',
        in: 'path',
        description: 'Skeleton cre id',
      },
      example: 'morte.cre',
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
  path: '/api/ghost/cre/{creId}/skeleton',
  tags: ['ghostCre'],
  description: 'Get skeleton of the cre in ghost format',
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
      description: 'Cre skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Cre skeleton is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const creId = registerCreIdParam(registry);
  registry.registerPath(routeConfig(z.object({ creId })));

  router.post('/api/ghost/cre/:creId/skeleton',
    validate({ body, params: { creId } }),
    async (req, res) => {
      const result = await action({
        creId: req.params.creId,
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
