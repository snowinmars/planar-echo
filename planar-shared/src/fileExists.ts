import { access, constants } from 'fs/promises';

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath, constants.F_OK);
    return true;
  }
  catch {
    return false;
  }
};
