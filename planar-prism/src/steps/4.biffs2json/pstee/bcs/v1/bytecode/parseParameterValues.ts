import { determineParamType } from './determineParamType.js';
import { parseNumber } from './parseNumber.js';
import { parseOb } from './parseOb.js';
import { parseString } from './parseString.js';

import type { RawBcsParsedParameters } from './parseParameterValues.types.js';
import type { RawBcsStream } from '../bcsStream.types.js';

type RawBcsParseParameterValuesProps = Readonly<{
  stream: RawBcsStream;
  closingToken: string;
  limits: Readonly<{
    ints: number;
    strings: number;
    objects: number;
  }>;
}>;
export const parseParameterValues = ({
  stream,
  closingToken,
  limits,
}: RawBcsParseParameterValuesProps): RawBcsParsedParameters => {
  const ints: number[] = [];
  const strings: string[] = [];
  const objects = [];

  while (!stream.eos() && !stream.skipToken(closingToken)) {
    const kind = determineParamType(stream);
    switch (kind) {
      case 'i':
        if (ints.length >= limits.ints) throw new Error(`Did not expect integer after '${ints.length}' integers`);
        ints.push(parseNumber(stream));
        break;
      case 's':
        if (strings.length >= limits.strings) throw new Error(`Did not expect string after '${strings.length}' strings`);
        strings.push(parseString(stream));
        break;
      case 'o':
        if (objects.length >= limits.objects) throw new Error(`Did not expect object after '${objects.length}' objects`);
        objects.push(parseOb(stream));
        break;
      case 'p': throw new Error(`Unsupported BCS parameter type 'p' at position '${stream.positionOf()}'`);
      default: throw new Error(`Invalid BCS parameter type '${kind}' at position '${stream.positionOf()}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return { ints, strings, objects };
};
