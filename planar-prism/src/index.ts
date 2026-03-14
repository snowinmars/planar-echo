import { join } from 'path';
import {
  writeFile,
} from 'fs/promises';

import { confirm } from './node-ask/index.js';
import logger from './shared/logger.js';
import { jsonStringify } from './shared/json.js';

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

import createPathes, { type Pathes } from './steps/1.createPathes/index.js';
import type { ValidateResult } from './steps/2.validate/index.js';
import validate from './steps/2.validate/index.js';
import decompileBiffs from './steps/3.decompileBiffs/index.js';
import biffs2json from './steps/4.biffs2json/index.js';
import { saveToFile } from './shared/customFs.js';
import type { LogPercent } from './shared/types.js';

// type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
// type Effect = EffectV10 | EffectV20;
// type Item = ItemV10 | ItemV11 | ItemV20;

const silent = false;

const throwIfInvalid = (pathes: Pathes, validateResult: ValidateResult): void => {
  switch (validateResult.weidu) {
    case 'ok': {
      logger.info(`Weidu is ok at '${pathes.weiduExe}'`);
      break;
    }
    case 'cannot': throw new Error(`Cannot access weidu.exe using '${pathes.weiduExe}' path; check that file exists and has correct access rights; also make sure that the path case is right`);
    default: throw new Error(`Weidu validate result is out of range: '${validateResult.weidu}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }

  switch (validateResult.gameFolder) {
    case 'ok': {
      logger.info(`Game is ok at '${pathes.gameFolder}'`);
      break;
    }
    case 'cannot': throw new Error(`Cannot access binaries using '${pathes.gameFolder}' path; check that the path leads to the CHITIN.KEY file in the game folder and the file has correct access rights; also make sure that the path case is right`);
    default: throw new Error(`Weidu validate result is out of range: '${validateResult.gameFolder}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};

(async () => {
  logger.info('Starting...');

  const recreateOutput = silent ? true : await confirm('Recreate output folder?');

  const pathes = await createPathes({
    weiduExe: 'D:/Games/weidu/weidu.exe',
    chitinKey: 'D:/Games/Steam/steamapps/common/Project P/CHITIN.KEY',
    ghost: 'C:/Users/tkachenkoda2/source/repos/planar-echo/planar-ghost',
    lang: 'ru_RU',
    gameName: 'pstee',
    recreate: recreateOutput,
  });

  const validateResult = await validate(pathes);
  throwIfInvalid(pathes, validateResult);

  const decompiledBiffs = await decompileBiffs(pathes);

  const all = await biffs2json(decompiledBiffs, pathes);

  // logger.info(`Converting ini to json...`);
  // const iniIterator = await convertIni (pathes, all.decompiledItems.get('ini'), logPercent);
  // for await (const ini of iniIterator) {
  //   if (!ini) continue;
  //   all.inis.push(ini);
  //   await writeFile(join(pathes.output.json.inis, ini.resourceName), jsonStringify(ini), { encoding: 'utf8' });
  // }

  // logger.info(`Converting cre to json...`);
  // const creaturesIterator = await convertCre(pathes, all.decompiledItems.get('cre'), all.tlk, all.ids, logPercent);
  // for await (const creature of creaturesIterator) {
  //   if (!creature) continue; // TODO [snow]: remove after implementing all creature parsers
  //   all.creatures.push(creature);
  //   await writeFile(join(pathes.output.json.creatures, creature.resourceName), jsonStringify(creature), { encoding: 'utf8' });
  // }

  // logger.info(`Converting dlgs to json...`);
  // const npcDialoguesIterator = await convertDlg(pathes, all.decompiledItems.get('dlg'), all.tlk, logPercent);
  // for await (const npcDialogue of npcDialoguesIterator) {
  //   all.npcDialogues.push(npcDialogue);
  //   await writeFile(join(pathes.output.json.dialogues, npcDialogue.resourceName), jsonStringify(npcDialogue), { encoding: 'utf8' });
  // }

  // logger.info(`Converting eff to json...`);
  // const effectsIterator = await convertEff(pathes, all.decompiledItems.get('eff'), all.tlk, logPercent);
  // for await (const effect of effectsIterator) {
  //   all.effects.push(effect);
  //   await writeFile(join(pathes.output.json.effects, effect.resourceName), jsonStringify(effect), { encoding: 'utf8' });
  // }

  // const itemsIterator = await convertItm(pathes, all.decompiledItems.get('itm'), all.tlk, logPercent);
  // for await (const item of itemsIterator) {
  //   all.items.push(item);
  //   await writeFile(join(pathes.output.json.items, item.resourceName), jsonStringify(item), { encoding: 'utf8' });
  // }

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

  // const zeroPatchedNpdDialogues = zeroPatch(all.npcDialogues);
  // const x = await buildDialogueSkeletons(zeroPatchedNpdDialogues, logPercent);
  // const y = await translateDialogues(zeroPatchedNpdDialogues, all.creatures, 'ru_RU', logPercent);
  // await writeFile(join(pathes.output.json.dialogues, `${x[0]!.resourceName}.ghost.ts`), x[0]!.content, { encoding: 'utf8' });
  // await writeFile(join(pathes.output.json.dialogues, `${y[0]!.resourceName}.ghost.ts`), y[0]!.content, { encoding: 'utf8' });
})().catch(e => logger.error(e));
