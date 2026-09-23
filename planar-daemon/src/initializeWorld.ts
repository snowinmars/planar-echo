import { readFile } from 'fs/promises';
import { join } from 'path';

import { createWorld } from '@planar/kernel';
import {
  animationIdToHex4,
  DEFAULT_PLAYER_CRE,
  facingFromDirection,
  nothing,
  optional,
  PLAYER_ACTOR_ID,
} from '@planar/shared';

import { loadGhostAnimation, loadGhostAre, loadGhostCre } from './loadGhost/index.js';

import type { World } from '@planar/kernel';
import type { Envelope, Maybe } from '@planar/shared';

export const initializeWorld = async (
  ghostDir: string,
  areId: string,
  entrance: Maybe<string> = nothing(),
): Promise<World> => {
  const ghostAre = await loadGhostAre(ghostDir, areId);
  const bin = await readFile(join(ghostDir, 'assets', 'are', ghostAre.walk.walkBinName));
  const grid = new Uint8Array(bin);

  const ghostCre = await loadGhostCre(ghostDir, DEFAULT_PLAYER_CRE);

  const hex4 = animationIdToHex4(ghostCre.animationId);
  const _ = await loadGhostAnimation(ghostDir, hex4);

  if (ghostAre.entrances.length === 0) throw new Error(`Invalid are '${ghostAre.resourceName}': it has no entrances`);
  const validEntrance = optional(entrance, ghostAre.entrances[0]!.name);
  const namedEntrance = ghostAre.entrances.find(item => item.name === validEntrance);
  if (!namedEntrance) throw new Error(`Invalid are '${ghostAre.resourceName}': no entrance '${validEntrance}' found`);
  const spawn = {
    pos: {
      x: namedEntrance.at.x,
      y: namedEntrance.at.y,
    },
    facing: facingFromDirection(namedEntrance.direction),
  };

  const player: Envelope = {
    id: PLAYER_ACTOR_ID,
    cre: DEFAULT_PLAYER_CRE,
    pos: spawn.pos,
    facing: spawn.facing,
    animationId: ghostCre.animationId,
    sequence: 'stand',
  };

  return createWorld(ghostAre.resourceName, ghostAre.walk, grid, player);
};
