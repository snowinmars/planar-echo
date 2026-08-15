import type { RawBcsStream } from '../bcsStream.types.js';

type ParamKind = 'i' | 's' | 'p' | 'o';
export const determineParamType = (stream: RawBcsStream): ParamKind => {
  const value = stream.peek();
  switch (value) {
    case '-':
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9': return 'i';
    case '"': return 's';
    case '[': return 'p';
    case 'o': return 'o';
    default: throw new Error(`Cannot determinate parameter type from '${value}' at '${stream.positionOf()}': out of type range`);
  }
};
