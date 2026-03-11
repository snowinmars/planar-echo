import { normalize, basename, dirname, extname } from 'path';
import listBiffs from './listBiffs.js';

import { DecompiledItemType, type Biff, type DecompiledItem, type Pathes } from '../shared/types.js';
import execConsole from '../shared/execConsole.js';

const detectDecompiledItemType = (extension: string): DecompiledItemType => {
  switch (extension) {
    case '.2da': return DecompiledItemType.twoda;
    case '.are': return DecompiledItemType.are;
    case '.bam': return DecompiledItemType.bam;
    case '.bcs': return DecompiledItemType.bcs;
    case '.bmp': return DecompiledItemType.bmp;
    case '.chu': return DecompiledItemType.chu;
    case '.cre': return DecompiledItemType.cre;
    case '.dlg': return DecompiledItemType.dlg;
    case '.eff': return DecompiledItemType.eff;
    case '.glsl': return DecompiledItemType.glsl;
    case '.gam': return DecompiledItemType.gam;
    case '.ids': return DecompiledItemType.ids;
    case '.ini': return DecompiledItemType.ini;
    case '.itm': return DecompiledItemType.itm;
    case '.lua': return DecompiledItemType.lua;
    case '.menu': return DecompiledItemType.menu;
    case '.mos': return DecompiledItemType.mos;
    case '.pvrz': return DecompiledItemType.pvrz;
    case '.pro': return DecompiledItemType.pro;
    case '.qsp': return DecompiledItemType.qsp;
    case '.spl': return DecompiledItemType.spl;
    case '.src': return DecompiledItemType.src;
    case '.sto': return DecompiledItemType.sto;
    case '.tis': return DecompiledItemType.tis;
    case '.tlk': return DecompiledItemType.tlk;
    case '.ttf': return DecompiledItemType.ttf;
    case '.vvc': return DecompiledItemType.vvc;
    case '.wav': return DecompiledItemType.wav;
    case '.wbm': return DecompiledItemType.wbm;
    case '.wed': return DecompiledItemType.wed;
    case '.wmp': return DecompiledItemType.wmp;
    default: throw new Error(`Cannot parse DecompiledItemType from extension '${extension}'`);
  }
};

const regex = /\[(.*?)\] created from \[(.*?)\]/;
const getCommand = ({ weidu, game, output, lang }: Pathes, biffs: Biff[]): string => {
  const biffNames = biffs.map(b => `${b.name}`).join(' ');
  return `"${weidu}" --game "${game}" --use-lang ${lang} --out "${output.decimpiledBiff.root}" --biff-get "[${biffNames}]"`;
};
const decompileBiffs = async (pathes: Pathes): Promise<DecompiledItem[]> => {
  const decompiledItemsCache = new Map<string, DecompiledItem>();

  const biffs: Biff[] = await listBiffs(pathes);

  const items = await execConsole<DecompiledItem>(getCommand(pathes, biffs), (line): DecompiledItem | null => {
    const noMatches = line.startsWith('No matches for');
    if (noMatches) throw new Error(line);

    const matches = regex.exec(line.toLowerCase());
    const isTechInfo = !matches || matches.length <= 1;
    if (isTechInfo) return null;
    const name = basename(normalize(matches![1]!.trim()));
    const fromBiffParent = basename(dirname(normalize(matches![2]!.trim())));
    const fromBiff = fromBiffParent + '/' + basename(normalize(matches![2]!.trim()));
    const type = detectDecompiledItemType(extname(name) || name); // there is a filename '.bcs'
    return { name, fromBiff, type };
  });

  for (const item of items) {
    if (!item) continue;
    if (!decompiledItemsCache.has(item.name)) decompiledItemsCache.set(item.name, item);
  }

  return [...decompiledItemsCache.values()];
};

export default decompileBiffs;
