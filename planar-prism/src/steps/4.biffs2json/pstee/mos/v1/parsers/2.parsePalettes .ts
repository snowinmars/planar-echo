import type { BufferReader } from '@/shared/bufferReader.js';

type ParsePalettesProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  start: number;
  end: number;
}>;
export const parsePalette = ({
  reader,
  resourceName,
  start,
  end,
}: ParsePalettesProps): Buffer => {
  const palette = reader.blob(start, end);
  if (palette.length !== end - start) throw new Error(`MOS palette size mismatch: expect '${end - start}', but got '${palette.length}' for resource '${resourceName}'`);
  return palette;
};
