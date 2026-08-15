import type {
  GhostDlgResponse,
  Maybe,
  GhostDlg,
  StateId,
} from '@planar/shared';

export type DlgStore = Readonly<{
  loading: boolean;

  dlgs: string[];
  tree: Maybe<GhostDlg>;

  currentDlgId: Maybe<string>;
  setCurrentDlgId: (dlgId: string) => void;

  currentStateId: Maybe<StateId>;
  setCurrentStateId: (targetStateId: StateId) => void;
  selectResponse: (response: GhostDlgResponse, source: string) => Promise<void>;

  loadDlgsIds: () => Promise<void>;
  loadDlg: (dlgId: string, targetStateId: Maybe<StateId>, source: string) => Promise<void>;
  disposeDlg: (source: string) => Promise<void>;
}>;
