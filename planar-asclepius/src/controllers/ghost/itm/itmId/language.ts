import validate from 'express-zod-safe';
import { z } from 'zod';

import { gameLanguages, objectKeys } from '@planar/shared';

import action from '@/services/ghost/itm/itmId/language/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodEnum, ZodObject, ZodString } from 'zod';

import type { GameLanguage } from '@planar/shared';

type ZodGameLanguages = Record<GameLanguage, GameLanguage>;

const registerItmIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'itm_itmId_gameLanguage',
    z.string().min(1, 'Skeleton itm id is required').openapi({
      param: {
        name: 'itmId',
        in: 'path',
        description: 'Skeleton itm id',
      },
      example: 'charchrm.itm',
    }),
  );
};

const registerGameLanguageParam = (registry: OpenAPIRegistry): ZodEnum<ZodGameLanguages> => {
  return registry.registerParameter(
    'gameLanguage',
    z.enum<GameLanguage[]>(objectKeys(gameLanguages)).openapi({
      param: {
        name: 'gameLanguage',
        in: 'path',
        description: 'Skeleton itm language',
      },
      example: 'ru_RU' as GameLanguage,
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
  path: '/api/ghost/itm/{itmId}/{gameLanguage}',
  tags: ['ghostItm'],
  description: 'Get translation of the itm in ghost format',
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
      description: 'Itm translation content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Itm translation is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const itmId = registerItmIdParam(registry);
  const gameLanguage = registerGameLanguageParam(registry);

  registry.registerPath(routeConfig(z.object({ itmId, gameLanguage })));

  router.post('/api/ghost/itm/:itmId/:gameLanguage',
    validate({ body, params: { itmId, gameLanguage } }),
    async (req, res) => {
      const result = await action({
        itmId: req.params.itmId,
        gameLanguage: req.params.gameLanguage,
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
