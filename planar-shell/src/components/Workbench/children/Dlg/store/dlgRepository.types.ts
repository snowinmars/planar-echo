import type { GameLanguage, GhostDlg } from '@planar/shared';

import type { ZustandCharacter } from '@/engine/store/characterStore';
import type { ZustandNarrative } from '@/engine/store/narrativeStore';

export type GetSkeletonProps = Readonly<{
  serverUrl: string;
  ghostDir: string;
  dlgId: string;
}>;

export type LoadTlkLinesProps = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  tlkRefs: number[];
}>;
export type LoadDlgTreeProps = Readonly<{
  dlgId: string;
  serverUrl: string;
  ghostDir: string;
  narrative: ZustandNarrative;
  character: ZustandCharacter;
}>;

export type Skeleton = <T>(dlgLogic: T) => GhostDlg;
export type TlkItems = Map<number, string>;

export type DlgRepository = Readonly<{
  loadTlkLines: (props: LoadTlkLinesProps) => Promise<TlkItems>;
  loadDlgTree: (props: LoadDlgTreeProps) => Promise<GhostDlg>;
}>;
