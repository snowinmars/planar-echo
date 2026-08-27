import type { Writer } from '@/shared/writer.js';

export const escapeSingleQuote = (x: string): string => x
  .replaceAll(`\\`, `\\\\`)
  .replaceAll(`'`, `\\'`)
  .replaceAll(`\r`, `\\r`)
  .replaceAll(`\n`, `\\n`);

export const writeFlags = <T extends string>(writer: Writer, flagsValues: T[], propertyName: string, offset: number) => {
  if (flagsValues.length === 0) {
    writer.writeLine(`${propertyName}: [],`, offset);
    return;
  }

  writer.writeLine(`${propertyName}: [`, offset);
  for (const flag of flagsValues) writer.writeLine(`'${escapeSingleQuote(flag)}',`, offset + 2);
  writer.writeLine('],', offset);
};

export const writeStringArray = (
  writer: Writer,
  propertyName: string,
  values: string[],
  offset: number,
): void => {
  if (values.length === 0) {
    writer.writeLine(`${propertyName}: [],`, offset);
    return;
  }

  writer.writeLine(`${propertyName}: [`, offset);
  for (const value of values) writer.writeLine(`'${escapeSingleQuote(value)}',`, offset + 2);
  writer.writeLine(`],`, offset);
};

export const writeNumberArray = (
  writer: Writer,
  propertyName: string,
  values: number[],
  offset: number,
): void => {
  if (values.length === 0) {
    writer.writeLine(`${propertyName}: [],`, offset);
    return;
  }

  writer.writeLine(`${propertyName}: [`, offset);
  for (const value of values) writer.writeLine(`${value},`, offset + 2);
  writer.writeLine(`],`, offset);
};
