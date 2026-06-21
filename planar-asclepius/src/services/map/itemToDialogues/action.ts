import { itemToDialogues } from '@planar/shared';

import type { Command, Result } from './types.js';

// TODO [snow]: when you'll get, how dialogue resolvers work,
// decide, should it be async function
export default ({ itemId }: Command): Promise<Result> => {
  try {
    const dialogues = itemToDialogues(itemId);
    return Promise.resolve({
      ok: true,
      data: dialogues,
    });
  }
  catch {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'DIALOGUES_NOT_FOUND',
        status: 404,
        message: `Dialogues ids were not found for the item id '${itemId}'`,
      },
    });
  }
};
