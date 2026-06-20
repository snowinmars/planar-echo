import { getGhostDir } from '../storage.js';

import type { Result } from './types.js';

export default (): Promise<Result> => {
  return Promise.resolve({
    ok: true,
    data: {
      ghostDir: getGhostDir(),
    },
  });
};
