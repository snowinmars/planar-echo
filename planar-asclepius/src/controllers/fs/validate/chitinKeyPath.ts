import { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/fs/validate/chitinKeyPath/action.js';
import { gameLanguages, objectKeys } from '@planar/shared';

import type { GameLanguage } from '@planar/shared';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const body = z.object({
  weiduExePath: z.string().min(1, 'Weidu path is required'),
  chitinKeyPath: z.string().min(1, 'CHITIN.key path is required'),
  gameLanguage: z.enum<GameLanguage[]>(objectKeys(gameLanguages)),
});
const responseOk = z.object({
  data: z.object({
    biffsCount: z.int(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND', 'NO_BIFFS']),
  }),
});
const routeConfig: RouteConfig = {
  method: 'post',
  path: '/api/fs/validate/chitinKeyPath',
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

  router.post('/api/fs/validate/chitinKeyPath',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        weiduExePath: req.body.weiduExePath,
        chitinKeyPath: req.body.chitinKeyPath,
        gameLanguage: req.body.gameLanguage,
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
