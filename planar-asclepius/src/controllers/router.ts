import express from 'express';
import { z } from 'zod';
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import registerFsValidateChitinKeyFile from './fs/validate/chitinKeyFile.js';
import registerFsValidateGhostDir from './fs/validate/ghostDir.js';
import registerFsValidateWeiduExeDir from './fs/validate/weiduExeDir.js';
import registerFsGhostDir from './fs/ghostDir.js';
import registerFsPrismDir from './fs/prismDir.js';
import registerFsShellDir from './fs/shellDir.js';
import registerPing from './ping/ping.js';
import registerGhostDialogueDialogueIdSkeleton from './ghost/dialogue/dialogueId/skeleton.js';
import registerGhostDialogueDialogueIdLanguage from './ghost/dialogue/dialogueId/language.js';
import registerGhostDialogueList from './ghost/dialogue/list.js';
import registerGhostCreatureCreatureIdSkeleton from './ghost/creature/creatureId/skeleton.js';
import registerGhostCreatureCreatureIdLanguage from './ghost/creature/creatureId/language.js';
import registerGhostCreatureList from './ghost/creature/list.js';
import registerGhostItemItemIdSkeleton from './ghost/item/itemId/skeleton.js';
import registerGhostItemItemIdLanguage from './ghost/item/itemId/language.js';
import registerGhostItemList from './ghost/item/list.js';
import registerCreatureToDialogues from './map/creatureToDialogues.js';
import registerDialogueToCreature from './map/dialogueToCreature.js';
import registerItemToDialogues from './map/itemToDialogues.js';
import registerDialogueToItem from './map/dialogueToItem.js';
import registerSettingsGetGhost from './settings/getGhostDir.js';
import registerSettingsGetPrism from './settings/getPrismDir.js';
import registerSettingsGetShell from './settings/getShellDir.js';
import registerSettingsSetGhost from './settings/setGhostDir.js';
import registerSettingsSetPrism from './settings/setPrismDir.js';
import registerSettingsSetShell from './settings/setShellDir.js';

extendZodWithOpenApi(z);
const registry = new OpenAPIRegistry();

/**
 * @swagger
 * tags:
 *   - name: Health
 *   - name: GhostDialogue
 */
const router = express.Router();

registerFsValidateChitinKeyFile(registry, router);
registerFsValidateGhostDir(registry, router);
registerFsValidateWeiduExeDir(registry, router);
registerFsGhostDir(registry, router);
registerFsPrismDir(registry, router);
registerFsShellDir(registry, router);
registerPing(registry, router);
registerGhostDialogueDialogueIdSkeleton(registry, router);
registerGhostDialogueDialogueIdLanguage(registry, router);
registerGhostDialogueList(registry, router);
registerGhostCreatureCreatureIdSkeleton(registry, router);
registerGhostCreatureCreatureIdLanguage(registry, router);
registerGhostCreatureList(registry, router);
registerGhostItemItemIdSkeleton(registry, router);
registerGhostItemItemIdLanguage(registry, router);
registerGhostItemList(registry, router);
registerCreatureToDialogues(registry, router);
registerDialogueToCreature(registry, router);
registerItemToDialogues(registry, router);
registerDialogueToItem(registry, router);
registerSettingsGetGhost(registry, router);
registerSettingsGetPrism(registry, router);
registerSettingsGetShell(registry, router);
registerSettingsSetGhost(registry, router);
registerSettingsSetPrism(registry, router);
registerSettingsSetShell(registry, router);

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
