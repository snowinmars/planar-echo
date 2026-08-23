export type GhostTwodaRow = Readonly<{
  name: string;
  cells: string[];
}>;

export type GhostTwoda = Readonly<{
  resourceName: string;
  encrypted: boolean;
  signature: string;
  defaultValue: string;
  columns: string[];
  rows: GhostTwodaRow[];
}>;
