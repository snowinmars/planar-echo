import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/acm/acmId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerAcmIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'acm_acmId',
    z.string().min(1, 'Acm id is required').openapi({
      param: {
        name: 'acmId',
        in: 'path',
        description: 'Acm id',
      },
      example: 'baator.acm',
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
  path: '/api/ghost/acm/{acmId}/skeleton',
  tags: ['ghostAcm'],
  description: 'Get skeleton of the acm in ghost format',
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
      description: 'Acm skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Acm is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const acmId = registerAcmIdParam(registry);
  registry.registerPath(routeConfig(z.object({ acmId })));

  router.post('/api/ghost/acm/:acmId/skeleton',
    validate({ body, params: { acmId } }),
    async (req, res) => {
      const result = await action({
        acmId: req.params.acmId,
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
