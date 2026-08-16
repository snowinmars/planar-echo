import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/tis/tisId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerTisIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'tis_tisId',
    z.string().min(1, 'Tis id is required').openapi({
      param: {
        name: 'tisId',
        in: 'path',
        description: 'Tis id',
      },
      example: 'ar0202.tis',
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
  path: '/api/ghost/tis/{tisId}/skeleton',
  tags: ['ghostTis'],
  description: 'Get skeleton of the tis in ghost format',
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
      description: 'Tis skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Tis is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const tisId = registerTisIdParam(registry);
  registry.registerPath(routeConfig(z.object({ tisId })));

  router.post('/api/ghost/tis/:tisId/skeleton',
    validate({ body, params: { tisId } }),
    async (req, res) => {
      const result = await action({
        tisId: req.params.tisId,
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
