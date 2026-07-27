import type { GameLanguage, NpcDialogue } from '@planar/shared';
import type { ZustandNarrative } from '@/engine/store/narrativeStore';
import type { ZustandCharacter } from '@/engine/store/characterStore';

export type GetSkeletonProps = Readonly<{
  serverUrl: string;
  ghostDir: string;
  dialogueId: string;
}>;

export type LoadTlkLinesProps = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  tlkRefs: number[];
}>;
export type LoadDialogueTreeProps = Readonly<{
  dialogueId: string;
  serverUrl: string;
  ghostDir: string;
  narrative: ZustandNarrative;
  character: ZustandCharacter;
}>;

export type Skeleton = <T>(dialogueLogic: T) => NpcDialogue;
export type TlkItems = Map<number, string>;

export type DialogueRepository = Readonly<{
  loadTlkLines: (props: LoadTlkLinesProps) => Promise<TlkItems>;
  loadDialogueTree: (props: LoadDialogueTreeProps) => Promise<NpcDialogue>;
}>;
