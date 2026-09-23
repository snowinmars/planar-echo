export type Nothing = null | undefined | void;
export type Maybe<T> = NonNullable<T> | Nothing;
export const just = <T>(maybe: Maybe<T>): T => {
  if (maybe || maybe === false || maybe === 0 || maybe === '') return maybe;
  throw new Error('Null reference exception');
};
export const maybe = <T>(value: T): Maybe<T> => value ?? null;
export const maybeMap = <T, U>(value: Maybe<T>, map: (x: T) => U): Maybe<U> => isNothing(value) ? nothing() : maybe(map(value));
export const nothing = (): Nothing => undefined;
export const isNothing = <T>(x: Maybe<T>): x is Nothing => x === null || x === undefined;
export const optional = <T>(x: Maybe<T>, other: T): T => isNothing(x) ? other : x;
