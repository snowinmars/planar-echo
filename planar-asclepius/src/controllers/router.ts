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
import registerFsDownloadWeidu from './fs/download/weidu.js';
import registerFsOpenDir from './fs/openDir.js';
import registerFsGhostDir from './fs/ghostDir.js';
import registerFsPrismDir from './fs/prismDir.js';
import registerFsShellDir from './fs/shellDir.js';
import registerPing from './ping/ping.js';
import registerGhostDlgDlgIdSkeleton from './ghost/dlg/dlgId/skeleton.js';
import registerGhostDlgList from './ghost/dlg/list.js';
import registerGhostCreCreIdSkeleton from './ghost/cre/creId/skeleton.js';
import registerGhostCreCreIdLanguage from './ghost/cre/creId/language.js';
import registerGhostCreList from './ghost/cre/list.js';
import registerGhostItmItmIdSkeleton from './ghost/itm/itmId/skeleton.js';
import registerGhostItmItmIdLanguage from './ghost/itm/itmId/language.js';
import registerGhostItmList from './ghost/itm/list.js';
import registerGhostTlkTlkRefLanguage from './ghost/tlk/tlkRef/language.js';
import registerCreToDlgs from './map/creToDlgs.js';
import registerDlgToCres from './map/dlgToCres.js';
import registerItmToDlgs from './map/itmToDlgs.js';
import registerDlgToItms from './map/dlgToItms.js';
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
 *   - name: GhostDlg
 */
const router = express.Router();

registerFsValidateChitinKeyFile(registry, router);
registerFsValidateGhostDir(registry, router);
registerFsValidateWeiduExeDir(registry, router);
registerFsDownloadWeidu(registry, router);
registerFsOpenDir(registry, router);
registerFsGhostDir(registry, router);
registerFsPrismDir(registry, router);
registerFsShellDir(registry, router);
registerPing(registry, router);
registerGhostDlgDlgIdSkeleton(registry, router);
registerGhostDlgList(registry, router);
registerGhostCreCreIdSkeleton(registry, router);
registerGhostCreCreIdLanguage(registry, router);
registerGhostCreList(registry, router);
registerGhostItmItmIdSkeleton(registry, router);
registerGhostItmItmIdLanguage(registry, router);
registerGhostItmList(registry, router);
registerGhostTlkTlkRefLanguage(registry, router);
registerCreToDlgs(registry, router);
registerDlgToCres(registry, router);
registerItmToDlgs(registry, router);
registerDlgToItms(registry, router);
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
