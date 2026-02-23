export const readString = (buffer: Buffer, offset: number, length: number, encoding: BufferEncoding = 'ascii'): string => buffer.toString(encoding, offset, offset + length).replace(/\0/g, '').replace('\r\n', '\n');
export const readUint = (buffer: Buffer, offset: number): number => buffer.readUInt32LE(offset);
export const readInt = (buffer: Buffer, offset: number): number => buffer.readInt32LE(offset);
export const readShort = (buffer: Buffer, offset: number): number => buffer.readInt16LE(offset);
