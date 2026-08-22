import { isNothing, type Direction, type Maybe } from '@planar/shared';

export const parseDirection = (s: Maybe<string | number>): Direction => {
  if (isNothing(s)) throw new Error(`Cannot parse Direction from nothing`);

  switch (s) {
    case 0:
    case '0': return '0=south';
    case 1:
    case '1': return '1=south-south-west';
    case 2:
    case '2': return '2=south-west';
    case 3:
    case '3': return '3=south-west-west';
    case 4:
    case '4': return '4=west';
    case 5:
    case '5': return '5=north-west-west';
    case 6:
    case '6': return '6=north-west';
    case 7:
    case '7': return '7=north-north-west';
    case 8:
    case '8': return '8=north';
    case 9:
    case '9': return '9=north-north-east';
    case 10:
    case '10': return '10=north-east';
    case 11:
    case '11': return '11=north-east-east';
    case 12:
    case '12': return '12=east';
    case 13:
    case '13': return '13=south-east-east';
    case 14:
    case '14': return '14=south-east';
    case 15:
    case '15': return '15=south-south-east';
    default: throw new Error(`Cannot parse Direction from '${s}'`);
  }
};
