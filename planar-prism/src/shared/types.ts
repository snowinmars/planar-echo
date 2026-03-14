export type PartialWriteable<T> = Partial<{ -readonly [P in keyof T]: T[P] }>;
export type LogPercent = (x: number, r: string) => void;
