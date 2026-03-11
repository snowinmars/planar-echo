import { mkdir, rm } from 'fs/promises';
import type { Pathes } from 'src/shared/types.js';

const prepareOutput = async (pathes: Pathes): Promise<void> => {
  await rm(pathes.output.root, { recursive: true });
  await mkdir(pathes.output.root);
  await mkdir(pathes.output.decimpiledBiff.root);

  await mkdir(pathes.output.json.dialogues, { recursive: true });
  await mkdir(pathes.output.json.items, { recursive: true });
  await mkdir(pathes.output.json.ids, { recursive: true });
  await mkdir(pathes.output.json.inis, { recursive: true });
  await mkdir(pathes.output.json.creatures, { recursive: true });
  await mkdir(pathes.output.json.effects, { recursive: true });

  await mkdir(pathes.output.ghost.dialogues, { recursive: true });
  await mkdir(pathes.output.ghost.items, { recursive: true });
  await mkdir(pathes.output.ghost.ids, { recursive: true });
  await mkdir(pathes.output.ghost.inis, { recursive: true });
  await mkdir(pathes.output.ghost.creatures, { recursive: true });
  await mkdir(pathes.output.ghost.effects, { recursive: true });
};

export default prepareOutput;
