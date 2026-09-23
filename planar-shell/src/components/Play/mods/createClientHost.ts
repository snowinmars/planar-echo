import { isNothing, nothing } from '@planar/shared';

import { emptyMeta, metaOfSnapshot } from './ghostReader.js';

import type { Application } from 'pixi.js';
import type { Viewport } from 'pixi-viewport';

import type {
  ClientAssets,
  ClientModHost,
  EntityId,
  Envelope,
  Maybe,
  ModBag,
  Snapshot,
  VisibleBounds,
} from '@planar/shared';

export type ClientSession = {
  snapshot: Maybe<Snapshot>;
  mapWidth: number;
  mapHeight: number;
  bags: Map<string, ModBag>;
  host: ClientModHost;
};

export const bagOf = (session: ClientSession, modId: string): ModBag => {
  const existing = session.bags.get(modId);
  if (existing) return existing;

  const bag: ModBag = {};
  session.bags.set(modId, bag);
  return bag;
};

export const wipeClientStorage = (session: ClientSession): void => {
  session.bags.clear();
};

export type CreateClientHostProps = Readonly<{
  session: ClientSession;
  layers: ClientModHost['layers'];
  pixi: unknown;
  assets: ClientAssets;
  viewport: Viewport;
  app: Application;
}>;

export const createClientHost = ({
  session,
  layers,
  pixi,
  assets,
  viewport,
  app,
}: CreateClientHostProps): ClientModHost => {
  return {
    entities: () => (isNothing(session.snapshot) ? [] : session.snapshot.entities),
    entity: (id: EntityId): Maybe<Envelope> => {
      if (isNothing(session.snapshot)) return nothing();
      return session.snapshot.entities.find(row => row.id === id);
    },
    meta: () => (isNothing(session.snapshot) ? emptyMeta() : metaOfSnapshot(session.snapshot)),
    layers,
    visibleBounds: (): VisibleBounds => {
      const bounds = viewport.getVisibleBounds();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    },
    setMapSize: (width: number, height: number): void => {
      session.mapWidth = width;
      session.mapHeight = height;
      viewport.resize(app.screen.width, app.screen.height, width, height);
    },
    assets,
    pixi,
  };
};
