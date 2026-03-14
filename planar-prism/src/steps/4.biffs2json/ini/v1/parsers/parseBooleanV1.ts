import type { Maybe } from '../../../../../shared/maybe.js';

const parseBooleanV1 = (s: Maybe<string>): boolean => {
  if (!s) throw new Error(`Cannot parse Boolean from nothing`);

  switch (s.toLowerCase()) {
    case '0':
    case 'false':
      return false;
    case '1':
    case 'true':
      return true;
    default: throw new Error(`Cannot parse Boolean from '${s}'`);
  }
};

export default parseBooleanV1;
