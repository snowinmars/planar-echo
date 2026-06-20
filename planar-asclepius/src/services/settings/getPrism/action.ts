import { getPrismDir } from '../storage.js';

import type { Result } from './types.js';

export default (): Promise<Result> => {
  return Promise.resolve({
    ok: true,
    data: {
      prismDir: getPrismDir(),
    },
  });
};
