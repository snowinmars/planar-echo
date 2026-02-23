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

const regex = /\[(.*?)\] created from \[(.*?)\]/g;
const getCommand = ({ weidu, game, output, lang }: Pathes, biff: Biff): string => `"${weidu}" --game "${game}" --use-lang ${lang} --out "${output.decimpiledBiff}" --biff-get "[${biff.name}]"`;
const decompileBiff = (pathes: Pathes, biff: Biff): Promise<DecompiledItem[]> => {
  return execConsole<DecompiledItem>(getCommand(pathes, biff), (line) => {
    const matches = regex.exec(line.toLowerCase());
    const isTechInfo = !matches || matches.length <= 1;
    if (isTechInfo) return null;
    const name = basename(normalize(matches![1]!.trim()));
    const fromBiffParent = basename(dirname(normalize(matches![2]!.trim())));
    const fromBiff = fromBiffParent + '/' + basename(normalize(matches![2]!.trim()));
    const type = detectDecompiledItemType(extname(name) || name); // there is a filename '.bcs'
    return { name, fromBiff, type };
  });
};

const decompileBiffs = async (pathes: Pathes, percentCallback: ((percent: number) => void) | null = null): Promise<DecompiledItem[]> => {
  const biffs: Biff[] = await listBiffs(pathes);
  // biffs = biffs.filter(x => x.name.toLowerCase().includes('ca_mrt')); // DEV usage
  const decompiledItems: DecompiledItem[] = [];
  const totalSizeBytes = biffs.reduce((acc, cur) => acc + cur.sizeBytes, 0);
  let doneSizeBytes = 0;
  for (const biff of biffs) {
    const x = await decompileBiff(pathes, biff);
    doneSizeBytes += biff.sizeBytes;
    const percent = doneSizeBytes * 100 / totalSizeBytes;
    percentCallback?.(Math.round(percent));
    decompiledItems.push(...x);
  }

  return decompiledItems;
};

export default decompileBiffs;
