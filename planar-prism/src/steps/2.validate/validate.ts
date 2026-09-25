import throwIfInvalid from './throwIfInvalid.js';

import type { Paths } from '@/steps/1.createPaths/index.js';

import type {
  GameDirValidateResult,
  ValidationResult,
  WeiduExeDirValidateResult,
} from './types.js';

const weiduIsOk = (weiduExeDir: string): Promise<boolean> => {
  void weiduExeDir;
  return Promise.resolve(true);
};

const binariesAreOk = (chitinKeyFile: string): Promise<boolean> => {
  void chitinKeyFile;
  return Promise.resolve(true);
};

export const validate = async (paths: Paths): Promise<void> => {
  let weiduExeDirValidationResult: WeiduExeDirValidateResult = 'cannot';
  const isWeiduOk = await weiduIsOk(paths.weiduExeDir);
  if (isWeiduOk) weiduExeDirValidationResult = 'ok';

  let gameDirValidateResult: GameDirValidateResult = 'cannot';
  const areBinariesOk = await binariesAreOk(paths.gameDir);
  if (areBinariesOk) gameDirValidateResult = 'ok';

  const validationResult: ValidationResult = {
    weiduExeDir: weiduExeDirValidationResult,
    gameDir: gameDirValidateResult,
  };

  throwIfInvalid(paths, validationResult);
};
