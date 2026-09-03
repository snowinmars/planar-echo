import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/mus/musId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerMusIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'mus_musId',
    z.string().min(1, 'Mus id is required').openapi({
      param: {
        name: 'musId',
        in: 'path',
        description: 'Mus id',
      },
      example: 'baat.mus',
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
  path: '/api/ghost/mus/{musId}/skeleton',
  tags: ['ghostMus'],
  description: 'Get skeleton of the mus in ghost format',
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
      description: 'Mus skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Mus is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const musId = registerMusIdParam(registry);
  registry.registerPath(routeConfig(z.object({ musId })));

  router.post('/api/ghost/mus/:musId/skeleton',
    validate({ body, params: { musId } }),
    async (req, res) => {
      const result = await action({
        musId: req.params.musId,
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
