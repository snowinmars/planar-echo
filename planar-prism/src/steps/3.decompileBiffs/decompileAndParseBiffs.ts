import {
  normalize,
  basename,
  dirname,
  extname,
} from 'path';
import { nothing } from '@planar/shared';
import execConsole from '@/shared/execConsole.js';
import listBiffs from './listBiffs.js';

import type { Maybe } from '@planar/shared';
import type {
  Biff,
  DecompiledBiff,
  DecompiledBiffType,
  DecompileBiffsProps,
} from './types.js';

const detectDecompiledItemType = (extension: string): DecompiledBiffType => {
  switch (extension) {
    case '.2da': return '2da';
    case '.are': return 'are';
    case '.bam': return 'bam';
    case '.bcs': return 'bcs';
    case '.bmp': return 'bmp';
    case '.chu': return 'chu';
    case '.cre': return 'cre';
    case '.dlg': return 'dlg';
    case '.eff': return 'eff';
    case '.glsl': return 'glsl';
    case '.gam': return 'gam';
    case '.ids': return 'ids';
    case '.ini': return 'ini';
    case '.itm': return 'itm';
    case '.lua': return 'lua';
    case '.menu': return 'menu';
    case '.mos': return 'mos';
    case '.pvrz': return 'pvrz';
    case '.pro': return 'pro';
    case '.qsp': return 'qsp';
    case '.spl': return 'spl';
    case '.src': return 'src';
    case '.sto': return 'sto';
    case '.tis': return 'tis';
    case '.tlk': return 'tlk';
    case '.ttf': return 'ttf';
    case '.vvc': return 'vvc';
    case '.wav': return 'wav';
    case '.wbm': return 'wbm';
    case '.wed': return 'wed';
    case '.wmp': return 'wmp';
    default: throw new Error(`Cannot parse DecompiledItemType from extension '${extension}'`);
  }
};
const decompileBiffsRegex = /\[(.*?)\] created from \[(.*?)\]/;
const parseDecompiledItem = (line: string, i: number): Maybe<DecompiledBiff> => {
  const noMatches = line.startsWith('No matches for');
  if (noMatches) console.warn(`It may be ok, but: ${line}`);

  const matches = decompileBiffsRegex.exec(line.toLowerCase());
  const isTechInfo = !matches || matches.length <= 1;
  if (isTechInfo) return nothing();

  const resourceName = basename(normalize(matches[1]!.trim()));
  const fromBiffParent = basename(dirname(normalize(matches[2]!.trim())));
  const fromBiffResourceName = fromBiffParent + '/' + basename(normalize(matches[2]!.trim()));
  const type = detectDecompiledItemType(extname(resourceName) || resourceName); // there is a filename '.bcs'

  return { resourceName, fromBiffResourceName, type };
};
const getDecompileBiffsCommand = ({ weiduExeDir, gameDir, ghostDir, gameLanguage }: DecompileBiffsProps, biffs: Biff[]): string => {
  const biffNames = biffs.map(b => `${b.resourceName}`).join(' ');
  return `"${weiduExeDir}" --game "${gameDir}" --use-lang ${gameLanguage} --out "${ghostDir.decimpiledBiff.root}" --biff-get "[${biffNames}]"`;
};
const getDecompileOtherBiffsCommand = ({ weiduExeDir, gameDir, ghostDir, gameLanguage }: DecompileBiffsProps): string => {
  return `"${weiduExeDir}" --game "${gameDir}" --use-lang ${gameLanguage} --out "${ghostDir.decimpiledBiff.root}" --biff-get-rest "*"`;
};
const decompileAndParseBiffs = async (props: DecompileBiffsProps, reportProgress: (percent: number) => void): Promise<Map<DecompiledBiffType, DecompiledBiff[]>> => {
  // for some reason, unarchiving takes two steps, afais.
  const biffs: Biff[] = await listBiffs(props);
  reportProgress(3);// values that look cool in ui
  const items = await execConsole<DecompiledBiff>(getDecompileBiffsCommand(props, biffs), parseDecompiledItem);
  reportProgress(43);
  const otherItems = await execConsole<DecompiledBiff>(getDecompileOtherBiffsCommand(props), parseDecompiledItem);
  reportProgress(74);

  const unique = [...new Map([...items, ...otherItems].map(x => [x.resourceName, x])).values()];

  return Map.groupBy(unique, x => x.type);
};

export default decompileAndParseBiffs;
