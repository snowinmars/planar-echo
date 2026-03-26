import { nothing } from '@planar/shared';
import { execConsole } from '@planar/shared/node';

import type { GameLanguage, Maybe } from '@planar/shared';

type ListBiffsProps = Readonly<{
  weiduExe: string;
  gameFolder: string;
  gameLanguage: GameLanguage;
}>;
const listBiffsregex = /\[(.*?)\]\s+(\d+) bytes.*/;
const listBiffs = async ({ weiduExe, gameFolder, gameLanguage }: ListBiffsProps): Promise<string[]> => execConsole<string>(
  `"${weiduExe}" --game "${gameFolder}" --list-biffs --use-lang ${gameLanguage}`,
  (line: string): Maybe<string> => {
    const matches = listBiffsregex.exec(line);
    const isTechInfo = !matches || matches.length <= 1;
    if (isTechInfo) return nothing();

    const resourceName = matches[1].trim();
    return resourceName;
  });

export default listBiffs;
