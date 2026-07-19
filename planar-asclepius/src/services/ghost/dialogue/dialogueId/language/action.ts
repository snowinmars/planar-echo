import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  dialogueId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedDialogueFile = join(ghostDir, 'ghost', 'dialogues', 'dist', `${dialogueId}.${gameLanguage}.js`);
  const found = await fileExists(translatedDialogueFile);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${dialogueId}' is not found at '${translatedDialogueFile}'`,
      },
    };
  };

  const content = await readFile(translatedDialogueFile, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedDialogueFile}*/\n${content}` },
  };
};
