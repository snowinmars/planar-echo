export type Nothing = null | undefined | void;
export type Maybe<T> = NonNullable<T> | Nothing;
export const just = <T>(maybe: Maybe<T>): T => {
  if (maybe || maybe === 0 || maybe === '') return maybe;
  throw new Error('Null reference exception');
};
export const maybe = <T>(value: T): Maybe<T> => value ?? null;
export const nothing = (): Nothing => undefined;
export const isNothing = <T>(x: Maybe<T>): boolean => x === null || x === undefined;
