import { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/fs/validate/ghostPath/actions.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const body = z.object({
  ghostPath: z.string().min(1, 'Ghost path is required'),
});
const responseOk = z.object({});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND', 'DIRECTORY_NOT_EMPTY']),
  }),
});
const routeConfig: RouteConfig = {
  method: 'post',
  path: '/api/fs/validate/ghostPath',
  tags: ['fsValidate'],
  description: 'Validates ghost output access',
  request: {
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
      description: 'Ghost is valid',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Ghost directory not found',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    406: {
      description: 'Ghost directory not empty',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
};

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig);

  router.post('/api/fs/validate/ghostPath',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        ghostPath: req.body.ghostPath,
      });

      if (result.ok) {
        return res.status(200).json({});
      }

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
