import { join, normalize, dirname } from 'path';
import { readFile, writeFile } from 'fs/promises';

import { confirm } from './node-ask/index.js';
import weiduIsOk from './pipes/validate/weiduIsOk.js';
import binariesAreOk from './pipes/validate/binariesAreOk.js';
import prepareOutput from './pipes/validate/prepareOutput.js';
import { DecompiledItemType, Lang } from './shared/types.js';
import decompileBiffs from './pipes/decompileBiffs.js';
import logger from './shared/logger.js';

import convertTwoda from './pipes/convertTwoda/convertTwoda.js';
import convertAre from './pipes/convertAre/convertAre.js';
import convertBam from './pipes/convertBam/convertBam.js';
import convertBcs from './pipes/convertBcs/convertBcs.js';
import convertBmp from './pipes/convertBmp/convertBmp.js';
import convertChu from './pipes/convertChu/convertChu.js';
import convertCre from './pipes/convertCre/convertCre.js';
import convertDlg from './pipes/convertDlg/convertDlg.js';
import convertEff from './pipes/convertEff/convertEff.js';
import convertGlsl from './pipes/convertGlsl/convertGlsl.js';
import convertIds from './pipes/convertIds/convertIds.js';
import convertIni from './pipes/convertIni/convertIni.js';
import convertItm from './pipes/convertItm/convertItm.js';
import convertLua from './pipes/convertLua/convertLua.js';
import convertMenu from './pipes/convertMenu/convertMenu.js';
import convertMos from './pipes/convertMos/convertMos.js';
import convertPvrz from './pipes/convertPvrz/convertPvrz.js';
import convertPro from './pipes/convertPro/convertPro.js';
import convertQsp from './pipes/convertQsp/convertQsp.js';
import convertSpl from './pipes/convertSpl/convertSpl.js';
import convertSrc from './pipes/convertSrc/convertSrc.js';
import convertSto from './pipes/convertSto/convertSto.js';
import convertTis from './pipes/convertTis/convertTis.js';
import convertTtf from './pipes/convertTtf/convertTtf.js';
import convertVvc from './pipes/convertVvc/convertVvc.js';
import convertWav from './pipes/convertWav/convertWav.js';
import convertWbm from './pipes/convertWbm/convertWbm.js';
import convertWed from './pipes/convertWed/convertWed.js';
import convertWmp from './pipes/convertWmp/convertWmp.js';

import type { DecompiledItem, Pathes } from './shared/types.js';
import convertTlk from './pipes/convertTlk/convertTlk.js';

const logPercent = (x: number): void => {
  logger.info(`Done ${x}%`);
};
const createPathes = (lang: Lang): Pathes => {
  const weiduExePath = normalize('D:/Games/weidu/weidu.exe');
  const chitinKeyPath = normalize('D:/Games/Steam/steamapps/common/Project P/CHITIN.KEY');
  const gameFolder = normalize(dirname(chitinKeyPath));
  const tlkPath = normalize(join(gameFolder, 'lang', lang.toString(), 'dialog.tlk'));
  const outputPath = normalize('E:/prg/snowinmars/iexo/echo');
  const decimpiledBiff = normalize(join(outputPath, 'decimpiledBiff'));
  const decimpiledBiffJson = normalize(join(decimpiledBiff, 'output.json'));
  const jsonDialogues = normalize(join(outputPath, 'json', 'dialogues'));

  return {
    weidu: weiduExePath,
    game: gameFolder,
    tlkPath,
    lang,
    output: {
      root: outputPath,
      decimpiledBiff,
      decimpiledBiffJson,
      jsonDialogues,
    },
  };
};

const asky = true; // ask questions about every step
const pathes = createPathes(Lang.en);

Promise.resolve()
  .then(async () => {
    const isWeiduOk = await weiduIsOk(pathes.weidu);
    if (isWeiduOk) logger.info(`Weidu is ok at '${pathes.weidu}'`); else throw new Error(`Cannot access weidu.exe using '${pathes.weidu}' path; check that file exists and has correct access rights; also make sure that the path case is right`);

    const areBinariesOk = await binariesAreOk(pathes.game);
    if (areBinariesOk) logger.info(`Game is ok at '${pathes.game}'`); else throw new Error(`Cannot access binaries using '${binariesAreOk}' path; check that the path leads to the CHITIN.KEY file in the game folder and the file has correct access rights; also make sure that the path case is right`);

    const clearOutput = asky ? await confirm('Clear outout folder? If you are a user - choose \'y\', if you are dev - decide for yourself') : true;
    if (clearOutput) {
      logger.info(`Clearing output folder '${pathes.output.root}'`);
      await prepareOutput(pathes);
    }

    ///
    logger.info('Starting...');
    ///

    let decompiledItems: DecompiledItem[];
    const doDecompileBiffs = asky ? await confirm('Do decompiling biffs step?') : true;
    if (doDecompileBiffs) {
      logger.info(`Decompiling biffs archives from '${pathes.game}' to '${pathes.output.decimpiledBiff}'; might take a while`);
      const decompileBiffsStarted = new Date();
      decompiledItems = await decompileBiffs(pathes, logPercent);
      await writeFile(pathes.output.decimpiledBiffJson, JSON.stringify(decompiledItems, null, 2), { encoding: 'utf8' });
      const decompileBiffsTookSec = Math.round((new Date().getTime() - decompileBiffsStarted.getTime()) / 1000);
      logger.info(`Decompiled ${decompiledItems.length} items from '${pathes.game}' biff archives to '${pathes.output.decimpiledBiff}'; took ${decompileBiffsTookSec} seconds; save output to ${pathes.output.decimpiledBiffJson}`);
    }
    else {
      const json = await readFile(pathes.output.decimpiledBiffJson, { encoding: 'utf8' });
      decompiledItems = JSON.parse(json);
      logger.info(`Restore decompilation state from ${pathes.output.decimpiledBiffJson}`);
    }

    logger.info(`Converting tlks to json...`);
    const tlk = await convertTlk(pathes);
    writeFile(join(pathes.output.jsonDialogues, 'dialog.tlk'), JSON.stringify(tlk, null, 2), { encoding: 'utf8' });

    await convertTwoda(pathes, decompiledItems.filter(x => x.type === DecompiledItemType.twoda));
    await convertAre (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.are));
    await convertBam (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.bam));
    await convertBcs (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.bcs));
    await convertBmp (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.bmp));
    await convertChu (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.chu));
    await convertCre (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.cre));

    logger.info(`Converting dlgs to json...`);
    const npcDialogues = await convertDlg(pathes, decompiledItems.filter(x => x.type === DecompiledItemType.dlg), tlk, logPercent);
    for (const npcDialogue of npcDialogues) {
      await writeFile(join(pathes.output.jsonDialogues, npcDialogue.resourceName), JSON.stringify(npcDialogue, null, 2), { encoding: 'utf8' });
    }

    await convertEff (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.eff));
    await convertGlsl (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.glsl));
    await convertIds (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.ids));
    await convertIni (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.ini));
    await convertItm (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.itm));
    await convertLua (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.lua));
    await convertMenu (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.menu));
    await convertMos (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.mos));
    await convertPvrz (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.pvrz));
    await convertPro (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.pro));
    await convertQsp (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.qsp));
    await convertSpl (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.spl));
    await convertSrc (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.src));
    await convertSto (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.sto));
    await convertTis (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.tis));
    await convertTtf (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.ttf));
    await convertVvc (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.vvc));
    await convertWav (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.wav));
    await convertWbm (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.wbm));
    await convertWed (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.wed));
    await convertWmp (pathes, decompiledItems.filter(x => x.type === DecompiledItemType.wmp));
  });
