import execConsole from '../shared/execConsole.js';

import type { Pathes, Biff } from '../shared/types.js';

const regex = /\[(.*?)\]\s+(\d+) bytes.*/;
const getCommand = ({ weidu, game, lang }: Pathes): string => `"${weidu}" --game "${game}" --list-biffs --use-lang ${lang}`;
const listBiffs = async (pathes: Pathes): Promise<Biff[]> => execConsole<Biff>(getCommand(pathes), (line) => {
  const matches = regex.exec(line);
  const isTechInfo = !matches || matches.length <= 1;
  if (isTechInfo) return null;
  const name = matches![1]!.trim();
  const sizeBytes = parseInt(matches![2]!.trim());
  return { name, sizeBytes };
});

export default listBiffs;
