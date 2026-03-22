import { join } from 'path';
import { readFile } from 'fs/promises';
import fileExists from '../../../../../shared/fileExists';
import type { Command, Result } from './types';

export default async ({
  dialogueId,
  language,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedDialoguePath = join(ghostDir, 'ghost', 'dialogues', `${dialogueId}Dialogue_${language}.ghost`);
  const found = await fileExists(translatedDialoguePath);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton '${dialogueId}' is not found at '${translatedDialoguePath}'`,
      },
    };
  };

  const content = await readFile(translatedDialoguePath, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content },
  };
};
