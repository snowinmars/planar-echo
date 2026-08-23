export type RawSrcEntry = Readonly<{
  strref: number;
  weight: number;
}>;

export type RawSrc = Readonly<{
  resourceName: string;
  header: Readonly<{
    entryCount: number;
  }>;
  entries: RawSrcEntry[];
}>;
