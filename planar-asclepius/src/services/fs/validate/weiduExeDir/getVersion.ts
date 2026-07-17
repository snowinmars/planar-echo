import { nothing } from '@planar/shared';
import { execConsole } from '@planar/shared/node';

import type { Maybe } from '@planar/shared';

type GetVersionsProps = Readonly<{
  weiduExe: string;
}>;
const weiduRegex = /^.*WeiDU version (\d+)\s*$/;
const getVersion = async ({ weiduExe }: GetVersionsProps): Promise<string> => {
  const lines = await execConsole<string>(
    `"${weiduExe}" --version`,
    (line: string): Maybe<string> => {
      const matches = weiduRegex.exec(line);
      const isTechInfo = !matches || matches.length <= 1;
      if (isTechInfo) return nothing();

      const match = matches[1];
      if (!match) return nothing();
      const version = match.trim();
      return version;
    });
  const line = lines[0];
  if (!line) throw new Error(`Cannot find weidu version using '${weiduExe}'`);
  return line;
};

export default getVersion;
