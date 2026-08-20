import type { Maybe } from '@planar/shared';

export type IniWidgetState = Readonly<{
  loading: boolean;
  inis: string[];
  currentIniId: Maybe<string>;
}>;

export type IniWidgetActions = Readonly<{
  loadInis: () => Promise<void>;
  loadIni: (iniId: string) => Promise<void>;
}>;
