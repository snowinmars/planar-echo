export type RawTwodaRow = Readonly<{
  name: string;
  cells: string[];
}>;

export type RawTwoda = Readonly<{
  resourceName: string;
  encrypted: boolean;
  signature: string;
  defaultValue: string;
  columns: string[];
  rows: RawTwodaRow[];
}>;
