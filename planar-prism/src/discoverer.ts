import { Subject } from 'rxjs';
import { allCategories } from './discoverer.types.js';
import { isNothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type {
  Discovered,
  DiscoveredEvent,
  DiscoveredEventType,
  DiscovererResult,
  Store,
  StoreDiscoveredType,
  VariableInfo,
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
  const addVariableEnv = type === 'variable' && env;
  const addTimerEnv = type === 'timer' && env;
  if (addVariableEnv) store.get('env')!.add(env);
  if (addTimerEnv) store.get('env')!.add(env);
};

const storeToDiscovered = (store: Store, variableInfos: Map<string, VariableInfo>): Discovered => {
  const entries: [StoreDiscoveredType, string[]][] = allCategories.map(type => [
    type,
    [...store.get(type)!.values()],
  ]);
  return {
    variables: new Map(entries),
    variableInfos: variableInfos,
  };
};

const discoverer = (): DiscovererResult => {
  const event$ = new Subject<DiscoveredEvent>();
  const store = createStore();
  const variableInfos = new Map<string, VariableInfo>();

  const subscription = event$.subscribe(({ type, name, env, extendValueSpectreWith, forceType }) => {
    register(store, type, name, env);

    if (type === 'variable' || type === 'key') {
      const variableInfo = variableInfos.get(name)!;

      if (!variableInfos.has(name)) {
        const newSpectre = isNothing(extendValueSpectreWith) ? new Set<string | number>() : new Set<string | number>([extendValueSpectreWith]);
        variableInfos.set(name, {
          spectre: newSpectre,
          forceType,
        });
      }
      else {
        const newSpectre = isNothing(extendValueSpectreWith) ? variableInfo.spectre : new Set<string | number>([...variableInfo.spectre, extendValueSpectreWith]);

        const overrideForceType = variableInfo.forceType && forceType && variableInfo.forceType !== forceType;
        if (overrideForceType) throw new Error(`Attempt to force type on variable '${name}' twice: '${variableInfo.forceType}' -> '${forceType}'`);
        const newForceType = variableInfo.forceType ?? forceType;

        variableInfos.set(name, {
          spectre: newSpectre,
          forceType: newForceType,
        });
      }
    }
  });
  const discover = (event: DiscoveredEvent): void => event$.next(event);
  const done = (): Discovered => {
    subscription.unsubscribe();
    event$.complete();
    return storeToDiscovered(store, variableInfos);
  };
  return [discover, done];
};

export default discoverer;
