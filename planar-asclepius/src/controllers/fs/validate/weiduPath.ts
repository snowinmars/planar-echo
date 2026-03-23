import { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';
import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import action from '@/services/fs/validate/weiduPath/actions';

const body = z.object({
  weiduExePath: z.string().min(1, 'Weidu path is required'),
});
const responseOk = z.object({
  data: z.object({
    version: z.string(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND', 'WEIDU_ERROR']),
  }),
});
const routeConfig: RouteConfig = {
  method: 'post',
  path: '/api/fs/validate/weiduPath',
  tags: ['fsValidate'],
  description: 'Validates weidu.exe access',
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
      description: 'Weidu.exe version',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    400: {
      description: 'Weidu error',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    404: {
      description: 'Weidu not found',
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

  router.post('/api/fs/validate/weiduPath',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        weiduExePath: req.body.weiduExePath,
      });

      if (result.ok) {
        return res.status(200).json({
          data: {
            version: result.data.version,
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
