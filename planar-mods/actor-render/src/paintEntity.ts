import {
  bamCycleIndexForFacingCycle,
  bamEastMirror,
  CRE_ANIM_FPS,
  getGhostIniAnimationSlot,
  GHOST_INI_ANIMATION_SLOT_KEYS,
  isNothing,
  TICK_HZ,
} from '@planar/shared';

import {
  bagOf,
  layerOf,
  pixiOf,
  warn,
} from './shared.js';

import type {
  ClientModHost,
  Envelope,
  GhostIniAnimationSlotKey,
  LoadedBamArt,
  ModBag,
} from '@planar/shared';

const LOCOMOTION_SLOTS: readonly GhostIniAnimationSlotKey[] = ['stand', 'walk', 'run'];
const STUB_PX = 32;
const STUB_COLOR = '#ff40ff';

let pinkTexture: unknown;

const pinkOf = (host: ClientModHost): unknown => {
  if (pinkTexture) return pinkTexture;
  const canvas = document.createElement('canvas');
  canvas.width = STUB_PX;
  canvas.height = STUB_PX;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('actor-render: cannot create stub canvas');
  ctx.fillStyle = STUB_COLOR;
  ctx.fillRect(0, 0, STUB_PX, STUB_PX);
  pinkTexture = pixiOf(host).Texture.from(canvas);
  return pinkTexture;
};

const actorSlots = (sequence: string): GhostIniAnimationSlotKey[] => {
  const slots: GhostIniAnimationSlotKey[] = [...LOCOMOTION_SLOTS];
  const known = GHOST_INI_ANIMATION_SLOT_KEYS.includes(sequence as GhostIniAnimationSlotKey);
  if (known && !slots.includes(sequence as GhostIniAnimationSlotKey)) {
    slots.push(sequence as GhostIniAnimationSlotKey);
  }
  return slots;
};

export const needActorArt = (host: ClientModHost, entity: Envelope): void => {
  host.assets.need({
    kind: 'animation',
    id: entity.animationId,
    slots: actorSlots(entity.sequence),
  });
};

const textureOf = (host: ClientModHost, ctx: { bag: ModBag }, bamId: string, art: LoadedBamArt, frameIndex: number): unknown => {
  const bag = bagOf(ctx);
  let byFrame = bag.textures.get(bamId);
  if (!byFrame) {
    byFrame = new Map();
    bag.textures.set(bamId, byFrame);
  }
  const cached = byFrame.get(frameIndex);
  if (cached) return cached;
  const frame = art.bam.frames[frameIndex];
  if (!frame || frame.width <= 0 || frame.height <= 0) return undefined;
  const pixi = pixiOf(host);
  const texture = new pixi.Texture({
    source: art.atlas.source,
    frame: new pixi.Rectangle(frame.atlasX, frame.atlasY, frame.width, frame.height),
  });
  byFrame.set(frameIndex, texture);
  return texture;
};

const placeSprite = (
  host: ClientModHost,
  ctx: { bag: ModBag },
  entity: Envelope,
  texture: unknown,
  anchorX: number,
  anchorY: number,
  scaleX: number,
): void => {
  const bag = bagOf(ctx);
  const layer = layerOf(host);
  let sprite = bag.sprites.get(entity.id);
  if (!sprite) {
    sprite = new (pixiOf(host).Sprite)(texture);
    sprite.eventMode = 'none';
    bag.sprites.set(entity.id, sprite);
    layer.addChild(sprite);
  }
  else {
    sprite.texture = texture;
  }
  sprite.anchor.set(anchorX, anchorY);
  sprite.position.set(entity.pos.x, entity.pos.y);
  sprite.scale.set(scaleX, 1);
  sprite.zIndex = entity.pos.y;
};

const paintStub = (host: ClientModHost, ctx: { bag: ModBag }, entity: Envelope): void => {
  placeSprite(host, ctx, entity, pinkOf(host), 0.5, 0.5, 1);
};

export const paintEntity = (host: ClientModHost, ctx: { bag: ModBag }, entity: Envelope): void => {
  const animation = host.assets.peek({ kind: 'animation', id: entity.animationId });
  if (isNothing(animation)) {
    paintStub(host, ctx, entity);
    return;
  }

  let slot;
  try {
    slot = getGhostIniAnimationSlot(animation, entity.sequence);
  }
  catch {
    warn(ctx, `seq-${entity.id}-${entity.sequence}`, `actor-render: broken sequence '${entity.sequence}' for ${entity.cre}`);
    paintStub(host, ctx, entity);
    return;
  }

  const art = host.assets.peek({ kind: 'bam', id: slot.bam });
  if (isNothing(art)) {
    paintStub(host, ctx, entity);
    return;
  }

  if (art.bam.cycles.length === 0) {
    warn(ctx, `bam-${slot.bam}`, `actor-render: missing BAM '${slot.bam}' for ${entity.cre}`);
    paintStub(host, ctx, entity);
    return;
  }

  const cycleIndex = Math.min(
    bamCycleIndexForFacingCycle(entity.facing, slot.facingCycle),
    art.bam.cycles.length - 1,
  );
  const cycle = art.bam.cycles[cycleIndex] ?? art.bam.cycles[0];
  if (!cycle || cycle.frameIndices.length === 0) {
    paintStub(host, ctx, entity);
    return;
  }

  const phase = Math.floor(host.meta().tick * CRE_ANIM_FPS / TICK_HZ);
  const frameIndex = cycle.frameIndices[phase % cycle.frameIndices.length];
  if (frameIndex === undefined) {
    paintStub(host, ctx, entity);
    return;
  }

  const texture = textureOf(host, ctx, slot.bam, art, frameIndex);
  const frame = art.bam.frames[frameIndex];
  if (texture === undefined || !frame) {
    paintStub(host, ctx, entity);
    return;
  }

  placeSprite(
    host,
    ctx,
    entity,
    texture,
    frame.centerX / frame.width,
    frame.centerY / frame.height,
    bamEastMirror(entity.facing) ? -1 : 1,
  );
};
