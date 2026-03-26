import type { Nothing } from './maybe.js';

export type SafeError = Readonly<{ toString: (() => string) | Nothing }>;
