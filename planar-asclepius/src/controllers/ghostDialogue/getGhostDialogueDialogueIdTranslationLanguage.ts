import {join} from 'path';
import fileExists from '../../helpers/fileExists';
import {ghostDir} from '../../helpers/folders'
import type { Request, Response } from 'express';

type GetGhostDialogueDialogueIdTranslationLanguageProps = Readonly<{
  dialogueId: string;
  language: string;
}>

const getGhostDialogueDialogueIdTranslationLanguage = async (req: Request<GetGhostDialogueDialogueIdTranslationLanguageProps>, res: Response) => {
  const {dialogueId, language} = req.params;
  if (!dialogueId) return res.status(400).json({error: 'wrong route: dialogueId is required'});
  if (!language) return res.status(400).json({error: 'wrong route: language is required'});

  const translatedDialoguePath = join(ghostDir, 'ghost', 'dialogues', `${dialogueId}Dialogue_${language}.ghost`);
  const canResponse = await fileExists(translatedDialoguePath);
  if (canResponse) return res.sendFile(translatedDialoguePath);

  res.status(400).json({ error: `File ${dialogueId} for language ${language} is not found` });
}

export default getGhostDialogueDialogueIdTranslationLanguage;
