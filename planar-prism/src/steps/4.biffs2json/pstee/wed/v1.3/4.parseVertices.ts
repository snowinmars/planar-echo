import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawWedVertex } from './4.parseVertices.types.js';

const parseVertex = (reader: BufferReader): RawWedVertex => ({
  x: reader.short(),
  y: reader.short(),
});

type ParseVerticesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseVertices = ({
  reader,
  count,
}: ParseVerticesProps): RawWedVertex[] => {
  const vertices: RawWedVertex[] = [];

  for (let i = 0; i < count; i++) {
    const vertex = parseVertex(reader);
    vertices.push(vertex);
  }

  return vertices;
};
