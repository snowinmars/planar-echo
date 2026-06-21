import { dialogueToItems } from '@planar/shared';

import type { Command, Result } from './types.js';

// TODO [snow]: when you'll get, how dialogue resolvers work,
// decide, should it be async function
export default ({ dialogueId }: Command): Promise<Result> => {
  try {
    const dialogues = dialogueToItems(dialogueId);
    return Promise.resolve({
      ok: true,
      data: dialogues,
    });
  }
  catch {
    return Promise.resolve({
      ok: false,
      error: {
        code: 'ITEM_NOT_FOUND',
        status: 404,
        message: `Item id was not found for the dialogue id '${dialogueId}'`,
      },
    });
  }
};
