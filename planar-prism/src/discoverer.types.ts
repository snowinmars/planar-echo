import type { Maybe } from '@planar/shared';

export const allCategories = [
  'alignment',
  'animation',
  'class',
  'disguise',
  'door',
  'env',
  'item',
  'journal',
  'journalType',
  'key',
  'location',
  'message',
  'movie',
  'portal',
  'proficiency',
  'response',
  'scene',
  'script',
  'scriptLevel',
  'slot',
  'sound',
  'spell',
  'stat',
  'state',
  'timeMeasure',
  'timer',
  'trigger',
  'variable',
  'who',
] as const;
export type StoreDiscoveredType = (typeof allCategories)[number];
export type DiscoveredEventType = Exclude<StoreDiscoveredType, 'env'>; // env registrates from variable event type
export type Store = Map<StoreDiscoveredType, Set<string>>;
export type Discovered = {
  variables: Map<StoreDiscoveredType, string[]>;
  variableInfos: Map<string, VariableInfo>;
};
type SpecteValue = string | number;
export type DiscoveredEvent = Readonly<{
  type: DiscoveredEventType;
  name: string;
  env?: Maybe<string>;
  extendValueSpectreWith?: Maybe<SpecteValue>;
  forceType?: VariableInfo['forceType'];
}>;
export type DiscoverNext = (value: DiscoveredEvent) => void;
export type DiscovererResult = [DiscoverNext, () => Discovered];
export type VariableInfo = Readonly<{
  spectre: Set<SpecteValue>;
  forceType?: Maybe<'number' | 'boolean' | 'string'>;
}>;
