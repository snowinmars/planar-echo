export type GhostSrcEntry = Readonly<{
  strref: number;
  weight: number;
}>;

export type GhostSrc = Readonly<{
  resourceName: string;
  entries: GhostSrcEntry[];
}>;
