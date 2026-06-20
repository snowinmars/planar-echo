import { join } from 'path';
import { readFile } from 'fs/promises';
import { fileExists } from '@planar/shared/node';
import type { Command, Result } from './types.js';

export default async ({
  dialogueId,
  gameLanguage,
  ghostDir,
}: Command): Promise<Result> => {
  const translatedDialogueDir = join(ghostDir, 'ghost', 'dialogues', 'dist', `${dialogueId}.${gameLanguage}.js`);
  const found = await fileExists(translatedDialogueDir);
  if (!found) {
    return {
      ok: false,
      error: {
        code: 'FILE_NOT_FOUND',
        status: 404,
        message: `Skeleton translation '${dialogueId}' is not found at '${translatedDialogueDir}'`,
      },
    };
  };

  const content = await readFile(translatedDialogueDir, { encoding: 'utf-8' });
  return {
    ok: true,
    data: { content: `/*${translatedDialogueDir}*/\n${content}` },
  };
};
