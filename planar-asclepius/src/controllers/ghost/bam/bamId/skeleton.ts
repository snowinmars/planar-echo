import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/bam/bamId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerBamIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'bam_bamId',
    z.string().min(1, 'Bam id is required').openapi({
      param: {
        name: 'bamId',
        in: 'path',
        description: 'Bam id',
      },
      example: 'ampnm1.bam',
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
  path: '/api/ghost/bam/{bamId}/skeleton',
  tags: ['ghostBam'],
  description: 'Get skeleton of the bam in ghost format',
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
      description: 'Bam skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Bam is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const bamId = registerBamIdParam(registry);
  registry.registerPath(routeConfig(z.object({ bamId })));

  router.post('/api/ghost/bam/:bamId/skeleton',
    validate({ body, params: { bamId } }),
    async (req, res) => {
      const result = await action({
        bamId: req.params.bamId,
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
