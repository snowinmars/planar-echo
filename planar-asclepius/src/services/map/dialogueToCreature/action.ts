import { dialogueToCreature } from '@planar/shared';

import type { Command, Result } from './types.js';

export default async ({ dialogueId }: Command): Promise<Result> => {
  try {
    const dialogues = dialogueToCreature(dialogueId);
    return {
      ok: true,
      data: dialogues,
    };
  }
  catch {
    return {
      ok: false,
      error: {
        code: 'CREATURE_NOT_FOUND',
        status: 404,
        message: `Creature id was not found for the dialogue id '${dialogueId}'`,
      },
    };
  }
};
