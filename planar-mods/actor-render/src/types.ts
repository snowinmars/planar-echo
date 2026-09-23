export type Pixi = {
  Sprite: { new(t: unknown): SpriteLike };
  Texture: {
    new(opts: unknown): unknown;
    from: (source: HTMLCanvasElement) => unknown;
  };
  Rectangle: { new(x: number, y: number, w: number, h: number): unknown };
};

export type SpriteLike = {
  texture: unknown;
  eventMode: string;
  zIndex: number;
  destroy: () => void;
  anchor: { set: (x: number, y: number) => void };
  position: { set: (x: number, y: number) => void };
  scale: { set: (x: number, y: number) => void };
};

export type Layer = {
  addChild: (c: SpriteLike) => void;
  removeChild: (c: SpriteLike) => void;
  removeChildren: () => unknown[];
};

export type ArtBag = {
  sprites: Map<number, SpriteLike>;
  textures: Map<string, Map<number, unknown>>;
  warned: Set<string>;
};
