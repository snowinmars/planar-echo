import { getCurrentDlgs } from '../Cre/store/creApi';
import { dlgRepository } from '../Dlg/store/dlgRepository';
import { pickMatchingConstructorStateId } from '../Dlg/store/helpers';
import { getZustandNarrative, getZustandCharacter } from '@/engine/store/worldStores';

import type { GameLanguage, StateId } from '@planar/shared';

export type ResolvedCreDlg = Readonly<{
  dlgId: string;
  stateId: StateId;
}>;

export type ResolveCreDlgParams = Readonly<{
  creId: string;
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
}>;

export const resolveCreDlg = async ({
  creId,
  serverUrl,
  ghostDir,
}: ResolveCreDlgParams): Promise<ResolvedCreDlg> => {
  const narrative = getZustandNarrative();
  const character = getZustandCharacter();

  if (!narrative || !character) {
    throw new Error('World stores were not initialized');
  }

  const dlgIds = await getCurrentDlgs(serverUrl, creId);

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

  throw new Error(`No dlg constructor matched for cre '${creId}'`);
};
