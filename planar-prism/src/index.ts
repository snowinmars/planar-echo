import { confirm } from './node-ask/index.js';
import logger from './shared/logger.js';
import { disposeReports, reportComplete, reportError } from './shared/report.js';

// import convertChu from './pipes/convertChu/convertChu.js';
// import convertGlsl from './pipes/convertGlsl/convertGlsl.js';
// import convertLua from './pipes/convertLua/convertLua.js';
// import convertMenu from './pipes/convertMenu/convertMenu.js';
// import convertPro from './pipes/convertPro/convertPro.js';
// import convertQsp from './pipes/convertQsp/convertQsp.js';
// import convertSpl from './pipes/convertSpl/convertSpl.js';
// import convertSto from './pipes/convertSto/convertSto.js';
// import convertTtf from './pipes/convertTtf/convertTtf.js';
// import convertVvc from './pipes/convertVvc/convertVvc.js';
// import convertWbm from './pipes/convertWbm/convertWbm.js';
// import convertWmp from './pipes/convertWmp/convertWmp.js';

import { createPaths } from '@/steps/1.createPaths/index.js';
import { validate } from '@/steps/2.validate/index.js';
import { decompileBiffs } from '@/steps/3.decompileBiffs/index.js';
import { biffs2json } from '@/steps/4.biffs2json/index.js';
import { raw2assets } from '@/steps/4b.raw2assets/index.js';
import { json2Ghost } from '@/steps/5.json2Ghost/index.js';
import saveDiscovered from './steps/6.saveDiscovered/saveDiscovered.js';
import discoverer from './discoverer.js';
import { nothing } from '@planar/shared';

import type { Maybe, PrismIndexStartMessage } from '@planar/shared';

const isIpc = !!process.send;
logger.warn(isIpc ? 'Run ipc mode' : 'Run cli mode');

type TimeStat = {
  start: () => void;
  validate: () => void;
  doneJson: () => void;
  doneAssets: () => void;
  doneGhost: () => void;
  done: () => void;
  toString: () => string;
};

const createTimeStat = (): TimeStat => {
  let started: Maybe<Date> = nothing();
  let validated: Maybe<Date> = nothing();
  let jsonDone: Maybe<Date> = nothing();
  let assetsDone: Maybe<Date> = nothing();
  let ghostDone: Maybe<Date> = nothing();
  let done: Maybe<Date> = nothing();

  return {
    start: () => started = new Date(),
    validate: () => validated = new Date(),
    doneJson: () => jsonDone = new Date(),
    doneAssets: () => assetsDone = new Date(),
    doneGhost: () => ghostDone = new Date(),
    done: () => done = new Date(),
    toString: () => JSON.stringify({
      started,
      validated,
      jsonDone,
      assetsDone,
      ghostDone,
      done,
    }, null, 2),
  };
};

const main = async (props: PrismIndexStartMessage['data']) => {
  logger.info('Starting...');
  const timeStat = createTimeStat();
  timeStat.start();

  const devSilent = false;
  const silent = isIpc ? true : devSilent;

  const recreateOutput = silent ? true : await confirm('Recreate output directory?');

  const paths = await createPaths({
    ...props,
    recreate: recreateOutput,
  });

  await validate(paths);
  timeStat.validate();

  const decompiledBiffs = await decompileBiffs(paths);

  const allJsons = await biffs2json(decompiledBiffs, paths);
  timeStat.doneJson();

  await raw2assets(decompiledBiffs, paths, allJsons);
  timeStat.doneAssets();

  const [discover, done] = discoverer();
  await json2Ghost(allJsons, paths, discover);
  timeStat.doneGhost();

  await saveDiscovered(done(), paths, allJsons);

  reportComplete('success');
  disposeReports();

  timeStat.done();

  logger.info(`Time statistic:\n${timeStat.toString()}`);
};

if (isIpc) {
  process.on('message', (msg: PrismIndexStartMessage) => {
    if (msg.type === 'start') {
      logger.debug(JSON.stringify(msg));
      main(msg.data).catch((e: unknown) => {
        logger.error(e);
        reportError(JSON.stringify(e));
      });
    }
  });
}
else {
  main({
    weiduExeDir: 'D:/Games/weidu/weidu.exe',
    chitinKeyFile: 'D:/Games/Steam/steamapps/common/Project P/CHITIN.KEY',
    ghostDir: 'E:/prg/snowinmars/planar-echo/planar-ghost',
    prismDir: 'E:/prg/snowinmars/planar-echo/planar-prism/dist',
    gameLanguage: 'ru_RU',
    gameName: 'pstee',
  }).catch(e => logger.error(e));
}
