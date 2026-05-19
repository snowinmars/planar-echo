export const maxInt = 4294967295;
export const normalizeRef = (value: number, max = maxInt): number => value === max ? -1 : value;
