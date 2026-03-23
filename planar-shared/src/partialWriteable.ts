export type PartialWriteable<T> = Partial<{ -readonly [P in keyof T]: T[P] }>;
