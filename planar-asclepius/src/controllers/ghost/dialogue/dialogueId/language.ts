import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodEnum, ZodObject, ZodString } from 'zod';
import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import action from '../../../../services/ghost/dialogue/dialogueId/language/action';

const languages = ['ru', 'en'] as const;

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

const registerLanguageParam = (registry: OpenAPIRegistry): ZodEnum<{ ru: 'ru'; en: 'en' }> => {
  return registry.registerParameter(
    'language',
    z.enum(languages).openapi({
      param: {
        name: 'language',
        in: 'path',
        description: 'Skeleton dialogue language',
      },
      example: languages[0],
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
    code: z.int(),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'post',
  path: '/ghost/dialogue/{dialogueId}/{language}',
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
  const language = registerLanguageParam(registry);

  registry.registerPath(routeConfig(z.object({ dialogueId, language })));

  router.post('/ghost/dialogue/:dialogueId/:language',
    validate({ body, params: { dialogueId, language } }),
    async (req, res) => {
      const result = await action({
        dialogueId: req.params.dialogueId,
        language: req.params.language,
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
