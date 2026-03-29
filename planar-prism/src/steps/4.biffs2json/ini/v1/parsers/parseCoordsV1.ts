import { parseDecOrThrow } from '@/shared/customParsers.js';
import type { Maybe } from '@planar/shared';

const parseCoordsV1 = (s: Maybe<string>): [number, number] => {
  if (!s) throw new Error(`Cannot parse Coords from nothing`);

  const stringCoords = s.slice(1, -1).split('.');
  if (stringCoords.length !== 2) throw new Error(`Suported format is '[x.y]', but you passed '${s}'. Why?`);

  const x = parseDecOrThrow(stringCoords[0]);
  const y = parseDecOrThrow(stringCoords[1]);
  return [x, y];
};

export default parseCoordsV1;
