import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreVertexV10 } from './8.parseVertices.types.js';

const parseVertex = (reader: BufferReader): RawAreVertexV10 => {
  const x = reader.short();
  const y = reader.short();

  const rawAreVertexV10: RawAreVertexV10 = {
    x,
    y,
  };

  return rawAreVertexV10;
};

type ParseVerticesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseVertices = ({
  reader,
  count,
}: ParseVerticesProps): RawAreVertexV10[] => {
  const vertices: RawAreVertexV10[] = [];

  for (let i = 0; i < count; i++) vertices.push(parseVertex(reader));

  return vertices;
};
