import execConsole from '../../../../shared/execConsole';
import { nothing } from '../../../../shared/maybe';

import type { Maybe } from '../../../../shared/maybe';

type ListBiffsProps = Readonly<{
  weiduExe: string;
  gameFolder: string;
  lang: string;
}>;
const listBiffsregex = /\[(.*?)\]\s+(\d+) bytes.*/;
const listBiffs = async ({ weiduExe, gameFolder, lang }: ListBiffsProps): Promise<string[]> => execConsole<string>(
  `"${weiduExe}" --game "${gameFolder}" --list-biffs --use-lang ${lang}`,
  (line: string): Maybe<string> => {
    const matches = listBiffsregex.exec(line);
    const isTechInfo = !matches || matches.length <= 1;
    if (isTechInfo) return nothing();

    const resourceName = matches[1].trim();
    return resourceName;
  });

export default listBiffs;
