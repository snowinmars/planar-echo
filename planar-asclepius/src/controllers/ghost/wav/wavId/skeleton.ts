import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/wav/wavId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerWavIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'wav_wavId',
    z.string().min(1, 'Wav id is required').openapi({
      param: {
        name: 'wavId',
        in: 'path',
        description: 'Wav id',
      },
      example: 'nam157.wav',
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
  path: '/api/ghost/wav/{wavId}/skeleton',
  tags: ['ghostWav'],
  description: 'Get skeleton of the wav in ghost format',
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
      description: 'Wav skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Wav is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const wavId = registerWavIdParam(registry);
  registry.registerPath(routeConfig(z.object({ wavId })));

  router.post('/api/ghost/wav/:wavId/skeleton',
    validate({ body, params: { wavId } }),
    async (req, res) => {
      const result = await action({
        wavId: req.params.wavId,
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
