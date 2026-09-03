import { readFile } from 'fs/promises';
import { join } from 'path';
import { createWorld, DEFAULT_ARE, DEFAULT_PLAYER_CRE } from '@planar/kernel';
import {
  animationIdToIniId,
  evalGhostFactory,
  facingFromDirection,
  isNothing,
  nothing,
} from '@planar/shared';
import { fileExists } from '@planar/shared/node';

import type { NpcSpawn, PlayerSpawn, World } from '@planar/kernel';
import type { GhostAre, GhostCre, GhostIni, Maybe } from '@planar/shared';

const ghostJs = (ghostDir: string, kind: 'are' | 'cre' | 'ini', resourceName: string): string => (
  join(ghostDir, 'ghost', kind, 'dist', `${resourceName}.js`)
);

const loadGhostJs = async <T>(filePath: string): Promise<T> => {
  const src = await readFile(filePath, 'utf8');
  return evalGhostFactory<T>(src)();
};

const personalSpaceOf = (ini: GhostIni): Maybe<number> => {
  const general = ini.general;
  if (isNothing(general)) return nothing();
  return general.personalSpace;
};

const loadCrePersonalSpace = async (ghostDir: string, cre: string): Promise<Maybe<number>> => {
  const crePath = ghostJs(ghostDir, 'cre', `${cre}.cre`);
  const creOk = await fileExists(crePath);
  if (!creOk) return nothing();

  const ghostCre = await loadGhostJs<GhostCre>(crePath);
  const iniId = animationIdToIniId(ghostCre.animationId);
  const iniPath = ghostJs(ghostDir, 'ini', iniId);
  const iniOk = await fileExists(iniPath);
  if (!iniOk) return nothing();

  const ini = await loadGhostJs<GhostIni>(iniPath);
  return personalSpaceOf(ini);
};

export const loadAreaWalk = async (
  ghostDir: string,
  are: string = DEFAULT_ARE,
  entrance: Maybe<string> = nothing(),
): Promise<World> => {
  const areId = are.trim();
  const src = await readFile(ghostJs(ghostDir, 'are', areId), 'utf8');
  const ghostAre = evalGhostFactory<GhostAre>(src)();
  if (!ghostAre.walk) {
    throw new Error(`${areId}: no walk`);
  }
  const bin = await readFile(join(ghostDir, 'assets', 'are', ghostAre.walk.walkBinName));

  const playerSpace = await loadCrePersonalSpace(ghostDir, DEFAULT_PLAYER_CRE);
  if (isNothing(playerSpace)) {
    throw new Error(`${DEFAULT_PLAYER_CRE}: missing cre or animation ini`);
  }

  const player: PlayerSpawn = {
    cre: DEFAULT_PLAYER_CRE,
    personalSpace: playerSpace,
  };

  const npcs: NpcSpawn[] = [];
  for (const actor of ghostAre.actors) {
    const cre = actor.cre;
    if (!cre) {
      console.error(`${areId}: skip NPC '${actor.name}': empty cre`);
      continue;
    }

    try {
      const space = await loadCrePersonalSpace(ghostDir, cre);
      if (isNothing(space)) {
        console.error(`${areId}: skip NPC '${cre}': missing cre or animation ini`);
        continue;
      }

      npcs.push({
        cre,
        personalSpace: space,
        pos: { x: actor.at.x, y: actor.at.y },
        facing: facingFromDirection(actor.direction),
      });
    }
    catch (err: unknown) {
      console.error(`${areId}: skip NPC '${cre}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return createWorld(ghostAre, new Uint8Array(bin), entrance, player, npcs);
};
