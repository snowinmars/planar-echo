export type ParsedIds = Readonly<{
  ids: Readonly<{
    key: number;
    value: string;
  }>[];
  wrongSignarute: string;
  wrongEntriesCount: string;
}>;
