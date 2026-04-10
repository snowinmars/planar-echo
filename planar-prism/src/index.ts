import { confirm } from './node-ask/index.js';
import logger from './shared/logger.js';
import { disposeReports, reportComplete, reportError } from './shared/report.js';
import { copyFile } from 'fs/promises';

// import convertTwoda from './pipes/convertTwoda/convertTwoda.js';
// import convertAre from './pipes/convertAre/convertAre.js';
// import convertBam from './pipes/convertBam/convertBam.js';
// import convertBcs from './pipes/convertBcs/convertBcs.js';
// import convertBmp from './pipes/convertBmp/convertBmp.js';
// import convertChu from './pipes/convertChu/convertChu.js';
// import convertGlsl from './pipes/convertGlsl/convertGlsl.js';
// import convertLua from './pipes/convertLua/convertLua.js';
// import convertMenu from './pipes/convertMenu/convertMenu.js';
// import convertMos from './pipes/convertMos/convertMos.js';
// import convertPvrz from './pipes/convertPvrz/convertPvrz.js';
// import convertPro from './pipes/convertPro/convertPro.js';
// import convertQsp from './pipes/convertQsp/convertQsp.js';
// import convertSpl from './pipes/convertSpl/convertSpl.js';
// import convertSrc from './pipes/convertSrc/convertSrc.js';
// import convertSto from './pipes/convertSto/convertSto.js';
// import convertTis from './pipes/convertTis/convertTis.js';
// import convertTtf from './pipes/convertTtf/convertTtf.js';
// import convertVvc from './pipes/convertVvc/convertVvc.js';
// import convertWav from './pipes/convertWav/convertWav.js';
// import convertWbm from './pipes/convertWbm/convertWbm.js';
// import convertWed from './pipes/convertWed/convertWed.js';
// import convertWmp from './pipes/convertWmp/convertWmp.js';

import { createPathes } from '@/steps/1.createPathes/index.js';
import { validate } from '@/steps/2.validate/index.js';
import { decompileBiffs } from '@/steps/3.decompileBiffs/index.js';
import { biffs2json } from '@/steps/4.biffs2json/index.js';
import json2Ghost from '@/steps/6.json2Ghost/index.js';

import type { PrismIndexStartMessage } from '@planar/shared';
import { join } from 'path';
import discoverJson from './steps/5.discoverJson/index.js';

// type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
// type Effect = EffectV10 | EffectV20;
// type Item = ItemV10 | ItemV11 | ItemV20;

const main = async (props: PrismIndexStartMessage['data']) => {
  logger.info('Starting...');

  const devSilent = false;
  const silent = isIpc ? true : devSilent;

  const recreateOutput = silent ? true : await confirm('Recreate output folder?');

  const pathes = await createPathes({
    ...props,
    recreate: recreateOutput,
  });

  await validate(pathes);

  const decompiledBiffs = await decompileBiffs(pathes);

  const allJsons = await biffs2json(decompiledBiffs, pathes);
  const discovered = await discoverJson(allJsons, pathes);
  const allGhosts = await json2Ghost(allJsons, pathes);

  // await copyFile('./src/ghost/dialogueEngine/_enums.ts', join(pathes.output.ghost.dialogues, '_enums.ts'));
  await copyFile('./src/ghost/dialogueEngine/_registerNpcDialogue.ts', join(pathes.output.ghost.dialogues, '_registerNpcDialogue.ts'));
  await copyFile('./src/ghost/dialogueEngine/_translateNpcDialogue.ts', join(pathes.output.ghost.dialogues, '_translateNpcDialogue.ts'));
  await copyFile('./src/ghost/dialogueEngine/_types.ts', join(pathes.output.ghost.dialogues, '_types.ts'));

  // // await convertTwoda(pathes, all.decompiledItems.get('twoda')!);
  // // await convertAre (pathes, all.decompiledItems.get('are')!);
  // // await convertBam (pathes, all.decompiledItems.get('bam')!);
  // // await convertBcs (pathes, all.decompiledItems.get('bcs')!);
  // // await convertBmp (pathes, all.decompiledItems.get('bmp')!);
  // // await convertChu (pathes, all.decompiledItems.get('chu')!);
  // // await convertGlsl (pathes, all.decompiledItems.get('glsl')!);
  // // await convertLua (pathes, all.decompiledItems.get('lua')!);
  // // await convertMenu (pathes, all.decompiledItems.get('menu')!);
  // // await convertMos (pathes, all.decompiledItems.get('mos')!);
  // // await convertPvrz (pathes, all.decompiledItems.get('pvrz')!);
  // // await convertPro (pathes, all.decompiledItems.get('pro')!);
  // // await convertQsp (pathes, all.decompiledItems.get('qsp')!);
  // // await convertSpl (pathes, all.decompiledItems.get('spl')!);
  // // await convertSrc (pathes, all.decompiledItems.get('src')!);
  // // await convertSto (pathes, all.decompiledItems.get('sto')!);
  // // await convertTis (pathes, all.decompiledItems.get('tis')!);
  // // await convertTtf (pathes, all.decompiledItems.get('ttf')!);
  // // await convertVvc (pathes, all.decompiledItems.get('vvc')!);
  // // await convertWav (pathes, all.decompiledItems.get('wav')!);
  // // await convertWbm (pathes, all.decompiledItems.get('wbm')!);
  // // await convertWed (pathes, all.decompiledItems.get('wed')!);
  // // await convertWmp (pathes, all.decompiledItems.get('wmp')!);

  reportComplete();
  disposeReports();
};

const isIpc = !!process.send;
console.warn(isIpc ? 'Run ipc mode' : 'Run cli mode');

if (isIpc) {
  process.on('message', (msg: PrismIndexStartMessage) => {
    if (msg.type === 'start') {
      console.log(JSON.stringify(msg));
      main(msg.data).catch((e: unknown) => {
        console.error(e);
        reportError(JSON.stringify(e));
      });
    }
  });
}
else {
  main({
    weiduExe: 'D:/Games/weidu/weidu.exe',
    chitinKey: 'D:/Games/Steam/steamapps/common/Project P/CHITIN.KEY',
    ghost: 'E:/prg/snowinmars/planar-echo/planar-ghost',
    gameLanguage: 'ru_RU',
    gameName: 'pstee',
  }).catch(e => console.error(e));
}
