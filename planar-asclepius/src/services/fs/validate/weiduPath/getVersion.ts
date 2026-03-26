import { nothing } from '@planar/shared';
import { execConsole } from '@planar/shared/node';

import type { Maybe } from '@planar/shared';

type GetVerionsProps = Readonly<{
  weiduExe: string;
}>;
const listBiffsregex = /^.*WeiDU version (\d+)\s*$/;
const getVersion = async ({ weiduExe }: GetVerionsProps): Promise<string> => {
  const lines = await execConsole<string>(
    `"${weiduExe}" --version`,
    (line: string): Maybe<string> => {
      const matches = listBiffsregex.exec(line);
      const isTechInfo = !matches || matches.length <= 1;
      if (isTechInfo) return nothing();

      const version = matches[1].trim();
      return version;
    });
  return lines[0];
};

export default getVersion;
