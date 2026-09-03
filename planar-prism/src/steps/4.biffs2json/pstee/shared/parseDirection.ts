import { isNothing } from '@planar/shared';

import type { Direction, Maybe } from '@planar/shared';

export const parseDirection = (s: Maybe<string | number>): Direction => {
  if (isNothing(s)) throw new Error(`Cannot parse Direction from nothing`);

  switch (s) {
    case 0:
    case '0':
    case 's': return '0=south';
    case 1:
    case '1':
    case 'ssw': return '1=south-south-west';
    case 2:
    case '2':
    case 'sw': return '2=south-west';
    case 3:
    case '3':
    case 'sww': return '3=south-west-west';
    case 4:
    case '4':
    case 'w': return '4=west';
    case 5:
    case '5':
    case 'nww': return '5=north-west-west';
    case 6:
    case '6':
    case 'nw': return '6=north-west';
    case 7:
    case '7':
    case 'nnw': return '7=north-north-west';
    case 8:
    case '8':
    case 'n': return '8=north';
    case 9:
    case '9':
    case 'nne': return '9=north-north-east';
    case 10:
    case '10':
    case 'ne': return '10=north-east';
    case 11:
    case '11':
    case 'nee': return '11=north-east-east';
    case 12:
    case '12':
    case 'e': return '12=east';
    case 13:
    case '13':
    case 'see': return '13=south-east-east';
    case 14:
    case '14':
    case 'se': return '14=south-east';
    case 15:
    case '15':
    case 'sse': return '15=south-south-east';
    default: throw new Error(`Cannot parse Direction from '${s}'`);
  }
};
