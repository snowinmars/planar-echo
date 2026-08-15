export const headerLengthBytes = 18;
export type RawTlkHeader = Readonly<{
  signature: 'tlk';
  version: 'v1';
  language: number;
  stringCount: number;
  stringOffset: number;
}>;
