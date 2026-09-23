import type {
  EntityId,
  Envelope,
  Meta,
  WalkGrid,
} from '@planar/shared';

export type World = {
  meta: Meta;
  walkBase: Uint8Array;
  walkGrid: WalkGrid;
  entities: Map<EntityId, Envelope>;
};
