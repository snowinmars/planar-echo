export const evalGhostFactory = <T>(src: string): (() => T) => (0, eval)(src) as (() => T);
