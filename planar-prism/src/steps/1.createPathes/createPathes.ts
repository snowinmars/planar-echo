import { join, normalize, dirname } from 'path';
import { mkdirsIfNotExists, saveToFile } from '@/shared/customFs.js';

import type { Maybe } from '@planar/shared';
import type { PrismIndexStartMessage } from '@planar/shared';
import type { Pathes } from './types.js';

type CreatePathesProps = PrismIndexStartMessage['data'] & Readonly<{
  recreate?: Maybe<boolean>;
}>;

const createPathes = async (props: CreatePathesProps): Promise<Pathes> => {
  /* eslint-disable @stylistic/no-multi-spaces,@stylistic/comma-spacing,@stylistic/key-spacing */
  const weiduExe       = normalize(props.weiduExe);
  const chitinKeyPath  = normalize(props.chitinKey);
  const outputPath     = normalize(props.ghost);

  const gameFolder     = normalize(dirname(chitinKeyPath));
  const tlkPath        = normalize(join(gameFolder, 'lang', props.gameLanguage, 'dialog.tlk'));

  const decimpiledBiffRoot      = normalize(join(outputPath        , 'decimpiledBiff'));
  const decimpiledBiffCacheJson = normalize(join(decimpiledBiffRoot, 'output.json'));

  const jsonRoot       = normalize(join(outputPath, 'json'));
  const jsonDialogues  = normalize(join(jsonRoot  , 'dialogues'));
  const jsonItems      = normalize(join(jsonRoot  , 'items'));
  const jsonIds        = normalize(join(jsonRoot  , 'ids'));
  const jsonInis       = normalize(join(jsonRoot  , 'inis'));
  const jsonCreatures  = normalize(join(jsonRoot  , 'creatures'));
  const jsonEffects    = normalize(join(jsonRoot  , 'effects'));

  const ghostRoot      = normalize(join(outputPath, 'ghost'));
  const ghostDialogues = normalize(join(ghostRoot , 'dialogues'));
  const ghostItems     = normalize(join(ghostRoot , 'items'));
  const ghostIds       = normalize(join(ghostRoot , 'ids'));
  const ghostInis      = normalize(join(ghostRoot , 'inis'));
  const ghostCreatures = normalize(join(ghostRoot , 'creatures'));
  const ghostEffects   = normalize(join(ghostRoot , 'effects'));

  const pathes: Pathes = {
    weiduExe  : weiduExe,
    gameFolder: gameFolder,
    tlkPath,
    gameName    : props.gameName,
    gameLanguage: props.gameLanguage,
    output: {
      root: outputPath,
      decimpiledBiff: {
        root     : decimpiledBiffRoot,
        cacheJson: decimpiledBiffCacheJson,
      },
      json: {
        dialogues: jsonDialogues,
        items    : jsonItems,
        ids      : jsonIds,
        inis     : jsonInis,
        creatures: jsonCreatures,
        effects  : jsonEffects,
      },
      saveJson: {
        dialogues: (resourceName: string, entry: unknown) => saveToFile(join(jsonDialogues, resourceName), entry),
        items    : (resourceName: string, entry: unknown) => saveToFile(join(jsonItems    , resourceName), entry),
        ids      : (resourceName: string, entry: unknown) => saveToFile(join(jsonIds      , resourceName), entry),
        inis     : (resourceName: string, entry: unknown) => saveToFile(join(jsonInis     , resourceName), entry),
        creatures: (resourceName: string, entry: unknown) => saveToFile(join(jsonCreatures, resourceName), entry),
        effects  : (resourceName: string, entry: unknown) => saveToFile(join(jsonEffects  , resourceName), entry),
      },
      ghost: {
        dialogues: ghostDialogues,
        items    : ghostItems,
        ids      : ghostIds,
        inis     : ghostInis,
        creatures: ghostCreatures,
        effects  : ghostEffects,
      },
      saveGhost: {
        dialogues: (resourceName: string, entry: unknown) => saveToFile(join(ghostDialogues, resourceName), entry),
        items    : (resourceName: string, entry: unknown) => saveToFile(join(ghostItems    , resourceName), entry),
        ids      : (resourceName: string, entry: unknown) => saveToFile(join(ghostIds      , resourceName), entry),
        inis     : (resourceName: string, entry: unknown) => saveToFile(join(ghostInis     , resourceName), entry),
        creatures: (resourceName: string, entry: unknown) => saveToFile(join(ghostCreatures, resourceName), entry),
        effects  : (resourceName: string, entry: unknown) => saveToFile(join(ghostEffects  , resourceName), entry),
      },
    },
  /* eslint-enable */
  };

  await mkdirsIfNotExists([
    pathes.output.root,
    pathes.output.decimpiledBiff.root,
    pathes.output.json.dialogues,
    pathes.output.json.items,
    pathes.output.json.ids,
    pathes.output.json.inis,
    pathes.output.json.creatures,
    pathes.output.json.effects,
    pathes.output.ghost.dialogues,
    pathes.output.ghost.items,
    pathes.output.ghost.ids,
    pathes.output.ghost.inis,
    pathes.output.ghost.creatures,
    pathes.output.ghost.effects,
  ], props.recreate || false);

  return pathes;
};

export default createPathes;
