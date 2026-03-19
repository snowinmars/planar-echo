import {join} from 'path';
import fileExists from '../../helpers/fileExists';
import {ghostDir} from '../../helpers/folders'
import type { Request, Response } from 'express';

type GetGhostDialogueDialogueIdSkeletonProps = Readonly<{
  dialogueId: string;
}>

const getGhostDialogueDialogueIdSkeleton = async (req: Request<GetGhostDialogueDialogueIdSkeletonProps>, res: Response) => {
  const {dialogueId} = req.params;
  if (!dialogueId) return res.status(400).json({error: 'wrong route: dialogueId is required'});

  const dialogueSkeletonPath = join(ghostDir, 'ghost', 'dialogues', `${dialogueId}DialogueSkeleton.ghost`);
  const canResponse = await fileExists(dialogueSkeletonPath);
  if (canResponse) return res.sendFile(dialogueSkeletonPath);

  res.status(400).json({ error: `File ${dialogueId} is not found` });
}

export default getGhostDialogueDialogueIdSkeleton;
