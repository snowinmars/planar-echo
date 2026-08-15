import {
  normalize,
  basename,
  dirname,
  extname,
} from 'path';
import { nothing } from '@planar/shared';
import { execConsole } from '@planar/shared/node';

import type { Maybe } from '@planar/shared';
import type {
  DecompiledBiff,
  DecompiledBiffType,
  DecompileBiffsProps,
} from './types.js';
import logger from '@/shared/logger.js';

const detectDecompiledBiffType = (extension: string): DecompiledBiffType => {
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
    default: throw new Error(`Cannot parse decompiled biff type from extension '${extension}'`);
  }
};
const decompileBiffsRegex = /\[(.*?)\] created from \[(.*?)\]/;
const parseDecompiledBiff = (line: string, i: number): Maybe<DecompiledBiff> => {
  const noMatches = line.startsWith('No matches for');
  if (noMatches) logger.warn(`It may be ok, but: '${line}'`);

  const matches = decompileBiffsRegex.exec(line.toLowerCase());
  const isTechInfo = !matches || matches.length <= 1;
  if (isTechInfo) return nothing();

  const resourceName = basename(normalize(matches[1]!.trim()));
  const fromBiffParent = basename(dirname(normalize(matches[2]!.trim())));
  const fromBiffResourceName = fromBiffParent + '/' + basename(normalize(matches[2]!.trim()));
  const type = detectDecompiledBiffType(extname(resourceName) || resourceName); // there is a filename '.bcs'

  return { resourceName, fromBiffResourceName, type };
};

const decompileAndParseBiffs = async (props: DecompileBiffsProps, reportProgress: (percent: number) => void): Promise<Map<DecompiledBiffType, DecompiledBiff[]>> => {
  const {
    weiduExeDir,
    gameDir,
    ghostDir,
    tlkDir,
  } = props;

  reportProgress(3);
  // WeiDU on Windows uses MSVC CRT argv wildcard expansion: `.*` becomes `..` and aborts. So use `.+` (same “all resources” intent, no `*` / `?` for the CRT to expand).
  // Prefer --tlkin over --use-lang: WeiDU lowercases lang_dir and then fails to match `ru_RU`/`en_US` folders.
  const biffs = await execConsole<DecompiledBiff>(
    {
      file: weiduExeDir,
      args: [
        '--game', gameDir,
        '--tlkin', tlkDir,
        '--out', ghostDir.decompiledBiff.root,
        '--biff-get', '.+',
      ],
    },
    parseDecompiledBiff,
  );

  const unique = [...new Map(biffs.map(x => [x.resourceName, x])).values()];

  return Map.groupBy(unique, x => x.type);
};

export default decompileAndParseBiffs;
