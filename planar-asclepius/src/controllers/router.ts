import express from 'express';
import { z } from 'zod';
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import registerValidateChitinKeyPath from './fs/validate/chitinKeyPath.js';
import registerValidateWeiduPath from './fs/validate/weiduPath.js';
import registerPing from './ping/ping.js';
import registerGhostDialogueDialogueIdSkeleton from './ghost/dialogue/dialogueId/skeleton.js';
import registerGhostDialogueDialogueIdLanguage from './ghost/dialogue/dialogueId/language.js';

extendZodWithOpenApi(z);
const registry = new OpenAPIRegistry();

/**
 * @swagger
 * tags:
 *   - name: Health
 *   - name: GhostDialogue
 */
const router = express.Router();

registerValidateChitinKeyPath(registry, router);
registerValidateWeiduPath(registry, router);
registerPing(registry, router);
registerGhostDialogueDialogueIdSkeleton(registry, router);
registerGhostDialogueDialogueIdLanguage(registry, router);

const getOpenApiDocumentation = (registry: OpenAPIRegistry) => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '0.0.1',
      title: 'Planar-asclepius API',
      contact: {
        name: '@snowinmars',
        email: 'snowinmars@yandex.ru',
      },
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server',
      },
    ],
  });
};

router.get('/api/openApi', (_, res) => {
  const docs = getOpenApiDocumentation(registry);
  return res.status(200).json(docs);
});

export default router;
