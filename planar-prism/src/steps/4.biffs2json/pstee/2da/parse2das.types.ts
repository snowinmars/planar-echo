export type Raw2daRow = Readonly<{
  name: string;
  cells: string[];
}>;

export type Raw2da = Readonly<{
  resourceName: string;
  encrypted: boolean;
  signature: string;
  defaultValue: string;
  columns: string[];
  rows: Raw2daRow[];
}>;
