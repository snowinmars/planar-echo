import type { Pathes } from '@/steps/1.createPathes/index.js';
import throwIfInvalid from './throwIfInvaliid.js';
import type {
  GameDirValidateResult,
  ValidationResult,
  WeiduExeDirValidateResult,
} from './types.js';

const weiduIsOk = async (weiduExeDir: string): Promise<boolean> => {
  return true;
};

const binariesAreOk = async (chitinKeyFile: string): Promise<boolean> => {
  return true;
};

export const validate = async (pathes: Pathes): Promise<void> => {
  let weiduExeDirValidationResult: WeiduExeDirValidateResult = 'cannot';
  const isWeiduOk = await weiduIsOk(pathes.weiduExeDir);
  if (isWeiduOk) weiduExeDirValidationResult = 'ok';

  let gameDirValidateResult: GameDirValidateResult = 'cannot';
  const areBinariesOk = await binariesAreOk(pathes.gameDir);
  if (areBinariesOk) gameDirValidateResult = 'ok';

  const validationResult: ValidationResult = {
    weiduExeDir: weiduExeDirValidationResult,
    gameDir: gameDirValidateResult,
  };

  throwIfInvalid(pathes, validationResult);
};
