import { isNothing, maybe, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

const NAMESPACE = 'planar-echo' as const;
const buildKey = (key: string): string => `${NAMESPACE}-${key}`;

export const planarLocalStorage = {
  get: <T = string>(key: string, either: Maybe<T> = nothing()): Maybe<T> => {
    const value = localStorage.getItem(buildKey(key));
    if (!value) {
      if (isNothing(either)) return nothing();
      return either;
    }
    return maybe(JSON.parse(value) as T);
  },

  set: <T = string>(key: string, value: T): void => {
    const serialized = JSON.stringify(value);
    localStorage.setItem(buildKey(key), serialized);
  },

  remove: (key: string): void => {
    localStorage.removeItem(buildKey(key));
  },

  clear: (): void => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(`${NAMESPACE}-`))
      .forEach(key => localStorage.removeItem(key));
  },

  has: (key: string): boolean => {
    return localStorage.getItem(buildKey(key)) !== null;
  },

  get namespace() {
    return NAMESPACE;
  },
};

export default planarLocalStorage;
