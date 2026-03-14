import type { Maybe } from '../../../../../shared/maybe.js';
import type { Direction } from '../../types.js';

const parseDirectionV1 = (s: Maybe<string>): Direction => {
  if (!s) throw new Error(`Cannot parse Direction from nothing`);

  switch (s) {
    case '0': return '0=south';
    case '1': return '1=south-south-west';
    case '2': return '2=south-west';
    case '3': return '3=south-west-west';
    case '4': return '4=west';
    case '5': return '5=north-west-west';
    case '6': return '6=north-west';
    case '7': return '7=north-north-west';
    case '8': return '8=north';
    case '9': return '9=north-north-east';
    case '10': return '10=north-east';
    case '11': return '11=north-east-east';
    case '12': return '12=east';
    case '13': return '13=south-east-east';
    case '14': return '14=south-east';
    case '15': return '15=south-south-east';
    default: throw new Error(`Cannot parse Direction from ${s}`);
  }
};

export default parseDirectionV1;
