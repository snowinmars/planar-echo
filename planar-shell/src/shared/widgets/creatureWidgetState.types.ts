import type { Maybe } from '@planar/shared';

export type CreatureWidgetState = {
  loading: boolean;
  creatures: string[];
  currentCreatureId: Maybe<string>;
};

export type CreatureWidgetActions = {
  loadCreatures: () => Promise<void>;
  loadCreature: (creatureId: string) => Promise<void>;
};
