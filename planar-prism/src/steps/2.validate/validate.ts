import type { Pathes } from '../1.createPathes/index.js';
import type { GameFolderValidateResult, ValidateResult, WeiduValidateResult } from './types.js';

const weiduIsOk = async (weiduExePath: string): Promise<boolean> => {
  return true;
};

const binariesAreOk = async (chitinKeyPath: string): Promise<boolean> => {
  return true;
};

type ValidateProps = Readonly<{
  weiduExe: Pathes['weiduExe'];
  gameFolder: Pathes['gameFolder'];
}>;

const validate = async (props: ValidateProps): Promise<ValidateResult> => {
  let weiduValidationResult: WeiduValidateResult = 'cannot';
  const isWeiduOk = await weiduIsOk(props.weiduExe);
  if (isWeiduOk) weiduValidationResult = 'ok';
  // if (isWeiduOk) logger.info(`Weidu is ok at '${pathes.weiduExe}'`); else throw new Error(`Cannot access weidu.exe using '${pathes.weiduExe}' path; check that file exists and has correct access rights; also make sure that the path case is right`);

  let gameFolderValidateResult: GameFolderValidateResult = 'cannot';
  const areBinariesOk = await binariesAreOk(props.gameFolder);
  if (areBinariesOk) gameFolderValidateResult = 'ok';
  // if (areBinariesOk) logger.info(`Game is ok at '${pathes.gameFolder}'`); else throw new Error(`Cannot access binaries using '${binariesAreOk}' path; check that the path leads to the CHITIN.KEY file in the game folder and the file has correct access rights; also make sure that the path case is right`);

  return {
    weidu: weiduValidationResult,
    gameFolder: gameFolderValidateResult,
  };
};

export default validate;
