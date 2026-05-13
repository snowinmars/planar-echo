import type { Maybe } from '@planar/shared';

export const allCategories = [
  'alignment',
  'animation',
  'class',
  'door',
  'env',
  'item',
  'journal',
  'key',
  'location',
  'movie',
  'portal',
  'response',
  'scene',
  'script',
  'scriptLevel',
  'slot',
  'sound',
  'spell',
  'sprite',
  'stat',
  'state',
  'timeMeasure',
  'trigger',
  'variable',
  'who',
] as const;
export type StoreDiscoveredType = (typeof allCategories)[number];
export type DiscoveredEventType = Exclude<StoreDiscoveredType, 'env'>; // env registrates from variable event type
export type Store = Map<StoreDiscoveredType, Set<string>>;
export type Discovered = {
  variables: Map<StoreDiscoveredType, string[]>;
  spectres: Map<string, Set<string | number>>;
};
export type DiscoveredEvent = Readonly<{
  type: DiscoveredEventType;
  name: string;
  env?: Maybe<string>;
  extendValueSpectreWith?: Maybe<(string | number)>;
}>;
export type DiscoverNext = (value: DiscoveredEvent) => void;
export type DiscovererResult = [DiscoverNext, () => Discovered];
