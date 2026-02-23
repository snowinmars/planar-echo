import { mkdir, rm } from 'fs/promises';
import type { Pathes } from 'src/shared/types.js';

const prepareOutput = async (pathes: Pathes): Promise<void> => {
  await rm(pathes.output.root, { recursive: true });
  await mkdir(pathes.output.root);
  await mkdir(pathes.output.decimpiledBiff);
  await mkdir(pathes.output.jsonDialogues, { recursive: true });
};

export default prepareOutput;
