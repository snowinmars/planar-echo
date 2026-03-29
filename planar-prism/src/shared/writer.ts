import type { Maybe } from '@planar/shared';

type Writer = Readonly<{
  write: (x: string, offset?: Maybe<number>) => Writer;
  br: () => Writer;
  writeLine: (x: string, offset?: Maybe<number>) => Writer;
  done: () => string;
}>;

const createWriter = () => {
  let buffer = '';

  const write = (x: string, offset: Maybe<number> = 0): Writer => {
    buffer += ' '.repeat(offset || 0) + x;
    return {
      write,
      writeLine,
      br,
      done,
    };
  };
  const br = (): Writer => {
    buffer += '\n';
    return {
      write,
      writeLine,
      br,
      done,
    };
  };
  const writeLine = (x: string, offset: Maybe<number> = 0): Writer => write(x, offset).br();
  const done = (): string => {
    const copy = buffer.toString();
    buffer = '';
    return copy;
  };

  return {
    write,
    writeLine,
    br,
    done,
  };
};

export default createWriter;
