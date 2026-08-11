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
  const weiduExeDir    = normalize(props.weiduExeDir);
  const chitinKeyFile  = normalize(props.chitinKeyFile);
  const prismDir       = normalize(props.prismDir);
  const ghostDir       = normalize(props.ghostDir);
  const gameDir        = normalize(dirname(chitinKeyFile));
  const tlkDir         = normalize(join(gameDir, 'lang', props.gameLanguage, 'dialog.tlk'));

  const cacheRoot      = normalize(join(ghostDir, 'cache'));
  const cacheXorKey    = normalize(join(cacheRoot, 'xor-key.json'));

  const decompiledBiffRoot      = normalize(join(ghostDir          , 'decompiledBiff'));
  const decompiledBiffCacheJson = normalize(join(decompiledBiffRoot, 'output.json'));

  const jsonRoot       = normalize(join(ghostDir, 'json'));
  const jsonTlk        = normalize(join(jsonRoot, 'tlk'));
  const jsonDialogues  = normalize(join(jsonRoot, 'dialogues'));
  const jsonItems      = normalize(join(jsonRoot, 'items'));
  const jsonIds        = normalize(join(jsonRoot, 'ids'));
  const jsonInis       = normalize(join(jsonRoot, 'inis'));
  const jsonCreatures  = normalize(join(jsonRoot, 'creatures'));
  const jsonEffects    = normalize(join(jsonRoot, 'effects'));
  const jsonBcs        = normalize(join(jsonRoot, 'bcs'));
  const jsonWed        = normalize(join(jsonRoot, 'wed'));
  const jsonPvrz       = normalize(join(jsonRoot, 'pvrz'));
  const jsonTis        = normalize(join(jsonRoot, 'tis'));

  const ghostRoot      = normalize(join(ghostDir , 'ghost'));
  const ghostTlk       = normalize(join(ghostRoot, 'tlk'));
  const ghostDialogues = normalize(join(ghostRoot, 'dialogues'));
  const ghostItems     = normalize(join(ghostRoot, 'items'));
  const ghostIds       = normalize(join(ghostRoot, 'ids'));
  const ghostInis      = normalize(join(ghostRoot, 'inis'));
  const ghostCreatures = normalize(join(ghostRoot, 'creatures'));
  const ghostEffects   = normalize(join(ghostRoot, 'effects'));
  const ghostBcs       = normalize(join(ghostRoot, 'bcs'));
  const ghostWed       = normalize(join(ghostRoot, 'wed'));
  const ghostPvrz      = normalize(join(ghostRoot, 'pvrz'));
  const ghostTis       = normalize(join(ghostRoot, 'tis'));
  const ghostStores    = normalize(join(ghostRoot, 'stores'));

  const jsonTisPng: NamingFunction = x => `${x}.png`;
  const jsonTisPalette: NamingFunction = x => `${x}.palette`;
  const jsonTisIndices: NamingFunction = x => `${x}.indices`;

  // TODO [snow]: I do not like this path, but where should it lead to?..
  const sharedEnums    = normalize(join(ghostDir, '..', 'planar-shared', 'src', 'dialogueEngine', 'enums'));

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
        root     : jsonRoot,
        tlk      : jsonTlk,
        dialogues: jsonDialogues,
        items    : jsonItems,
        ids      : jsonIds,
        inis     : jsonInis,
        creatures: jsonCreatures,
        effects  : jsonEffects,
        bcs      : jsonBcs,
        wed      : jsonWed,
        pvrz     : jsonPvrz,
        tis      : jsonTis,
      },
      saveJson: {
        tlk      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonTlk      , resourceName), entry, asIs),
        dialogues: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonDialogues, resourceName), entry, asIs),
        items    : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonItems    , resourceName), entry, asIs),
        ids      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonIds      , resourceName), entry, asIs),
        inis     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonInis     , resourceName), entry, asIs),
        creatures: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonCreatures, resourceName), entry, asIs),
        effects  : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonEffects  , resourceName), entry, asIs),
        bcs      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonBcs      , resourceName), entry, asIs),
        wed      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonWed      , resourceName), entry, asIs),
        pvrz     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonPvrz     , resourceName), entry, asIs),
        tis      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonTis      , resourceName), entry, asIs),
      },
      saveBinary: {
        tisImage  : (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonTis, jsonTisPng(resourceName)), data),
        tisPalette: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonTis, jsonTisPalette(resourceName)), data),
        tisIndices: (resourceName: string, data: Buffer) => saveBinaryToFile(join(jsonTis, jsonTisIndices(resourceName)), data),
      },
      ghost: {
        root     : ghostRoot,
        tlk      : ghostTlk,
        dialogues: ghostDialogues,
        items    : ghostItems,
        ids      : ghostIds,
        inis     : ghostInis,
        creatures: ghostCreatures,
        effects  : ghostEffects,
        bcs      : ghostBcs,
        wed      : ghostWed,
        pvrz     : ghostPvrz,
        tis      : ghostTis,
      },
      saveGhost: {
        tlk      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostTlk      , resourceName), entry, asIs),
        dialogues: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostDialogues, resourceName), entry, asIs),
        items    : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostItems    , resourceName), entry, asIs),
        ids      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostIds      , resourceName), entry, asIs),
        inis     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostInis     , resourceName), entry, asIs),
        creatures: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostCreatures, resourceName), entry, asIs),
        effects  : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostEffects  , resourceName), entry, asIs),
        bcs      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostBcs      , resourceName), entry, asIs),
        wed      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostWed      , resourceName), entry, asIs),
        pvrz     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostPvrz     , resourceName), entry, asIs),
        tis      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostTis      , resourceName), entry, asIs),
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
    paths.ghostDir.json.dialogues,
    paths.ghostDir.json.items,
    paths.ghostDir.json.ids,
    paths.ghostDir.json.inis,
    paths.ghostDir.json.creatures,
    paths.ghostDir.json.effects,
    paths.ghostDir.json.bcs,
    paths.ghostDir.json.wed,
    paths.ghostDir.json.pvrz,
    paths.ghostDir.json.tis,
    paths.ghostDir.ghost.tlk,
    paths.ghostDir.ghost.dialogues,
    paths.ghostDir.ghost.items,
    paths.ghostDir.ghost.ids,
    paths.ghostDir.ghost.inis,
    paths.ghostDir.ghost.creatures,
    paths.ghostDir.ghost.effects,
    paths.ghostDir.ghost.bcs,
    paths.ghostDir.ghost.wed,
    paths.ghostDir.ghost.pvrz,
    paths.ghostDir.ghost.tis,
    paths.ghostDir.stores,
  ], props.recreate || false);

  return paths;
};
