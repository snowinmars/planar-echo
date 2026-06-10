import { creatureToDialogues } from '@planar/shared';

import type { Command, Result } from './types.js';

export default async ({ creatureId }: Command): Promise<Result> => {
  try {
    const dialogues = creatureToDialogues(creatureId);
    return {
      ok: true,
      data: dialogues,
    };
  }
  catch {
    return {
      ok: false,
      error: {
        code: 'DIALOGUES_NOT_FOUND',
        status: 404,
        message: `Dialogues ids were not found for the creature id '${creatureId}'`,
      },
    };
  }
};
