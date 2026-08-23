import { basename } from 'path';
import { walkFiles } from '../shared/walkFiles.js';

export type AcmFile = Readonly<{
  resourceName: string;
  absPath: string;
}>;
export const collectAcmFiles = async (musicDir: string): Promise<AcmFile[]> => {
  const files = await walkFiles(musicDir);
  return files
    .filter(path => path.toLowerCase().endsWith('.acm'))
    .map((absPath) => {
      return {
        resourceName: basename(absPath),
        absPath,
      };
    });
};
