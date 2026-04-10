import type { RawDlg } from '@/steps/4.biffs2json/dlg/index.js';

export type WeightedDlg = RawDlg & Readonly<{
  stateIndicesOrderedByWeight: number[];
}>;
