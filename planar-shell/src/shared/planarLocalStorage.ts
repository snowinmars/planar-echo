import { isNothing, maybe, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import { filter, fromEvent, map, merge, Observable, Subject } from 'rxjs';

const NAMESPACE = 'planar-echo' as const;
const CURRENT_WIDGET = 'current-widget';
const buildKey = (key: string): string => `${NAMESPACE}-${key}`;

const key$ = new Subject<string>();

export const planarLocalStorage = {
  get: <T = string>(key: string, either: Maybe<T> = nothing()): Maybe<T> => {
    const value = localStorage.getItem(buildKey(key));
    if (!value) return isNothing(either) ? nothing() : either;
    return maybe(JSON.parse(value) as T);
  },

  set: <T = string>(key: string, value: T): void => {
    const serialized = JSON.stringify(value);
    localStorage.setItem(buildKey(key), serialized);
    key$.next(key);
  },

  remove: (key: string): void => {
    localStorage.removeItem(buildKey(key));
    key$.next(key);
  },

  clear: (): void => {
    const customKeys = Object.keys(localStorage).filter(key => key.startsWith(`${NAMESPACE}-`));

    for (const key of customKeys) {
      localStorage.removeItem(key);
      const originalKey = key.slice(NAMESPACE.length + 1);
      key$.next(originalKey);
    }
  },

  has: (key: string): boolean => localStorage.getItem(buildKey(key)) !== null,

  onKeyChange: (key: string): Observable<string> => {
    const crossTab$ = fromEvent<StorageEvent>(window, 'storage').pipe(
      filter(e => e.key === buildKey(key)),
      map(() => key),
    );
    const sameTab$ = key$.pipe(filter(x => x === key));

    return merge(sameTab$, crossTab$);
  },

  get namespace() {
    return NAMESPACE;
  },

  get currentWidget() {
    return CURRENT_WIDGET;
  },
};

export default planarLocalStorage;
