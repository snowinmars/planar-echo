export type TlkHeader = Readonly<{
  signature: string;
  version: string;
  language: number;
  stringCount: number;
  stringOffset: number;
}>;
export type TlkItem = Readonly<{
  index: number;
  flags: number;
  soundResRef: string;
  volume: number;
  pitch: number;
  offset: number;
  length: number;
  text: string;
}>;
export type Tlk = Readonly<{
  header: TlkHeader;
  itemsMap: Map<number, TlkItem>;
}>;
