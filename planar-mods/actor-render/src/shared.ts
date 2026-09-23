import type { ClientModHost, ModBag } from '@planar/shared';

import type {
  ArtBag,
  Layer,
  Pixi,
} from './types.js';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== undefined && value !== null;

const hasFunctions = (value: unknown, ...keys: string[]): value is Record<string, unknown> => {
  if (!isRecord(value)) return false;

  for (const key of keys) if (typeof value[key] !== 'function') return false;

  return true;
};

export const pixiOf = (host: ClientModHost): Pixi => {
  const pixi = host.pixi;

  if (!hasFunctions(pixi, 'Sprite', 'Texture', 'Rectangle')) throw new Error('actor-render: host.pixi is not the shell Pixi bag: it does not have all the required functions');

  const texture = (pixi as { Texture: { from?: unknown } }).Texture;
  if (typeof texture.from !== 'function') throw new Error('actor-render: host.pixi.Texture.from is missing');

  return pixi as unknown as Pixi;
};

export const layerOf = (host: ClientModHost): Layer => {
  const layer = host.layers.bodies;

  if (!hasFunctions(layer, 'addChild', 'removeChild', 'removeChildren')) throw new Error('actor-render: host.layers.bodies is not a proper layer container: it does not have all the required functions');

  return layer as Layer;
};

export const bagOf = (ctx: { bag: ModBag }): ArtBag => {
  const bag = ctx.bag as Partial<ArtBag>;

  const noSprites = !(bag.sprites instanceof Map);
  if (noSprites) bag.sprites = new Map();

  const noTextures = !(bag.textures instanceof Map);
  if (noTextures) bag.textures = new Map();

  const noWarned = !(bag.warned instanceof Set);
  if (noWarned) bag.warned = new Set();

  return bag as ArtBag;
};

export const warn = (ctx: { bag: ModBag }, key: string, message: string): void => {
  const bag = bagOf(ctx);
  const already = bag.warned.has(key);
  if (already) return;

  bag.warned.add(key);
  console.warn(message);
};
