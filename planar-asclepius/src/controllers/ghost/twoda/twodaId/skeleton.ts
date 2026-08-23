import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/twoda/twodaId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerTwodaIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'twoda_twodaId',
    z.string().min(1, 'Twoda id is required').openapi({
      param: {
        name: 'twodaId',
        in: 'path',
        description: '2da id',
      },
      example: 'happy.2da',
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
  path: '/api/ghost/twoda/{twodaId}/skeleton',
  tags: ['ghostTwoda'],
  description: 'Get skeleton of the 2da in ghost format',
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
      description: '2da skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: '2da is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const twodaId = registerTwodaIdParam(registry);
  registry.registerPath(routeConfig(z.object({ twodaId })));

  router.post('/api/ghost/twoda/:twodaId/skeleton',
    validate({ body, params: { twodaId } }),
    async (req, res) => {
      const result = await action({
        twodaId: req.params.twodaId,
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
