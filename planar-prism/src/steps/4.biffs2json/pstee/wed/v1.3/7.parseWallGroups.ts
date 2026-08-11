import type { BufferReader } from '@/shared/bufferReader.js';
import type { WedWallGroup } from './7.parseWallGroups.types.js';

type RawWedWallGroup = Omit<WedWallGroup, 'polygonIndices'>;
type ParsePolygonIndicesLookupTableProps = Readonly<{
  reader: BufferReader;
  wallGroups: RawWedWallGroup[];
}>;
const parsePolygonIndicesLookupTable = ({
  reader,
  wallGroups,
}: ParsePolygonIndicesLookupTableProps): number[] => {
  const count = wallGroups.reduce((acc, cur) => Math.max(acc, cur.lookupStart + cur.lookupCount), 0);
  const table: number[] = [];

  for (let i = 0; i < count; i++) table.push(reader.ushort());

  return table;
};

type ParseWallGroupsProps = Readonly<{
  reader: BufferReader;
  count: number;
  polygonIndicesLookupTableOffset: number;
}>;
type ParseWallGroupsResponse = Readonly<{
  wallGroups: WedWallGroup[];
  polygonIndicesLookupTable: number[];
}>;
export const parseWallGroups = ({
  reader,
  count,
  polygonIndicesLookupTableOffset,
}: ParseWallGroupsProps): ParseWallGroupsResponse => {
  const rawWallGroups: RawWedWallGroup[] = [];

  for (let i = 0; i < count; i++) {
    const lookupStart = reader.ushort();
    const lookupCount = reader.ushort();

    const rawWallGroup: RawWedWallGroup = {
      lookupStart,
      lookupCount,
    };
    rawWallGroups.push(rawWallGroup);
  }

  const polygonIndicesLookupTable = parsePolygonIndicesLookupTable({
    reader: reader.fork(polygonIndicesLookupTableOffset),
    wallGroups: rawWallGroups,
  });

  const wallGroups = rawWallGroups.map(group => ({
    lookupStart: group.lookupStart,
    lookupCount: group.lookupCount,
    polygonIndices: polygonIndicesLookupTable.slice(group.lookupStart, group.lookupStart + group.lookupCount),
  }));

  return {
    wallGroups,
    polygonIndicesLookupTable,
  };
};
