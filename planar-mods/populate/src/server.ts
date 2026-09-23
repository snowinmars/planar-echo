import { DEFAULT_PLAYER_CRE, facingFromDirection } from '@planar/shared';

import type { HookEffects, ServerModHost, ServerOnAreaLoadCtx, WorldEffect } from '@planar/shared';

export const onAreaLoad = async (host: ServerModHost, _: ServerOnAreaLoadCtx): Promise<HookEffects> => {
  const paused = host.meta().paused;
  if (paused) return { effects: [] };

  const are = await host.serverGhostReader.current.are();
  const effects: WorldEffect[] = [];
  for (const actor of are.actors) {
    const cre = actor.cre;
    if (!cre) {
      console.error(`${are.resourceName}: skip NPC '${actor.name}': empty cre`);
      continue;
    }
    if (cre.toLowerCase() === DEFAULT_PLAYER_CRE) continue;

    try {
      const ghostCre = await host.serverGhostReader.load.cre(cre);
      effects.push({
        type: 'spawn',
        row: {
          cre,
          pos: { x: actor.at.x, y: actor.at.y },
          facing: facingFromDirection(actor.direction),
          animationId: ghostCre.animationId,
          sequence: 'stand',
        },
      });
    }
    catch (err: unknown) {
      console.error(`${are.resourceName}: skip NPC '${cre}': ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { effects };
};
