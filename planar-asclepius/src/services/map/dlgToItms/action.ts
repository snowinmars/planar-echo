import { dlgToItms } from '@planar/shared';

import type { Command, Result } from './types.js';

// TODO [snow]: when you'll get, how dialogue resolvers work,
// decide, should it be async function
export default ({ dlgId }: Command): Promise<Result> => {
  try {
    const dlgs = dlgToItms(dlgId);
    return Promise.resolve({
      ok: true,
      data: dlgs,
    });
  }
  catch {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'ITM_NOT_FOUND',
        status: 404,
        message: `Itm id was not found for the dlg id '${dlgId}'`,
      },
    });
  }
};
