import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import express from 'express';

import registerAssetsFile from './assets/file.js';
import registerFsDownloadWeidu from './fs/download/weidu.js';
import registerFsGhostDir from './fs/ghostDir.js';
import registerFsOpenDir from './fs/openDir.js';
import registerFsPrismDir from './fs/prismDir.js';
import registerFsShellDir from './fs/shellDir.js';
import registerFsValidateChitinKeyFile from './fs/validate/chitinKeyFile.js';
import registerFsValidateGhostDir from './fs/validate/ghostDir.js';
import registerFsValidateModsDir from './fs/validate/modsDir.js';
import registerFsValidateWeiduExeDir from './fs/validate/weiduExeDir.js';
import registerGhostList from './ghost/list.js';
import registerGhostSearch from './ghost/search.js';
import registerGhostSkeleton from './ghost/skeleton.js';
import registerGhostTlkGameLanguage from './ghost/tlk/language.js';
import registerCreToDlgs from './map/creToDlgs.js';
import registerDlgToCres from './map/dlgToCres.js';
import registerDlgToItms from './map/dlgToItms.js';
import registerItmToDlgs from './map/itmToDlgs.js';
import registerPathsGet from './paths/get.js';
import registerPing from './ping/ping.js';

import type { OpenAPIObject } from 'openapi3-ts/oas30';

const registry = new OpenAPIRegistry();

/**
 * @swagger
 * tags:
 *   - name: Health
 *   - name: GhostDlg
 */
const router = express.Router();

// registration order matters:
// tlk -> acm/...
registerFsValidateChitinKeyFile(registry, router);
registerFsValidateGhostDir(registry, router);
registerFsValidateModsDir(registry, router);
registerFsValidateWeiduExeDir(registry, router);
registerFsDownloadWeidu(registry, router);
registerFsOpenDir(registry, router);
registerFsGhostDir(registry, router);
registerFsPrismDir(registry, router);
registerFsShellDir(registry, router);
registerAssetsFile(registry, router);
registerPing(registry, router);
registerGhostTlkGameLanguage(registry, router);
registerGhostSearch(registry, router);
registerGhostList(registry, router);
registerGhostSkeleton(registry, router);
registerCreToDlgs(registry, router);
registerDlgToCres(registry, router);
registerItmToDlgs(registry, router);
registerDlgToItms(registry, router);
registerPathsGet(registry, router);

const getOpenApiDocumentation = (registry: OpenAPIRegistry): OpenAPIObject => {
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

export const buildOpenApiDocument = (): OpenAPIObject => getOpenApiDocumentation(registry);

export default router;
