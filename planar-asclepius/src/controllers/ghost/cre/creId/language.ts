import validate from 'express-zod-safe';
import { z } from 'zod';

import { gameLanguages, objectKeys } from '@planar/shared';

import action from '@/services/ghost/cre/creId/language/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodEnum, ZodObject, ZodString } from 'zod';

import type { GameLanguage } from '@planar/shared';

type ZodGameLanguages = Record<GameLanguage, GameLanguage>;

const registerCreIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'cre_creId_gameLanguage',
    z.string().min(1, 'Skeleton cre id is required').openapi({
      param: {
        name: 'creId',
        in: 'path',
        description: 'Skeleton cre id',
      },
      example: 'morte.cre',
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
        description: 'Skeleton cre language',
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
  path: '/api/ghost/cre/{creId}/{gameLanguage}',
  tags: ['ghostCre'],
  description: 'Get translation of the cre in ghost format',
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
      description: 'Cre translation content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Cre translation is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const creId = registerCreIdParam(registry);
  const gameLanguage = registerGameLanguageParam(registry);

  registry.registerPath(routeConfig(z.object({ creId, gameLanguage })));

  router.post('/api/ghost/cre/:creId/:gameLanguage',
    validate({ body, params: { creId, gameLanguage } }),
    async (req, res) => {
      const result = await action({
        creId: req.params.creId,
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
