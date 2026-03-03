import { mkdir, rm } from 'fs/promises';
import type { Pathes } from 'src/shared/types.js';

const prepareOutput = async (pathes: Pathes): Promise<void> => {
  await rm(pathes.output.root, { recursive: true });
  await mkdir(pathes.output.root);
  await mkdir(pathes.output.decimpiledBiff);
  await mkdir(pathes.output.jsonDialogues, { recursive: true });
  await mkdir(pathes.output.jsonItems, { recursive: true });
  await mkdir(pathes.output.jsonIds, { recursive: true });
  await mkdir(pathes.output.jsonCreatures, { recursive: true });
  await mkdir(pathes.output.jsonEffects, { recursive: true });
};

export default prepareOutput;
