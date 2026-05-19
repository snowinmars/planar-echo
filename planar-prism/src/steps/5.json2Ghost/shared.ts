import type { Writer } from '@/shared/writer.js';

export const escapeSingleQuote = (x: string): string => x.replaceAll(`'`, `\\'`);

export const writeFlags = <T extends string>(writer: Writer, flagsValues: T[], propertyName: string, offset: number) => {
  writer.writeLine(`${propertyName}: [`, offset);
  for (const flag of flagsValues) writer.writeLine(`'${escapeSingleQuote(flag)}',`, offset + 2);
  writer.writeLine('],', offset);
};
