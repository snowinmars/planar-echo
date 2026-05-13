import { Subject } from 'rxjs';
import { allCategories } from './discoverer.types.js';

import { isNothing, just, type Maybe } from '@planar/shared';
import type {
  Discovered,
  DiscoveredEvent,
  DiscoveredEventType,
  DiscovererResult,
  Store,
  StoreDiscoveredType,
} from './discoverer.types.js';

const createStore = (): Store => {
  const entries: [StoreDiscoveredType, Set<string>][] = allCategories.map(type => [
    type,
    new Set<string>(),
  ]);
  return new Map(entries);
};

const register = (store: Store, type: DiscoveredEventType, name: string, env?: Maybe<string>): void => {
  if (!type) throw new Error(`Type '${type}' is out of range`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  store.get(type)!.add(name);
  if (type === 'variable' && env) store.get('env')!.add(env);
};

const storeToDiscovered = (store: Store, variableSpectres: Map<string, Set<string | number>>): Discovered => {
  const entries: [StoreDiscoveredType, string[]][] = allCategories.map(type => [
    type,
    [...store.get(type)!.values()],
  ]);
  return {
    variables: new Map(entries),
    spectres: variableSpectres,
  };
};

const discoverer = (): DiscovererResult => {
  const event$ = new Subject<DiscoveredEvent>();
  const store = createStore();
  const variableSpectres = new Map<string, Set<string | number>>();

  const subscription = event$.subscribe(({ type, name, env, extendValueSpectreWith }) => {
    register(store, type, name, env);

    if (type === 'variable' && !isNothing(extendValueSpectreWith)) {
      if (!variableSpectres.has(name)) {
        variableSpectres.set(name, new Set());
      }
      variableSpectres.get(name)!.add(just(extendValueSpectreWith));
    }
  });
  const discover = (event: DiscoveredEvent): void => event$.next(event);
  const done = (): Discovered => {
    subscription.unsubscribe();
    event$.complete();
    return storeToDiscovered(store, variableSpectres);
  };
  return [discover, done];
};

export default discoverer;
