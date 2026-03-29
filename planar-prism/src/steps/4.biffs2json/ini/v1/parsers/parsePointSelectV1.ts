import type { Maybe } from '@planar/shared';
import type { CreatureIniPointSelect } from '../../types.js';

const parsePointSelectV1 = (s: Maybe<string>): CreatureIniPointSelect => {
  if (!s) throw new Error(`Cannot parse PointSelect from nothing`);

  switch (s.toLowerCase()) {
    case 'e': return 'e=POINT_SELECT_EXPLICIT';
    case 'i': return 'i=POINT_SELECT_INDEXED_SEQUENTIAL';
    case 'r': return 'r=POINT_SELECT_RANDOM_SEQUENTIAL';
    case 's': return 's=POINT_SELECT_SEQUENTIAL';
    default: throw new Error(`Cannot parse PointSelect from ${s}`);
  }
};

export default parsePointSelectV1;
