import logger from '@/shared/logger.js';
import { parseTlk } from './tlk/index.js';
import { parseIds } from './ids/index.js';
import { parseInis } from './ini/index.js';
import { parseCres } from './cre/index.js';
import { parseDlgs } from './dlg/index.js';
import { parseEffsV20 } from './eff/index.js';
import { parseItms } from './itm/index.js';
import { buildBcsContext, parseBcs } from './bcs/index.js';
import { parseWeds } from './wed/index.js';
import { parseAres } from './are/index.js';
import { parsePvrzs } from './pvrz/index.js';
import { parseTiss } from './tis/index.js';
import { parseMoss, isMosV1Artifacts } from './mos/index.js';
import { parseBams, isBamV1Artifacts } from './bam/index.js';
import { parseBmps, isBmpPalettedArtifacts } from './bmp/index.js';
import { parseWavs } from './wav/index.js';
import { parseAcms } from './acm/index.js';
import { parseMuss } from './mus/index.js';
import { decodePvrToRgba } from './pvrz/decode/index.js';
import { isPaletteArtfact } from './tis/v1/parseTisV1.types.js';
import { isNothing } from '@planar/shared';

import type { Paths } from '../../1.createPaths/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../../3.decompileBiffs/index.js';
import type { RawIds } from './ids/index.js';
import type { RawIni } from './ini/index.js';
import type { RawCre } from './cre/index.js';
import type { RawDlg } from './dlg/index.js';
import type { RawEffV20 } from './eff/index.js';
import type { RawItmV10 } from './itm/index.js';
import type { RawBcs } from './bcs/index.js';
import type { RawWed } from './wed/index.js';
import type { RawAre } from './are/index.js';
import type { RawTis } from './tis/index.js';
import type { RawMos } from './mos/index.js';
import type { RawBam } from './bam/index.js';
import type { RawBmp } from './bmp/index.js';
import type { RawWav } from './wav/index.js';
import type { RawAcm } from './acm/index.js';
import type { RawMus } from './mus/index.js';
import type { AllPsteeJsons } from '../types.js';
import type { RawPvr } from './pvrz/index.js';
import type { RawPvrRgbaImage } from './pvrz/decode/index.js';

const mustHaveIds = [
  'diety.ids', // in pstee it is diety, not deity
  'magespec.ids',
  'race.ids',
  'ea.ids',
  'general.ids',
  'class.ids',
  'object.ids',
];

const biffs2jsonPstee = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  paths: Paths,
): Promise<AllPsteeJsons> => {
  logger.info(`Converting tlk to json...`);
  const tlk = await parseTlk(paths.tlkDir);
  await paths.ghostDir.saveJson.tlk(`${paths.gameLanguage}.json`, tlk);

  ///

  logger.info(`Converting ids to json...`);
  const ids = new Map<string, RawIds>();
  const idsIterator = parseIds(paths, decompiledBiffs.get('ids')!);
  for await (const id of idsIterator) {
    ids.set(id.resourceName, id);
    await paths.ghostDir.saveJson.ids(id.resourceName, id);
  }

  for (const mustHaveId of mustHaveIds) if (!ids.has(mustHaveId)) throw new Error(`Pstee sources has '${mustHaveId}' file, but you did not pass it`);

  ///

  logger.info(`Converting bcs to json...`);
  const bcs: RawBcs[] = [];
  const bcsCtx = await buildBcsContext(ids, paths.ghostDir.cache.xorKey);
  const bcsIterator = parseBcs(paths, decompiledBiffs.get('bcs')!, bcsCtx);
  for await (const b of bcsIterator) {
    bcs.push(b);
    await paths.ghostDir.saveJson.bcs(`${b.resourceName}.json`, b);
  }

  ///

  logger.info(`Converting ini to json...`);
  const inis = new Map<string, RawIni>();
  const inisIterator = parseInis(paths, decompiledBiffs.get('ini')!);
  for await (const ini of inisIterator) {
    if (!ini) continue;
    inis.set(ini.resourceName, ini);
    await paths.ghostDir.saveJson.ini(ini.resourceName, ini);
  }

  ///

  logger.info(`Converting cre to json...`);
  const cres: RawCre[] = [];
  const cresIterator = parseCres(paths, decompiledBiffs.get('cre')!, ids);
  for await (const cre of cresIterator) {
    if (!cre) continue;
    cres.push(cre);
    await paths.ghostDir.saveJson.cre(cre.resourceName, cre);
  }

  ///

  logger.info(`Converting dlg to json...`);
  const dlgs: RawDlg[] = [];
  const emptyDlgs = [
    'dzxxx.dlg',
    'dzxxxx.dlg',
    'ddrndegh.dlg',
    'f.dlg',
    'cheats.dlg',
    'dcheats.dlg',
    'forge.dlg',
    'hthugb3.dlg',
    'over01.dlg',
    'over02.dlg',
    'over03.dlg',
  ];
  const dlgsIterator = parseDlgs(paths, decompiledBiffs.get('dlg')!.filter(x => !emptyDlgs.includes(x.resourceName)));
  for await (const dlg of dlgsIterator) {
    dlgs.push(dlg);
    await paths.ghostDir.saveJson.dlg(dlg.resourceName, dlg);
  }

  ///

  logger.info(`Converting eff to json...`);
  const effs: RawEffV20[] = [];
  // const effIterator = parseEffV10(paths, decompiledBiffs.get('eff')!);
  const effIterator = parseEffsV20(paths, decompiledBiffs.get('eff')!);
  for await (const eff of effIterator) {
    effs.push(eff);
    await paths.ghostDir.saveJson.eff(eff.resourceName, eff);
  }

  ///

  logger.info(`Converting itm to json...`);
  const itms: RawItmV10[] = [];
  const itmsIterator = parseItms(paths, decompiledBiffs.get('itm')!);
  for await (const itm of itmsIterator) {
    itms.push(itm);
    await paths.ghostDir.saveJson.itm(itm.resourceName, itm);
  }

  ///

  logger.info(`Converting wed to json...`);
  const weds: RawWed[] = [];
  const wedsIterator = parseWeds(paths, decompiledBiffs.get('wed')!);
  for await (const wed of wedsIterator) {
    weds.push(wed);
    await paths.ghostDir.saveJson.wed(wed.resourceName, wed);
  }
  const wedIndex = new Map<string, RawWed>(weds.map(wed => [wed.resourceName, wed]));

  ///

  logger.info(`Converting pvrz to json...`);
  const pvrs: RawPvr[] = [];
  const pvrzRgbaIndex = new Map<string, RawPvrRgbaImage>();
  const pvrsIterator = parsePvrzs(paths, decompiledBiffs.get('pvrz')!);
  for await (const { pvr, pixelData } of pvrsIterator) {
    pvrs.push(pvr);
    pvrzRgbaIndex.set(pvr.resourceName, decodePvrToRgba(pvr, pixelData));
    await paths.ghostDir.saveJson.pvrz(pvr.resourceName, pvr);
  }

  ///

  logger.info(`Converting bam to json...`);
  const bams: RawBam[] = [];
  const bamsIterator = parseBams(paths, decompiledBiffs.get('bam') ?? [], pvrzRgbaIndex);
  for await (const artifacts of bamsIterator) {
    bams.push(artifacts.bam);
    await paths.ghostDir.saveJson.bam(artifacts.bam.resourceName, artifacts.bam);
    await paths.ghostDir.saveBinary.bam.image(artifacts.bam.resourceName, artifacts.png);
    if (isBamV1Artifacts(artifacts)) {
      await paths.ghostDir.saveBinary.bam.palette(artifacts.bam.resourceName, artifacts.palette);
      await paths.ghostDir.saveBinary.bam.indices(artifacts.bam.resourceName, artifacts.indices);
    }
  }

  ///

  logger.info(`Converting mos to json...`);
  const moss: RawMos[] = [];
  const mossIterator = parseMoss(paths, decompiledBiffs.get('mos')!, pvrzRgbaIndex);
  for await (const artifacts of mossIterator) {
    moss.push(artifacts.mos);
    await paths.ghostDir.saveJson.mos(artifacts.mos.resourceName, artifacts.mos);
    await paths.ghostDir.saveBinary.mos.image(artifacts.mos.resourceName, artifacts.png);
    if (isMosV1Artifacts(artifacts)) {
      await paths.ghostDir.saveBinary.mos.palette(artifacts.mos.resourceName, artifacts.palette);
      await paths.ghostDir.saveBinary.mos.indices(artifacts.mos.resourceName, artifacts.indices);
    }
  }

  ///

  logger.info(`Converting tis to json...`);
  const tiss: RawTis[] = [];
  const tissIterator = parseTiss(paths, decompiledBiffs.get('tis')!, wedIndex, pvrzRgbaIndex);
  for await (const artifacts of tissIterator) {
    tiss.push(artifacts.tis);
    await paths.ghostDir.saveJson.tis(artifacts.tis.resourceName, artifacts.tis);
    await paths.ghostDir.saveBinary.tis.image(artifacts.tis.resourceName, artifacts.png);
    if (isPaletteArtfact(artifacts)) {
      await paths.ghostDir.saveBinary.tis.palette(artifacts.tis.resourceName, artifacts.palette);
      await paths.ghostDir.saveBinary.tis.indices(artifacts.tis.resourceName, artifacts.indices);
    }
  }

  ///

  logger.info(`Converting bmp to json...`);
  const bmps: RawBmp[] = [];
  const bmpsIterator = parseBmps(paths, decompiledBiffs.get('bmp') ?? []);
  for await (const artifacts of bmpsIterator) {
    bmps.push(artifacts.bmp);
    await paths.ghostDir.saveJson.bmp(artifacts.bmp.resourceName, artifacts.bmp);
    await paths.ghostDir.saveBinary.bmp.image(artifacts.bmp.resourceName, artifacts.png);
    if (isBmpPalettedArtifacts(artifacts)) {
      await paths.ghostDir.saveBinary.bmp.palette(artifacts.bmp.resourceName, artifacts.palette);
      await paths.ghostDir.saveBinary.bmp.indices(artifacts.bmp.resourceName, artifacts.indices);
    }
  }

  ///

  logger.info(`Converting wav to json...`);
  const wavs: RawWav[] = [];
  const wavsIterator = parseWavs(paths, decompiledBiffs.get('wav') ?? []);
  for await (const artifacts of wavsIterator) {
    wavs.push(artifacts.wav);
    await paths.ghostDir.saveJson.wav(artifacts.wav.resourceName, artifacts.wav);
    await paths.ghostDir.saveBinary.wav.audio(artifacts.wav.resourceName, artifacts.pcmWav);
  }

  ///

  logger.info(`Converting acm to json...`);
  const acms: RawAcm[] = [];
  const acmsIterator = await parseAcms(paths);
  for await (const artifacts of acmsIterator) {
    acms.push(artifacts.acm);
    await paths.ghostDir.saveJson.acm(artifacts.acm.resourceName, artifacts.acm);
    await paths.ghostDir.saveBinary.acm.audio(artifacts.acm.resourceName, artifacts.pcmWav);
  }

  ///

  logger.info(`Converting mus to json...`);
  const muss: RawMus[] = [];
  const mussIterator = await parseMuss(paths);
  for await (const mus of mussIterator) {
    muss.push(mus);
    await paths.ghostDir.saveJson.mus(mus.resourceName, mus);
  }

  ///

  logger.info(`Converting are to json...`);
  const ares: RawAre[] = [];
  const creNames = new Set(cres.map(cre => cre.resourceName.replace('.cre', '')));
  const aresIterator = parseAres({
    paths,
    decompiledBiffs: decompiledBiffs.get('are') ?? [],
    creNames,
    ids,
  });
  for await (const artifacts of aresIterator) {
    ares.push(artifacts.are);
    await paths.ghostDir.saveJson.are(artifacts.are.resourceName, artifacts.are);
    if (!isNothing(artifacts.explored)) {
      await paths.ghostDir.saveBinary.are.explored(artifacts.are.resourceName, artifacts.explored);
    }
  }

  return {
    tlk,
    ids,
    inis,
    cres,
    dlgs,
    effs,
    itms,
    bcs,
    weds,
    ares,
    pvrs,
    moss,
    tiss,
    bmps,
    bams,
    wavs,
    acms,
    muss,
  };
};

export default biffs2jsonPstee;
