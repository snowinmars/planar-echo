import type { GhostDlg, Maybe, StateId } from '@planar/shared';

export type DlgWidgetState = Readonly<{
  loading: boolean;
  dlgs: string[];
  tree: Maybe<GhostDlg>;
  currentDlgId: Maybe<string>;
  currentStateId: Maybe<StateId>;
}>;

export type DlgWidgetActions = Readonly<{
  loadDlgsIds: () => Promise<void>;
  loadDlg: (dlgId: string, targetState: Maybe<StateId>) => Promise<void>;
  setCurrentStateId: (targetStateId: StateId) => void;
}>;
