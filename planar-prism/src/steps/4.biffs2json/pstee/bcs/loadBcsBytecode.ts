// See StaticSimpleXorDecryptor.java in NearInfinity
// https://github.com/NearInfinityBrowser/NearInfinity/blob/master/src/org/infinity/util/StaticSimpleXorDecryptor.java
const xorDecrypt = (buffer: Buffer, offset: number, xorKey: number[]): Buffer => {
  const out = Buffer.alloc(buffer.length - offset);
  let decOff = 0;
  for (let i = offset; i < buffer.length; i += 1) {
    const b = buffer[i]!;
    const signed = b > 127 ? b - 256 : b;
    out[i - offset] = ((256 + signed) ^ xorKey[decOff]!) & 0xff;
    decOff = (decOff + 1) % xorKey.length;
  }
  return out;
};

export const loadBcsBytecode = (buffer: Buffer, xorKey: number[]): string => {
  if (!buffer.length) throw new Error('No not try to load empty buffers');

  const encoding = 'latin1';
  const isXorObfuscated = buffer.readInt16LE(0) === -1;
  const code = isXorObfuscated
    ? xorDecrypt(buffer, 2, xorKey).toString(encoding)
    : buffer.toString(encoding);

  return code.toLowerCase();
};
