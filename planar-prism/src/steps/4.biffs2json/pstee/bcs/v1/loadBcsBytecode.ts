import { xorDecrypt } from '@/shared/xor.js';

export const loadBcsBytecode = (buffer: Buffer, xorKey: number[]): string => {
  if (!buffer.length) throw new Error('No not try to load empty buffers');

  const encoding = 'latin1';
  const isXorObfuscated = buffer.readInt16LE(0) === -1;
  const code = isXorObfuscated
    ? xorDecrypt(buffer, 2, xorKey).toString(encoding)
    : buffer.toString(encoding);

  return code.toLowerCase();
};
