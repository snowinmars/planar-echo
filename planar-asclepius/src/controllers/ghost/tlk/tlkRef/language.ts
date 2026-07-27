import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodEnum, ZodObject } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/ghost/tlk/tlkRef/language/action.js';
import { gameLanguages, objectKeys } from '@planar/shared';

import type { GameLanguage } from '@planar/shared';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

type ZodGameLanguages = Record<GameLanguage, GameLanguage>;

const registerGameLanguageParam = (registry: OpenAPIRegistry): ZodEnum<ZodGameLanguages> => {
  return registry.registerParameter(
    'gameLanguage',
    z.enum<GameLanguage[]>(objectKeys(gameLanguages)).openapi({
      param: {
        name: 'gameLanguage',
        in: 'path',
        description: 'Tlk language',
      },
      example: 'ru_RU' as GameLanguage,
    }),
  );
};

const body = z.object({
  ghostDir: z.string().min(1, 'Ghost directory path is required'),
  tlkRefs: z.array(z.number().min(0, 'Tlk ref cannot be less than zero')),
});
const responseOk = z.object({
  data: z.object({
    content: z.array(z.object({
      ref: z.number(),
      line: z.string(),
    })),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND', 'TLK_NOT_FOUND', 'TLK_REF_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'post',
  path: '/api/ghost/tlk/{gameLanguage}',
  tags: ['ghostTlk'],
  description: 'Get translation of the tlk ref',
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
      description: 'Translated tlk ref',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Cannot get tlk ref, see error code',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const gameLanguage = registerGameLanguageParam(registry);

  registry.registerPath(routeConfig(z.object({ gameLanguage })));

  router.post('/api/ghost/tlk/:gameLanguage',
    validate({ body, params: { gameLanguage } }),
    async (req, res) => {
      const result = await action({
        tlkRefs: req.body.tlkRefs,
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
