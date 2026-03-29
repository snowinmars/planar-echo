import { parseDecOrNothing } from '@/shared/customParsers.js';
import type { Maybe } from '@planar/shared';
import type { CreatureIniSpecArea } from '../../types.js';

const parseSpecAreaV1 = (s: Maybe<string>): CreatureIniSpecArea => {
  if (!s) throw new Error(`Cannot parse SpecArea from nothing`);

  // [centerX,centerY,range,unknown?]
  const items = s.slice(1, -1).split(',');

  return {
    centerX: parseDecOrNothing(items[0]),
    centerY: parseDecOrNothing(items[1]),
    range: parseDecOrNothing(items[2]),
    other: items[3],
  };
};

export default parseSpecAreaV1;
