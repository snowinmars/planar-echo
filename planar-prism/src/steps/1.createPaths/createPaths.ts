import { dirname, join, normalize } from 'path';

import { packageDir } from '@planar/shared/node';

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

  const jsonRoot  = normalize(join(ghostDir, 'json'));
  const jsonTlk   = normalize(join(jsonRoot, 'tlk'));
  const jsonDlg   = normalize(join(jsonRoot, 'dlg'));
  const jsonItm   = normalize(join(jsonRoot, 'itm'));
  const jsonIds   = normalize(join(jsonRoot, 'ids'));
  const jsonIni   = normalize(join(jsonRoot, 'ini'));
  const jsonCre   = normalize(join(jsonRoot, 'cre'));
  const jsonEff   = normalize(join(jsonRoot, 'eff'));
  const jsonBcs   = normalize(join(jsonRoot, 'bcs'));
  const jsonWed   = normalize(join(jsonRoot, 'wed'));
  const jsonAre   = normalize(join(jsonRoot, 'are'));
  const jsonPvrz  = normalize(join(jsonRoot, 'pvrz'));
  const jsonTis   = normalize(join(jsonRoot, 'tis'));
  const jsonMos   = normalize(join(jsonRoot, 'mos'));
  const jsonBmp   = normalize(join(jsonRoot, 'bmp'));
  const jsonBam   = normalize(join(jsonRoot, 'bam'));
  const jsonWav   = normalize(join(jsonRoot, 'wav'));
  const jsonAcm   = normalize(join(jsonRoot, 'acm'));
  const jsonMus   = normalize(join(jsonRoot, 'mus'));
  const jsonTwoda = normalize(join(jsonRoot, 'twoda'));
  const jsonSrc   = normalize(join(jsonRoot, 'src'));

  const assetsRoot  = normalize(join(ghostDir, 'assets'));
  const assetsTlk   = normalize(join(assetsRoot, 'tlk'));
  const assetsDlg   = normalize(join(assetsRoot, 'dlg'));
  const assetsItm   = normalize(join(assetsRoot, 'itm'));
  const assetsIds   = normalize(join(assetsRoot, 'ids'));
  const assetsIni   = normalize(join(assetsRoot, 'ini'));
  const assetsCre   = normalize(join(assetsRoot, 'cre'));
  const assetsEff   = normalize(join(assetsRoot, 'eff'));
  const assetsBcs   = normalize(join(assetsRoot, 'bcs'));
  const assetsWed   = normalize(join(assetsRoot, 'wed'));
  const assetsAre   = normalize(join(assetsRoot, 'are'));
  const assetsPvrz  = normalize(join(assetsRoot, 'pvrz'));
  const assetsTis   = normalize(join(assetsRoot, 'tis'));
  const assetsMos   = normalize(join(assetsRoot, 'mos'));
  const assetsBmp   = normalize(join(assetsRoot, 'bmp'));
  const assetsBam   = normalize(join(assetsRoot, 'bam'));
  const assetsWav   = normalize(join(assetsRoot, 'wav'));
  const assetsAcm   = normalize(join(assetsRoot, 'acm'));
  const assetsMus   = normalize(join(assetsRoot, 'mus'));
  const assetsTwoda = normalize(join(assetsRoot, 'twoda'));
  const assetsSrc   = normalize(join(assetsRoot, 'src'));

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
  const ghostAre    = normalize(join(ghostRoot, 'are'));
  const ghostPvrz   = normalize(join(ghostRoot, 'pvrz'));
  const ghostTis    = normalize(join(ghostRoot, 'tis'));
  const ghostMos    = normalize(join(ghostRoot, 'mos'));
  const ghostBmp    = normalize(join(ghostRoot, 'bmp'));
  const ghostBam    = normalize(join(ghostRoot, 'bam'));
  const ghostWav    = normalize(join(ghostRoot, 'wav'));
  const ghostAcm    = normalize(join(ghostRoot, 'acm'));
  const ghostMus    = normalize(join(ghostRoot, 'mus'));
  const ghostTwoda  = normalize(join(ghostRoot, 'twoda'));
  const ghostSrc    = normalize(join(ghostRoot, 'src'));
  const ghostStores = normalize(join(ghostRoot, 'stores'));

  const assetsTisImage: NamingFunction = x => `${x}.png`;
  const assetsTisPalette: NamingFunction = x => `${x}.palette`;
  const assetsTisIndices: NamingFunction = x => `${x}.indices`;
  const assetsMosImage: NamingFunction = x => `${x}.png`;
  const assetsMosPalette: NamingFunction = x => `${x}.palette`;
  const assetsMosIndices: NamingFunction = x => `${x}.indices`;
  const assetsBmpImage: NamingFunction = x => `${x}.png`;
  const assetsBmpPalette: NamingFunction = x => `${x}.palette`;
  const assetsBmpIndices: NamingFunction = x => `${x}.indices`;
  const assetsBamImage: NamingFunction = x => `${x}.png`;
  const assetsBamPalette: NamingFunction = x => `${x}.palette`;
  const assetsBamIndices: NamingFunction = x => `${x}.indices`;
  const assetsWavAudio: NamingFunction = x => `${x}.wav`;
  const assetsAcmAudio: NamingFunction = x => `${x}.wav`;
  const assetsAreExplored: NamingFunction = x => `${x}.explored`;
  const assetsAreWalk: NamingFunction = x => `${x}.walk`;

  const sharedEnums    = normalize(join(packageDir('@planar/shared', import.meta.url), 'src', 'dlgEngine', 'enums'));

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
        are : jsonAre,
        pvrz: jsonPvrz,
        tis : jsonTis,
        mos : jsonMos,
        bmp : jsonBmp,
        bam : jsonBam,
        wav : jsonWav,
        acm : jsonAcm,
        mus : jsonMus,
        twoda: jsonTwoda,
        src : jsonSrc,
      },
      assets: {
        root: assetsRoot,
        tlk : assetsTlk,
        dlg : assetsDlg,
        itm : assetsItm,
        ids : assetsIds,
        ini : assetsIni,
        cre : assetsCre,
        eff : assetsEff,
        bcs : assetsBcs,
        wed : assetsWed,
        are : assetsAre,
        pvrz: assetsPvrz,
        tis : assetsTis,
        mos : assetsMos,
        bmp : assetsBmp,
        bam : assetsBam,
        wav : assetsWav,
        acm : assetsAcm,
        mus : assetsMus,
        twoda: assetsTwoda,
        src : assetsSrc,
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
        are      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonAre      , resourceName), entry, asIs),
        pvrz     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonPvrz     , resourceName), entry, asIs),
        tis      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonTis      , resourceName), entry, asIs),
        mos      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonMos      , resourceName), entry, asIs),
        bmp      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonBmp      , resourceName), entry, asIs),
        bam      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonBam      , resourceName), entry, asIs),
        wav      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonWav      , resourceName), entry, asIs),
        acm      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonAcm      , resourceName), entry, asIs),
        mus      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonMus      , resourceName), entry, asIs),
        twoda    : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonTwoda      , resourceName), entry, asIs),
        src      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonSrc      , resourceName), entry, asIs),
      },
      saveAssets: {
        are: {
          explored: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsAre, assetsAreExplored(resourceName)), data),
          walk: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsAre, assetsAreWalk(resourceName)), data),
        },
        tis: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsTis, assetsTisImage(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsTis, assetsTisPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsTis, assetsTisIndices(resourceName)), data),
        },
        mos: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsMos, assetsMosImage(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsMos, assetsMosPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsMos, assetsMosIndices(resourceName)), data),
        },
        bmp: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsBmp, assetsBmpImage(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsBmp, assetsBmpPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsBmp, assetsBmpIndices(resourceName)), data),
        },
        bam: {
          image  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsBam, assetsBamImage(resourceName)), data),
          palette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsBam, assetsBamPalette(resourceName)), data),
          indices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsBam, assetsBamIndices(resourceName)), data),
        },
        wav: {
          audio  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsWav, assetsWavAudio(resourceName)), data),
        },
        acm: {
          audio  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(assetsAcm, assetsAcmAudio(resourceName)), data),
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
        are : ghostAre,
        pvrz: ghostPvrz,
        tis : ghostTis,
        mos : ghostMos,
        bmp : ghostBmp,
        bam : ghostBam,
        wav : ghostWav,
        acm : ghostAcm,
        mus : ghostMus,
        twoda: ghostTwoda,
        src : ghostSrc,
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
        are      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostAre      , resourceName), entry, asIs),
        pvrz     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostPvrz     , resourceName), entry, asIs),
        tis      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostTis      , resourceName), entry, asIs),
        mos      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostMos      , resourceName), entry, asIs),
        bmp      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostBmp      , resourceName), entry, asIs),
        bam      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostBam      , resourceName), entry, asIs),
        wav      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostWav      , resourceName), entry, asIs),
        acm      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostAcm      , resourceName), entry, asIs),
        mus      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostMus      , resourceName), entry, asIs),
        twoda    : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostTwoda      , resourceName), entry, asIs),
        src      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostSrc      , resourceName), entry, asIs),
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
    paths.ghostDir.json.are,
    paths.ghostDir.json.pvrz,
    paths.ghostDir.json.tis,
    paths.ghostDir.json.mos,
    paths.ghostDir.json.bmp,
    paths.ghostDir.json.bam,
    paths.ghostDir.json.wav,
    paths.ghostDir.json.acm,
    paths.ghostDir.json.mus,
    paths.ghostDir.json.twoda,
    paths.ghostDir.json.src,
    paths.ghostDir.assets.tlk,
    paths.ghostDir.assets.dlg,
    paths.ghostDir.assets.itm,
    paths.ghostDir.assets.ids,
    paths.ghostDir.assets.ini,
    paths.ghostDir.assets.cre,
    paths.ghostDir.assets.eff,
    paths.ghostDir.assets.bcs,
    paths.ghostDir.assets.wed,
    paths.ghostDir.assets.are,
    paths.ghostDir.assets.pvrz,
    paths.ghostDir.assets.tis,
    paths.ghostDir.assets.mos,
    paths.ghostDir.assets.bmp,
    paths.ghostDir.assets.bam,
    paths.ghostDir.assets.wav,
    paths.ghostDir.assets.acm,
    paths.ghostDir.assets.mus,
    paths.ghostDir.assets.twoda,
    paths.ghostDir.assets.src,
    paths.ghostDir.ghost.tlk,
    paths.ghostDir.ghost.dlg,
    paths.ghostDir.ghost.itm,
    paths.ghostDir.ghost.ids,
    paths.ghostDir.ghost.ini,
    paths.ghostDir.ghost.cre,
    paths.ghostDir.ghost.eff,
    paths.ghostDir.ghost.bcs,
    paths.ghostDir.ghost.wed,
    paths.ghostDir.ghost.are,
    paths.ghostDir.ghost.pvrz,
    paths.ghostDir.ghost.tis,
    paths.ghostDir.ghost.mos,
    paths.ghostDir.ghost.bmp,
    paths.ghostDir.ghost.bam,
    paths.ghostDir.ghost.wav,
    paths.ghostDir.ghost.acm,
    paths.ghostDir.ghost.mus,
    paths.ghostDir.ghost.twoda,
    paths.ghostDir.ghost.src,
    paths.ghostDir.stores,
  ], props.recreate || false);

  return paths;
};
