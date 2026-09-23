import { maybe } from '../maybe.js';

import type { Maybe } from '../maybe.js';

export type MemoStore<K, V extends NonNullable<unknown>> = Readonly<{
  load: (key: K, fn: () => Promise<V>) => void;
  get: (key: K) => Maybe<V>;
  waitAllLoadings: () => Promise<void>;
}>;

export const createMemoStore = <K, V extends NonNullable<unknown>>(): MemoStore<K, V> => {
  const values = new Map<K, V>();
  const pending = new Map<K, Promise<void>>();
  const waiters: Array<() => void> = [];

  const settle = (): void => {
    const everythingLoaded = pending.size === 0;
    if (!everythingLoaded) return;

    const waitersCopy = waiters.splice(0); // to avoid race
    for (const resolve of waitersCopy) resolve();
  };

  const get = (key: K): Maybe<V> => maybe(values.get(key));

  const load = (key: K, fn: () => Promise<V>): void => {
    const alreadyLoaded = values.has(key);
    const alreadyPending = pending.has(key);
    if (alreadyLoaded || alreadyPending) return;

    const work: Promise<void> = (async (): Promise<void> => {
      try {
        values.set(key, await fn());
      }
      finally {
        pending.delete(key);
        settle();
      }
    })();

    pending.set(key, work);
    work.catch(err => console.error(err));
  };

  const waitAllLoadings = async (): Promise<void> => {
    const everythingLoaded = pending.size === 0;
    if (everythingLoaded) return;

    await new Promise<void>((resolve) => {
      waiters.push(resolve);
    });
  };

  return {
    load,
    get,
    waitAllLoadings,
  };
};
