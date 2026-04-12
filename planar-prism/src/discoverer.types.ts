import type { Maybe } from '@planar/shared';

export const allCategories = ['who', 'state', 'response', 'sprite', 'sound', 'variable', 'key', 'item', 'scene', 'alignment', 'location', 'portal', 'journal', 'class', 'animation', 'script', 'door', 'movie', 'timeMeasure', 'spell', 'slot', 'trigger', 'env'] as const;
export type StoreDiscoveredType = (typeof allCategories)[number];
export type DiscoveredEventType = Exclude<StoreDiscoveredType, 'env'>; // env registrates from variable event type
export type Store = Map<StoreDiscoveredType, Set<string>>;
export type Discovered = Map<StoreDiscoveredType, string[]>;
export type DiscoveredEvent = Readonly<{
  type: DiscoveredEventType;
  name: string;
  env?: Maybe<string>;
  extendValueSpectreWith?: Maybe<(string | number)>;
}>;
export type DiscoverNext = (value: DiscoveredEvent) => void;
export type DiscovererResult = [DiscoverNext, () => Discovered];
