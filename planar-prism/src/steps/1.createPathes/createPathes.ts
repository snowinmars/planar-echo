import { join, normalize, dirname } from 'path';
import { mkdirsIfNotExists, saveToFile } from '@/shared/customFs.js';

import type { Maybe } from '@planar/shared';
import type { PrismIndexStartMessage } from '@planar/shared';
import type { Pathes } from './types.js';

type CreatePathesProps = PrismIndexStartMessage['data'] & Readonly<{
  recreate?: Maybe<boolean>;
}>;

export const createPathes = async (props: CreatePathesProps): Promise<Pathes> => {
  /* eslint-disable @stylistic/no-multi-spaces,@stylistic/comma-spacing,@stylistic/key-spacing */
  const weiduExeDir    = normalize(props.weiduExeDir);
  const chitinKeyFile  = normalize(props.chitinKeyFile);
  const prismDir       = normalize(props.prismDir);
  const ghostDir       = normalize(props.ghostDir);
  const gameDir        = normalize(dirname(chitinKeyFile));
  const tlkDir         = normalize(join(gameDir, 'lang', props.gameLanguage, 'dialog.tlk'));

  const decimpiledBiffRoot      = normalize(join(ghostDir        , 'decimpiledBiff'));
  const decimpiledBiffCacheJson = normalize(join(decimpiledBiffRoot, 'output.json'));

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

  // TODO [snow]: I do not like this path, but where should it lead to?..
  const sharedEnums    = normalize(join(ghostDir, '..', 'planar-shared', 'src', 'dialogueEngine', 'enums'));

  const pathes: Pathes = {
    weiduExeDir  : weiduExeDir,
    prismDir  : prismDir,
    gameDir: gameDir,
    tlkDir,
    gameName    : props.gameName,
    gameLanguage: props.gameLanguage,
    ghostDir: {
      root: ghostDir,
      decimpiledBiff: {
        root     : decimpiledBiffRoot,
        cacheJson: decimpiledBiffCacheJson,
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
    },
  /* eslint-enable */
  };

  await mkdirsIfNotExists([
    pathes.ghostDir.root,
    pathes.ghostDir.decimpiledBiff.root,
    pathes.ghostDir.json.dialogues,
    pathes.ghostDir.json.items,
    pathes.ghostDir.json.ids,
    pathes.ghostDir.json.inis,
    pathes.ghostDir.json.creatures,
    pathes.ghostDir.json.effects,
    pathes.ghostDir.ghost.dialogues,
    pathes.ghostDir.ghost.items,
    pathes.ghostDir.ghost.ids,
    pathes.ghostDir.ghost.inis,
    pathes.ghostDir.ghost.creatures,
    pathes.ghostDir.ghost.effects,
  ], props.recreate || false);

  return pathes;
};
