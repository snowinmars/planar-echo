import { join, normalize, dirname } from 'path';
import { mkdirsIfNotExists, saveToFile } from '@/shared/customFs.js';

import type { Maybe } from '@planar/shared';
import type { PrismIndexStartMessage } from '@planar/shared';
import type { Paths } from './types.js';

type CreatePathsProps = PrismIndexStartMessage['data'] & Readonly<{
  recreate?: Maybe<boolean>;
}>;

export const createPaths = async (props: CreatePathsProps): Promise<Paths> => {
  /* eslint-disable @stylistic/no-multi-spaces,@stylistic/comma-spacing,@stylistic/key-spacing */
  const weiduExeDir    = normalize(props.weiduExeDir);
  const chitinKeyFile  = normalize(props.chitinKeyFile);
  const prismDir       = normalize(props.prismDir);
  const ghostDir       = normalize(props.ghostDir);
  const gameDir        = normalize(dirname(chitinKeyFile));
  const tlkDir         = normalize(join(gameDir, 'lang', props.gameLanguage, 'dialog.tlk'));

  const decompiledBiffRoot      = normalize(join(ghostDir          , 'decompiledBiff'));
  const decompiledBiffCacheJson = normalize(join(decompiledBiffRoot, 'output.json'));

  const jsonRoot       = normalize(join(ghostDir, 'json'));
  const jsonDialogues  = normalize(join(jsonRoot, 'dialogues'));
  const jsonItems      = normalize(join(jsonRoot, 'items'));
  const jsonIds        = normalize(join(jsonRoot, 'ids'));
  const jsonInis       = normalize(join(jsonRoot, 'inis'));
  const jsonCreatures  = normalize(join(jsonRoot, 'creatures'));
  const jsonEffects    = normalize(join(jsonRoot, 'effects'));

  const ghostRoot      = normalize(join(ghostDir , 'ghost'));
  const ghostDialogues = normalize(join(ghostRoot, 'dialogues'));
  const ghostItems     = normalize(join(ghostRoot, 'items'));
  const ghostIds       = normalize(join(ghostRoot, 'ids'));
  const ghostInis      = normalize(join(ghostRoot, 'inis'));
  const ghostCreatures = normalize(join(ghostRoot, 'creatures'));
  const ghostEffects   = normalize(join(ghostRoot, 'effects'));
  const ghostStores    = normalize(join(ghostRoot, 'stores'));

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
      decompiledBiff: {
        root     : decompiledBiffRoot,
        cacheJson: decompiledBiffCacheJson,
      },
      json: {
        root     : jsonRoot,
        dialogues: jsonDialogues,
        items    : jsonItems,
        ids      : jsonIds,
        inis     : jsonInis,
        creatures: jsonCreatures,
        effects  : jsonEffects,
      },
      saveJson: {
        dialogues: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonDialogues, resourceName), entry, asIs),
        items    : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonItems    , resourceName), entry, asIs),
        ids      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonIds      , resourceName), entry, asIs),
        inis     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonInis     , resourceName), entry, asIs),
        creatures: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonCreatures, resourceName), entry, asIs),
        effects  : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(jsonEffects  , resourceName), entry, asIs),
      },
      ghost: {
        root     : ghostRoot,
        dialogues: ghostDialogues,
        items    : ghostItems,
        ids      : ghostIds,
        inis     : ghostInis,
        creatures: ghostCreatures,
        effects  : ghostEffects,
      },
      saveGhost: {
        dialogues: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostDialogues, resourceName), entry, asIs),
        items    : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostItems    , resourceName), entry, asIs),
        ids      : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostIds      , resourceName), entry, asIs),
        inis     : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostInis     , resourceName), entry, asIs),
        creatures: (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostCreatures, resourceName), entry, asIs),
        effects  : (resourceName: string, entry: unknown, asIs = false) => saveToFile(join(ghostEffects  , resourceName), entry, asIs),
      },
      sharedEnums,
      stores: ghostStores,
    },
  /* eslint-enable */
  };

  await mkdirsIfNotExists([
    paths.ghostDir.root,
    paths.ghostDir.decompiledBiff.root,
    paths.ghostDir.json.dialogues,
    paths.ghostDir.json.items,
    paths.ghostDir.json.ids,
    paths.ghostDir.json.inis,
    paths.ghostDir.json.creatures,
    paths.ghostDir.json.effects,
    paths.ghostDir.ghost.dialogues,
    paths.ghostDir.ghost.items,
    paths.ghostDir.ghost.ids,
    paths.ghostDir.ghost.inis,
    paths.ghostDir.ghost.creatures,
    paths.ghostDir.ghost.effects,
    paths.ghostDir.stores,
  ], props.recreate || false);

  return paths;
};
