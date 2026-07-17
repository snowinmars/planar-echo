import type { Maybe } from '@planar/shared';

export type CreatureWidgetState = Readonly<{
  loading: boolean;
  creatures: string[];
  currentCreatureId: Maybe<string>;
}>;

export type CreatureWidgetActions = Readonly<{
  loadCreatures: () => Promise<void>;
  loadCreature: (creatureId: string) => Promise<void>;
}>;
