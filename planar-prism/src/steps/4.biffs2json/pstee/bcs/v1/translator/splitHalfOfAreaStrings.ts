import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { SignatureFunction } from '../signatures.types.js';

type SplitHalfOfAreaStringsProps = Readonly<{
  functionSignature: SignatureFunction;
  index: number;
  strings: Maybe<string>[];
}>;
export const splitHalfOfAreaStrings = ({
  functionSignature,
  index,
  strings,
}: SplitHalfOfAreaStringsProps): Maybe<string> => {
  let logicalStringIndex = 0;
  let physicalHalfIndex = 0;

  for (const parameter of functionSignature.parameters) {
    if (parameter.type !== 's') continue;

    if (logicalStringIndex === index) {
      const physicalIndex = physicalHalfIndex >> 1;
      const value = strings[physicalIndex] ?? '';

      if (parameter.stringPack === 'halfOfArea6') {
        const isNameHalf = (physicalHalfIndex & 1) === 0;
        const position = Math.min(6, value.length);
        return isNameHalf ? value.slice(position) : value.slice(0, position);
      }

      return value;
    }

    physicalHalfIndex += parameter.stringPack === 'halfOfArea6' ? 1 : 2;
    logicalStringIndex++;
  }

  if (index < strings.length) return strings[index] ?? nothing();
  return nothing();
};
