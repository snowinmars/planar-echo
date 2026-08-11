import type { BufferReader } from '@/shared/bufferReader.js';
import type { WedVertex } from './4.parseVertices.types.js';

const parseVertex = (reader: BufferReader): WedVertex => ({
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
}: ParseVerticesProps): WedVertex[] => {
  const vertices: WedVertex[] = [];

  for (let i = 0; i < count; i++) {
    const vertex = parseVertex(reader);
    vertices.push(vertex);
  }

  return vertices;
};
