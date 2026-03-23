import execConsole from '@/shared/execConsole.js';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { ListBiffsProps, Biff } from './types.js';

const listBiffsregex = /\[(.*?)\]\s+(\d+) bytes.*/;
const parseBiff = (line: string): Maybe<Biff> => {
  const matches = listBiffsregex.exec(line);
  const isTechInfo = !matches || matches.length <= 1;
  if (isTechInfo) return nothing();

  const resourceName = matches[1]!.trim();
  const sizeBytes = parseInt(matches[2]!.trim());
  return { resourceName, sizeBytes };
};
const getListBiffsCommand = ({ weiduExe, gameFolder, gameLanguage }: ListBiffsProps): string => `"${weiduExe}" --game "${gameFolder}" --list-biffs --use-lang ${gameLanguage}`;
const listBiffs = async (props: ListBiffsProps): Promise<Biff[]> => execConsole<Biff>(getListBiffsCommand(props), parseBiff);

export default listBiffs;
