import { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';
import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import action from '../../../services/fs/validate/chitinKeyPath/action';

const body = z.object({
  weiduExePath: z.string().min(1, 'Weidu path is required'),
  chitinKeyPath: z.string().min(1, 'CHITIN.key path is required'),
  lang: z.enum(['ru', 'en']),
});
const responseOk = z.object({
  data: z.object({
    biffsCount: z.int(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.int(),
  }),
});
const routeConfig: RouteConfig = {
  method: 'post',
  path: '/fs/validate/chitinKeyPath',
  tags: ['fsValidate'],
  description: 'Validates CHITIN.key folder as a game folder',
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
      description: 'How many biffs are found by weidu in the game folder',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Game folder is not found by this path',
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

  router.post('/fs/validate/chitinKeyPath',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        weiduExePath: req.body.weiduExePath,
        chitinKeyPath: req.body.chitinKeyPath,
        lang: req.body.lang,
      });

      if (result.ok) {
        return res.status(200).json({
          data: {
            biffsCount: result.data.biffsCount,
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
