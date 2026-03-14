export type Header = Readonly<{
  signature: 'tlk';
  version: 'v1';
  language: number;
  stringCount: number;
  stringOffset: number;
}>;
