import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodEnum, ZodObject, ZodString } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/ghost/dialogue/dialogueId/language/action.js';
import { gameLanguages, objectKeys } from '@planar/shared';

import type { GameLanguage } from '@planar/shared';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

type ZodGameLanguages = Record<GameLanguage, GameLanguage>;

const registerDialogueIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'dialogueId',
    z.string().min(1, 'Skeleton dialogue id is required').openapi({
      param: {
        name: 'dialogueId',
        in: 'path',
        description: 'Skeleton dialogue id',
      },
      example: 'dmorte',
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
        description: 'Skeleton dialogue language',
      },
      example: 'ru_RU' as GameLanguage,
    }),
  );
};

const body = z.object({
  ghostDir: z.string().min(1, 'Ghost folder path is required'),
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
  path: '/api/ghost/dialogue/{dialogueId}/{gameLanguage}',
  tags: ['ghostDialogue'],
  description: 'Get translation of the dialogue in ghost format',
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
      description: 'Dialogue translation content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Dialogue translation is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const dialogueId = registerDialogueIdParam(registry);
  const gameLanguage = registerGameLanguageParam(registry);

  registry.registerPath(routeConfig(z.object({ dialogueId, gameLanguage })));

  router.post('/api/ghost/dialogue/:dialogueId/:gameLanguage',
    validate({ body, params: { dialogueId, gameLanguage } }),
    async (req, res) => {
      const result = await action({
        dialogueId: req.params.dialogueId,
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
