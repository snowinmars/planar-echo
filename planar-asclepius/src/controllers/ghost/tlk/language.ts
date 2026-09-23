import validate from 'express-zod-safe';
import { z } from 'zod';

import { gameLanguages, objectKeys } from '@planar/shared';

import action from '@/services/ghost/tlk/language/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

import type { GameLanguage } from '@planar/shared';

const params = z.object({
  gameLanguage: z.enum<GameLanguage[]>(objectKeys(gameLanguages)).openapi({
    example: 'ru_RU' as GameLanguage,
  }),
});
const tlkRef = z.coerce.number().int().min(0, 'Tlk ref cannot be less than zero');
const query = z.object({
  tlkRefs: z.preprocess(
    x => ((x === undefined || Array.isArray(x))
      ? x // ?tlkRefs=1&tlkRefs=2
      : [x]), // ?tlkRefs=123
    z.array(tlkRef).min(1).openapi({
      example: [123],
    }),
  ),
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
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/ghost/tlk/{gameLanguage}',
  tags: ['ghost'],
  description: 'Get translation of the tlk ref',
  request: {
    params,
    query,
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
  registry.registerPath(routeConfig());

  router.get('/api/ghost/tlk/:gameLanguage',
    validate({ query, params }),
    async (req, res) => {
      const result = await action({
        tlkRefs: req.query.tlkRefs,
        gameLanguage: req.params.gameLanguage,
        ghostDir: req.planarPaths.ghost.root,
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
