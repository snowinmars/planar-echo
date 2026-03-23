import { Nothing } from './maybe';

export type SafeError = Readonly<{ toString: (() => string) | Nothing }>;
