import { Rectangle, Sprite, Texture } from 'pixi.js';

import { DEFAULT_SPEED_PX_PER_TICK, TICK_HZ } from '@planar/kernel';
import {
  bamCycleIndex,
  bamEastMirror,
  CRE_ANIM_FPS,
  isNothing,
  nothing,
  pstStanceFromMotion,
} from '@planar/shared';

import type { Container } from 'pixi.js';

import type { Snapshot } from '@planar/kernel';
import type { GhostBam, Maybe, PstAnimStance } from '@planar/shared';

import type { CreAnimSet, CreArtCache, LoadedBam } from './loadCreArt.js';

const frameOf = (bam: GhostBam, index: number): Maybe<GhostBam['frames'][number]> => (
  bam.frames[index] ?? nothing()
);

const textureOf = (art: LoadedBam, frameIndex: number): Maybe<Texture> => {
  const hit = art.textures.get(frameIndex);
  if (hit) return hit;

  const frame = frameOf(art.bam, frameIndex);
  if (isNothing(frame) || frame.width <= 0 || frame.height <= 0) return nothing();

  const texture = new Texture({
    source: art.atlas.source,
    frame: new Rectangle(frame.atlasX, frame.atlasY, frame.width, frame.height),
  });
  art.textures.set(frameIndex, texture);
  return texture;
};

const pickArt = (set: CreAnimSet, stance: PstAnimStance): Maybe<LoadedBam> => {
  if (stance === 'run') return set.run ?? set.walk ?? set.stand ?? nothing();
  if (stance === 'walk') return set.walk ?? set.run ?? set.stand ?? nothing();
  return set.stand ?? set.walk ?? set.run ?? nothing();
};

export const clearCreSprites = (layer: Container, sprites: Map<number, Sprite>): void => {
  for (const sprite of sprites.values()) {
    sprite.destroy();
  }
  sprites.clear();
  layer.removeChildren();
};

export const syncCreSprites = (
  layer: Container,
  sprites: Map<number, Sprite>,
  snapshot: Snapshot,
  cache: CreArtCache,
): void => {
  const bodies = new Map(snapshot.bodies);
  const live = new Set<number>();

  for (const [id, actor] of snapshot.actors) {
    const body = bodies.get(id);
    if (!body) continue;

    const set = cache.cre.get(actor.cre);
    if (!set) continue;

    const stance = pstStanceFromMotion(
      body.path.length,
      body.speedPxPerTick,
      DEFAULT_SPEED_PX_PER_TICK,
    );
    const art = pickArt(set, stance);
    if (isNothing(art) || art.bam.cycles.length === 0) continue;

    const cycleIndex = Math.min(bamCycleIndex(body.facing, stance), art.bam.cycles.length - 1);
    const cycle = art.bam.cycles[cycleIndex] ?? art.bam.cycles[0];
    if (!cycle || cycle.frameIndices.length === 0) continue;

    const phase = Math.floor(snapshot.tick * CRE_ANIM_FPS / TICK_HZ);
    const frameIndex = cycle.frameIndices[phase % cycle.frameIndices.length];
    if (frameIndex === undefined) continue;

    const texture = textureOf(art, frameIndex);
    const frame = frameOf(art.bam, frameIndex);
    if (isNothing(texture) || isNothing(frame)) continue;

    live.add(id);

    let sprite = sprites.get(id);
    if (!sprite) {
      sprite = new Sprite(texture);
      sprite.eventMode = 'none';
      sprites.set(id, sprite);
      layer.addChild(sprite);
    }
    else {
      sprite.texture = texture;
    }

    sprite.anchor.set(frame.centerX / frame.width, frame.centerY / frame.height);
    sprite.position.set(body.pos.x, body.pos.y);
    sprite.scale.set(bamEastMirror(body.facing) ? -1 : 1, 1);
    sprite.zIndex = body.pos.y;
  }

  for (const [id, sprite] of sprites) {
    if (live.has(id)) continue;
    layer.removeChild(sprite);
    sprite.destroy();
    sprites.delete(id);
  }
};
