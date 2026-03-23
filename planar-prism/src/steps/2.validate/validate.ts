import type { Pathes } from '@/steps/1.createPathes/index.js';
import throwIfInvalid from './throwIfInvaliid.js';
import type {
  GameFolderValidateResult,
  ValidationResult,
  WeiduValidateResult,
} from './types.js';

const weiduIsOk = async (weiduExePath: string): Promise<boolean> => {
  return true;
};

const binariesAreOk = async (chitinKeyPath: string): Promise<boolean> => {
  return true;
};

const validate = async (pathes: Pathes): Promise<void> => {
  let weiduValidationResult: WeiduValidateResult = 'cannot';
  const isWeiduOk = await weiduIsOk(pathes.weiduExe);
  if (isWeiduOk) weiduValidationResult = 'ok';

  let gameFolderValidateResult: GameFolderValidateResult = 'cannot';
  const areBinariesOk = await binariesAreOk(pathes.gameFolder);
  if (areBinariesOk) gameFolderValidateResult = 'ok';

  const validationResult: ValidationResult = {
    weidu: weiduValidationResult,
    gameFolder: gameFolderValidateResult,
  };

  throwIfInvalid(pathes, validationResult);
};

export default validate;
