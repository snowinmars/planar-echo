import type { Paths } from '@/steps/1.createPaths/index.js';
import type { ValidationResult } from './types.js';

const throwIfInvalid = (paths: Paths, validateResult: ValidationResult): void => {
  switch (validateResult.weiduExeDir) {
    case 'ok': {
      break;
    }
    case 'cannot': throw new Error(`Cannot access weidu.exe using '${paths.weiduExeDir}' path; check that file exists and has correct access rights; also make sure that the path case is right`);
    default: throw new Error(`Weidu validate result is out of range: '${validateResult.weiduExeDir}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }

  switch (validateResult.gameDir) {
    case 'ok': {
      break;
    }
    case 'cannot': throw new Error(`Cannot access binaries using '${paths.gameDir}' path; check that the path leads to the CHITIN.KEY file in the game directory and the file has correct access rights; also make sure that the path case is right`);
    default: throw new Error(`Weidu validate result is out of range: '${validateResult.gameDir}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};

export default throwIfInvalid;
