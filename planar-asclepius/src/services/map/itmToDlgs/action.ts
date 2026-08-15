import { itmToDlgs } from '@planar/shared';

import type { Command, Result } from './types.js';

// TODO [snow]: when you'll get, how dialogue resolvers work,
// decide, should it be async function
export default ({ itmId }: Command): Promise<Result> => {
  try {
    const dlgs = itmToDlgs(itmId);
    return Promise.resolve({
      ok: true,
      data: dlgs,
    });
  }
  catch {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'DLGS_NOT_FOUND',
        status: 404,
        message: `Dlgs ids were not found for the itm id '${itmId}'`,
      },
    });
  }
};
