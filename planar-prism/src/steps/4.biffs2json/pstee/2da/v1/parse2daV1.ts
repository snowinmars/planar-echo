import createReader from '@/shared/bufferReader.js';
import { xorDecrypt } from '@/shared/xor.js';
import { isNothing, just, nothing } from '@planar/shared';

import type { RawTwoda, RawTwodaRow } from '../parse2das.types.js';
import type { Maybe } from '@planar/shared';

const tokens = (line: string): string[] => {
  if (!line) return [];
  return line.split(/\s+/).filter(Boolean);
};

const isCommentLine = (line: string): boolean => {
  const ch = line[0];
  return ch === '#' || ch === '/';
};

const next = (lines: IterableIterator<string>): Maybe<string> => {
  const result = lines.next();
  if (result.done) return nothing();
  return result.value;
};

const nextUncommentLine = (lines: IterableIterator<string>): Maybe<string> => {
  while (true) {
    const line = next(lines);
    if (isNothing(line)) return nothing();
    if (isCommentLine(line)) continue;
    return line;
  }
};

type Parse2daV1Props = Readonly<{
  buffer: Buffer;
  resourceName: string;
  xorKey: number[];
}>;
export const parse2daV1 = ({
  buffer,
  resourceName,
  xorKey,
}: Parse2daV1Props): RawTwoda => {
  const encrypted = buffer.readInt16LE(0) === -1;
  const payload = encrypted ? xorDecrypt(buffer, 2, xorKey) : buffer;
  const reader = createReader(payload);
  const lines = reader.readLineByLine();

  const signature = just(next(lines));
  const defaultValue = just(tokens(next(lines)!)[0]);

  const headerLine = nextUncommentLine(lines);
  const columns = isNothing(headerLine) ? [] : tokens(headerLine);

  const rows: RawTwodaRow[] = [];
  while (true) {
    const line = nextUncommentLine(lines);
    if (isNothing(line)) break;

    const rowTokens = tokens(line);
    if (!rowTokens.length) continue;
    const [name, ...cells] = rowTokens;

    rows.push({
      name: just(name),
      cells,
    });
  }

  return {
    resourceName,
    encrypted,
    signature,
    defaultValue,
    columns,
    rows,
  };
};
