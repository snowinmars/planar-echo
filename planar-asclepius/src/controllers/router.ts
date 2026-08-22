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
import registerAssetsFile from './assets/file.js';
import registerPing from './ping/ping.js';
import registerGhostDlgDlgIdSkeleton from './ghost/dlg/dlgId/skeleton.js';
import registerGhostDlgList from './ghost/dlg/list.js';
import registerGhostCreCreIdSkeleton from './ghost/cre/creId/skeleton.js';
import registerGhostCreCreIdLanguage from './ghost/cre/creId/language.js';
import registerGhostCreList from './ghost/cre/list.js';
import registerGhostItmItmIdSkeleton from './ghost/itm/itmId/skeleton.js';
import registerGhostItmItmIdLanguage from './ghost/itm/itmId/language.js';
import registerGhostItmList from './ghost/itm/list.js';
import registerGhostBcsList from './ghost/bcs/list.js';
import registerGhostBcsBcsIdSkeleton from './ghost/bcs/bcsId/skeleton.js';
import registerGhostMosList from './ghost/mos/list.js';
import registerGhostMosMosIdSkeleton from './ghost/mos/mosId/skeleton.js';
import registerGhostPvrzList from './ghost/pvrz/list.js';
import registerGhostPvrzPvrzIdSkeleton from './ghost/pvrz/pvrzId/skeleton.js';
import registerGhostTisList from './ghost/tis/list.js';
import registerGhostTisTisIdSkeleton from './ghost/tis/tisId/skeleton.js';
import registerGhostWedList from './ghost/wed/list.js';
import registerGhostWedWedIdSkeleton from './ghost/wed/wedId/skeleton.js';
import registerGhostAcmList from './ghost/acm/list.js';
import registerGhostAcmAcmIdSkeleton from './ghost/acm/acmId/skeleton.js';
import registerGhostBamList from './ghost/bam/list.js';
import registerGhostBamBamIdSkeleton from './ghost/bam/bamId/skeleton.js';
import registerGhostBmpList from './ghost/bmp/list.js';
import registerGhostBmpBmpIdSkeleton from './ghost/bmp/bmpId/skeleton.js';
import registerGhostWavList from './ghost/wav/list.js';
import registerGhostWavWavIdSkeleton from './ghost/wav/wavId/skeleton.js';
import registerGhostMusList from './ghost/mus/list.js';
import registerGhostMusMusIdSkeleton from './ghost/mus/musId/skeleton.js';
import registerGhostEffList from './ghost/eff/list.js';
import registerGhostEffEffIdSkeleton from './ghost/eff/effId/skeleton.js';
import registerGhostIdsList from './ghost/ids/list.js';
import registerGhostIdsIdsIdSkeleton from './ghost/ids/idsId/skeleton.js';
import registerGhostIniList from './ghost/ini/list.js';
import registerGhostIniIniIdSkeleton from './ghost/ini/iniId/skeleton.js';
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
registerAssetsFile(registry, router);
registerPing(registry, router);
registerGhostDlgDlgIdSkeleton(registry, router);
registerGhostDlgList(registry, router);
registerGhostCreCreIdSkeleton(registry, router);
registerGhostCreCreIdLanguage(registry, router);
registerGhostCreList(registry, router);
registerGhostItmItmIdSkeleton(registry, router);
registerGhostItmItmIdLanguage(registry, router);
registerGhostItmList(registry, router);
registerGhostBcsList(registry, router);
registerGhostBcsBcsIdSkeleton(registry, router);
registerGhostMosList(registry, router);
registerGhostMosMosIdSkeleton(registry, router);
registerGhostPvrzList(registry, router);
registerGhostPvrzPvrzIdSkeleton(registry, router);
registerGhostTisList(registry, router);
registerGhostTisTisIdSkeleton(registry, router);
registerGhostWedList(registry, router);
registerGhostWedWedIdSkeleton(registry, router);
registerGhostAcmList(registry, router);
registerGhostAcmAcmIdSkeleton(registry, router);
registerGhostBamList(registry, router);
registerGhostBamBamIdSkeleton(registry, router);
registerGhostBmpList(registry, router);
registerGhostBmpBmpIdSkeleton(registry, router);
registerGhostWavList(registry, router);
registerGhostWavWavIdSkeleton(registry, router);
registerGhostMusList(registry, router);
registerGhostMusMusIdSkeleton(registry, router);
registerGhostEffList(registry, router);
registerGhostEffEffIdSkeleton(registry, router);
registerGhostIdsList(registry, router);
registerGhostIdsIdsIdSkeleton(registry, router);
registerGhostIniList(registry, router);
registerGhostIniIniIdSkeleton(registry, router);
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
