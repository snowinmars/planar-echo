import { join, normalize, dirname } from 'path';
import { mkdirsIfNotExists, saveBinaryToFile, saveToFile } from '@/shared/customFs.js';

import type { Maybe } from '@planar/shared';
import type { PrismIndexStartMessage } from '@planar/shared';
import type { Paths } from './types.js';

type CreatePathsProps = PrismIndexStartMessage['data'] & Readonly<{
  recreate?: Maybe<boolean>;
}>;
type NamingFunction = (x: string) => string;

export const createPaths = async (props: CreatePathsProps): Promise<Paths> => {
  /* eslint-disable @stylistic/no-multi-spaces,@stylistic/comma-spacing,@stylistic/key-spacing */
  const weiduExeDir   = normalize(props.weiduExeDir);
  const chitinKeyFile = normalize(props.chitinKeyFile);
  const prismDir      = normalize(props.prismDir);
  const ghostDir      = normalize(props.ghostDir);
  const gameDir       = normalize(dirname(chitinKeyFile));
  const tlkDir        = normalize(join(gameDir, 'lang', props.gameLanguage, 'dialog.tlk'));

  const cacheRoot     = normalize(join(ghostDir, 'cache'));
  const cacheXorKey   = normalize(join(cacheRoot, 'xor-key.json'));

  const decompiledBiffRoot      = normalize(join(ghostDir          , 'decompiledBiff'));
  const decompiledBiffCacheJson = normalize(join(decompiledBiffRoot, 'output.json'));

  const jsonRoot = normalize(join(ghostDir, 'json'));
  const jsonTlk  = normalize(join(jsonRoot, 'tlk'));
  const jsonDlg  = normalize(join(jsonRoot, 'dlg'));
  const jsonItm  = normalize(join(jsonRoot, 'itm'));
  const jsonIds  = normalize(join(jsonRoot, 'ids'));
  const jsonIni  = normalize(join(jsonRoot, 'ini'));
  const jsonCre  = normalize(join(jsonRoot, 'cre'));
  const jsonEff  = normalize(join(jsonRoot, 'eff'));
  const jsonBcs  = normalize(join(jsonRoot, 'bcs'));
  const jsonWed  = normalize(join(jsonRoot, 'wed'));
  const jsonPvrz = normalize(join(jsonRoot, 'pvrz'));
  const jsonTis  = normalize(join(jsonRoot, 'tis'));
  const jsonMos  = normalize(join(jsonRoot, 'mos'));
  const jsonBmp  = normalize(join(jsonRoot, 'bmp'));
  const jsonBam  = normalize(join(jsonRoot, 'bam'));
  const jsonWav  = normalize(join(jsonRoot, 'wav'));
  const jsonAcm  = normalize(join(jsonRoot, 'acm'));
  const jsonMus  = normalize(join(jsonRoot, 'mus'));

  const ghostRoot   = normalize(join(ghostDir , 'ghost'));
  const ghostTlk    = normalize(join(ghostRoot, 'tlk'));
  const ghostDlg    = normalize(join(ghostRoot, 'dlg'));
  const ghostItm    = normalize(join(ghostRoot, 'itm'));
  const ghostIds    = normalize(join(ghostRoot, 'ids'));
  const ghostIni    = normalize(join(ghostRoot, 'ini'));
  const ghostCre    = normalize(join(ghostRoot, 'cre'));
  const ghostEff    = normalize(join(ghostRoot, 'eff'));
  const ghostBcs    = normalize(join(ghostRoot, 'bcs'));
  const ghostWed    = normalize(join(ghostRoot, 'wed'));
  const ghostPvrz   = normalize(join(ghostRoot, 'pvrz'));
  const ghostTis    = normalize(join(ghostRoot, 'tis'));
  const ghostMos    = normalize(join(ghostRoot, 'mos'));
  const ghostBmp    = normalize(join(ghostRoot, 'bmp'));
  const ghostBam    = normalize(join(ghostRoot, 'bam'));
  const ghostWav    = normalize(join(ghostRoot, 'wav'));
  const ghostAcm    = normalize(join(ghostRoot, 'acm'));
  const ghostMus    = normalize(join(ghostRoot, 'mus'));
  const ghostStores = normalize(join(ghostRoot, 'stores'));

  const jsonTisPng: NamingFunction = x => `${x}.png`;
  const jsonTisPalette: NamingFunction = x => `${x}.palette`;
  const jsonTisIndices: NamingFunction = x => `${x}.indices`;
  const jsonMosPng: NamingFunction = x => `${x}.png`;
  const jsonMosPalette: NamingFunction = x => `${x}.palette`;
  const jsonMosIndices: NamingFunction = x => `${x}.indices`;
  const jsonBmpPng: NamingFunction = x => `${x}.png`;
  const jsonBmpPalette: NamingFunction = x => `${x}.palette`;
  const jsonBmpIndices: NamingFunction = x => `${x}.indices`;
  const jsonBamPng: NamingFunction = x => `${x}.png`;
  const jsonBamPalette: NamingFunction = x => `${x}.palette`;
  const jsonBamIndices: NamingFunction = x => `${x}.indices`;
  const jsonWavAudio: NamingFunction = x => `${x}.wav`;
  const jsonAcmAudio: NamingFunction = x => `${x}.wav`;

  // TODO [snow]: I do not like this path, but where should it lead to?..
  const sharedEnums    = normalize(join(ghostDir, '..', 'planar-shared', 'src', 'dlgEngine', 'enums'));

  const paths: Paths = {
    weiduExeDir  : weiduExeDir,
    prismDir  : prismDir,
    gameDir: gameDir,
    tlkDir,
    gameName    : props.gameName,
    gameLanguage: props.gameLanguage,
    ghostDir: {
      root: ghostDir,
      cache: {
        root  : cacheRoot,
        xorKey: cacheXorKey,
      },
      decompiledBiff: {
        root     : decompiledBiffRoot,
        cacheJson: decompiledBiffCacheJson,
      },
      json: {
        root: jsonRoot,
        tlk : jsonTlk,
        dlg : jsonDlg,
        itm : jsonItm,
        ids : jsonIds,
        ini : jsonIni,
        cre : jsonCre,
        eff : jsonEff,
        bcs : jsonBcs,
        wed : jsonWed,
        pvrz: jsonPvrz,
        tis : jsonTis,
        mos : jsonMos,
        bmp : jsonBmp,
        bam : jsonBam,
        wav : jsonWav,
        acm : jsonAcm,
        mus : jsonMus,
      },
      saveJson: {
        tlk      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonTlk      , resourceName), entry, asIs),
        dlg      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonDlg      , resourceName), entry, asIs),
        itm      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonItm      , resourceName), entry, asIs),
        ids      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonIds      , resourceName), entry, asIs),
        ini      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonIni      , resourceName), entry, asIs),
        cre      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonCre      , resourceName), entry, asIs),
        eff      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonEff      , resourceName), entry, asIs),
        bcs      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonBcs      , resourceName), entry, asIs),
        wed      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonWed      , resourceName), entry, asIs),
        pvrz     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonPvrz     , resourceName), entry, asIs),
        tis      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonTis      , resourceName), entry, asIs),
        mos      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonMos      , resourceName), entry, asIs),
        bmp      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonBmp      , resourceName), entry, asIs),
        bam      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonBam      , resourceName), entry, asIs),
        wav      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonWav      , resourceName), entry, asIs),
        acm      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonAcm      , resourceName), entry, asIs),
        mus      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonMus      , resourceName), entry, asIs),
      },
      saveBinary: {
        tis: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonTis, jsonTisPng(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonTis, jsonTisPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonTis, jsonTisIndices(resourceName)), data),
        },
        mos: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonMos, jsonMosPng(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonMos, jsonMosPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonMos, jsonMosIndices(resourceName)), data),
        },
        bmp: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonBmp, jsonBmpPng(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonBmp, jsonBmpPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonBmp, jsonBmpIndices(resourceName)), data),
        },
        bam: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonBam, jsonBamPng(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonBam, jsonBamPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonBam, jsonBamIndices(resourceName)), data),
        },
        wav: {
          audio  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonWav, jsonWavAudio(resourceName)), data),
        },
        acm: {
          audio  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonAcm, jsonAcmAudio(resourceName)), data),
        },
      },
      ghost: {
        root: ghostRoot,
        tlk : ghostTlk,
        dlg : ghostDlg,
        itm : ghostItm,
        ids : ghostIds,
        ini : ghostIni,
        cre : ghostCre,
        eff : ghostEff,
        bcs : ghostBcs,
        wed : ghostWed,
        pvrz: ghostPvrz,
        tis : ghostTis,
        mos : ghostMos,
        bmp : ghostBmp,
        bam : ghostBam,
        wav : ghostWav,
        acm : ghostAcm,
        mus : ghostMus,
      },
      saveGhost: {
        tlk      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostTlk      , resourceName), entry, asIs),
        dlg      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostDlg      , resourceName), entry, asIs),
        itm      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostItm      , resourceName), entry, asIs),
        ids      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostIds      , resourceName), entry, asIs),
        ini      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostIni      , resourceName), entry, asIs),
        cre      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostCre      , resourceName), entry, asIs),
        eff      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostEff      , resourceName), entry, asIs),
        bcs      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostBcs      , resourceName), entry, asIs),
        wed      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostWed      , resourceName), entry, asIs),
        pvrz     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostPvrz     , resourceName), entry, asIs),
        tis      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostTis      , resourceName), entry, asIs),
        mos      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostMos      , resourceName), entry, asIs),
        bmp      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostBmp      , resourceName), entry, asIs),
        bam      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostBam      , resourceName), entry, asIs),
        wav      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostWav      , resourceName), entry, asIs),
        acm      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostAcm      , resourceName), entry, asIs),
        mus      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostMus      , resourceName), entry, asIs),
      },
      sharedEnums,
      stores: ghostStores,
    },
  /* eslint-enable */
  };

  await mkdirsIfNotExists([
    paths.ghostDir.root,
    paths.ghostDir.cache.root,
    paths.ghostDir.decompiledBiff.root,
    paths.ghostDir.json.tlk,
    paths.ghostDir.json.dlg,
    paths.ghostDir.json.itm,
    paths.ghostDir.json.ids,
    paths.ghostDir.json.ini,
    paths.ghostDir.json.cre,
    paths.ghostDir.json.eff,
    paths.ghostDir.json.bcs,
    paths.ghostDir.json.wed,
    paths.ghostDir.json.pvrz,
    paths.ghostDir.json.tis,
    paths.ghostDir.json.mos,
    paths.ghostDir.json.bmp,
    paths.ghostDir.json.bam,
    paths.ghostDir.json.wav,
    paths.ghostDir.json.acm,
    paths.ghostDir.json.mus,
    paths.ghostDir.ghost.tlk,
    paths.ghostDir.ghost.dlg,
    paths.ghostDir.ghost.itm,
    paths.ghostDir.ghost.ids,
    paths.ghostDir.ghost.ini,
    paths.ghostDir.ghost.cre,
    paths.ghostDir.ghost.eff,
    paths.ghostDir.ghost.bcs,
    paths.ghostDir.ghost.wed,
    paths.ghostDir.ghost.pvrz,
    paths.ghostDir.ghost.tis,
    paths.ghostDir.ghost.mos,
    paths.ghostDir.ghost.bmp,
    paths.ghostDir.ghost.bam,
    paths.ghostDir.ghost.wav,
    paths.ghostDir.ghost.acm,
    paths.ghostDir.ghost.mus,
    paths.ghostDir.stores,
  ], props.recreate || false);

  return paths;
};
