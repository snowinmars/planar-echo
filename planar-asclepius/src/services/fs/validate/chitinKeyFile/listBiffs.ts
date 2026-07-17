import { nothing } from '@planar/shared';
import { execConsole } from '@planar/shared/node';

import type { GameLanguage, Maybe } from '@planar/shared';

type ListBiffsProps = Readonly<{
  weiduExe: string;
  gameDir: string;
  gameLanguage: GameLanguage;
}>;
const listBiffsRegex = /\[(.*?)\]\s+(\d+) bytes.*/;
const listBiffs = async ({ weiduExe, gameDir, gameLanguage }: ListBiffsProps): Promise<string[]> => execConsole<string>(
  `"${weiduExe}" --game "${gameDir}" --list-biffs --use-lang ${gameLanguage}`,
  (line: string): Maybe<string> => {
    const matches = listBiffsRegex.exec(line);
    const isTechInfo = !matches || matches.length <= 1;
    if (isTechInfo) return nothing();

    const match = matches[1];
    if (!match) return nothing();
    const resourceName = match.trim();
    return resourceName;
  });

export default listBiffs;
