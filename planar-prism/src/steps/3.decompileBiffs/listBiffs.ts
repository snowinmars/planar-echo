import { execConsole } from '@planar/shared/node';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { ListBiffsProps, Biff } from './types.js';

const listBiffsRegex = /\[(.*?)\]\s+(\d+) bytes.*/;
const parseBiff = (line: string): Maybe<Biff> => {
  const matches = listBiffsRegex.exec(line);
  const isTechInfo = !matches || matches.length <= 1;
  if (isTechInfo) return nothing();

  const resourceName = matches[1]!.trim();
  const sizeBytes = parseInt(matches[2]!.trim());
  return { resourceName, sizeBytes };
};
const getListBiffsCommand = ({ weiduExeDir, gameDir, gameLanguage }: ListBiffsProps): string => `"${weiduExeDir}" --game "${gameDir}" --list-biffs --use-lang ${gameLanguage}`;
const listBiffs = async (props: ListBiffsProps): Promise<Biff[]> => execConsole<Biff>(getListBiffsCommand(props), parseBiff);

export default listBiffs;
