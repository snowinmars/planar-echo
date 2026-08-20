import { getCurrentDlgs } from '../Itm/store/itmApi';
import { dlgRepository } from '../Dlg/store/dlgRepository';
import { pickMatchingConstructorStateId } from '../Dlg/store/helpers';
import { getZustandNarrative, getZustandCharacter } from '@/engine/store/worldStores';

import type { GameLanguage, StateId } from '@planar/shared';

export type ResolvedItmDlg = Readonly<{
  dlgId: string;
  stateId: StateId;
}>;

export type ResolveItmDlgParams = Readonly<{
  itmId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
}>;

export const resolveItmDlg = async ({
  itmId,
  serverUrl,
  ghostDir,
}: ResolveItmDlgParams): Promise<ResolvedItmDlg> => {
  const narrative = getZustandNarrative();
  const character = getZustandCharacter();

  if (!narrative || !character) {
    throw new Error('World stores were not initialized');
  }

  const dlgIds = await getCurrentDlgs(serverUrl, itmId);

  for (const dlgId of dlgIds) {
    const tree = await dlgRepository.loadDlgTree({
      dlgId,
      serverUrl,
      ghostDir,
      narrative,
      character,
    });
    const stateId = pickMatchingConstructorStateId(tree);
    if (stateId) return { dlgId, stateId };
  }

  throw new Error(`No dlg constructor matched for itm '${itmId}'`);
};
