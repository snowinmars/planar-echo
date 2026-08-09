import type { Ids } from '../ids/types.js';
import type { Signatures } from './v1/signatures.types.js';

export type BcsContext = Readonly<{
  triggerSignatures: Signatures;
  actionSignatures: Signatures;
  ids: Map<string, Ids>;
  xorKey: number[];
}>;
