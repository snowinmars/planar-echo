import { isNothing, nothing } from '@planar/shared';

import { determineParamType } from './determineParamType.js';
import { parseNumber } from './parseNumber.js';
import { parseRegion } from './parseRegion.js';
import { parseString } from './parseString.js';
import { OB_TOKEN } from './tokens.js';

import type { Maybe } from '@planar/shared';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsObject } from './parseOb.types.js';
import type { RawBcsRegion } from './parseRegion.types.js';

export const parseOb = (stream: RawBcsStream): RawBcsObject => {
  if (!stream.skipToken(OB_TOKEN)) throw new Error(`Expected '${OB_TOKEN}' at position '${stream.positionOf()}'`);

  const numbers: number[] = [];
  let name: Maybe<string> = nothing();
  let region: Maybe<RawBcsRegion> = nothing();

  while (!stream.eos() && !stream.skipToken(OB_TOKEN)) {
    const kind = determineParamType(stream);
    switch (kind) {
      case 'i':
        numbers.push(parseNumber(stream));
        break;
      case 'p':
        region = parseRegion(stream);
        break;
      case 's':
        name = parseString(stream);
        break;
      case 'o': throw new Error(`Unsupported BCS object code 'o' at position '${stream.positionOf()}'`);
      default: throw new Error(`Invalid BCS object code '${kind}' at position '${stream.positionOf()}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  const noNameAndRegion = isNothing(name) && isNothing(region);
  if (noNameAndRegion) throw new Error('Too few object parameters: at least region or name should be found');

  const identifierCount = 5;
  const tooFewNumbers = numbers.length < identifierCount;
  if (tooFewNumbers) throw new Error(`Too few numeric parameters: at least '${identifierCount}' numbers should be found`);

  return {
    target: numbers.slice(0, -identifierCount),
    identifier: numbers.slice(-identifierCount),
    region,
    name,
  };
};
