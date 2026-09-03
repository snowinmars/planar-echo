import { just } from '@planar/shared';

import { loadGhostAre } from '@/components/Workbench/children/Are/store/areApi';
import { loadGhostTis } from '@/components/Workbench/children/Tis/store/tisApi';
import { loadGhostWed } from '@/components/Workbench/children/Wed/store/wedApi';
import { assetUrl } from '@/shared/assetUrl';

import type { GhostAre, GhostTis, GhostWed } from '@planar/shared';

export type PlayMapGhost = Readonly<{
  are: GhostAre;
  wed: GhostWed;
  tis: GhostTis;
  walkBase: Uint8Array;
}>;

export const loadPlayMapGhost = async (
  areId: string,
  serverUrl: string,
  ghostDir: string,
): Promise<PlayMapGhost> => {
  const are = await loadGhostAre({ areId, serverUrl, ghostDir });

  const wed = await loadGhostWed({ wedId: are.header.wed, serverUrl, ghostDir });
  const overlay = just(wed.overlays[0]);
  const tis = await loadGhostTis({ tisId: overlay.tileset, serverUrl, ghostDir });

  const flagsUrl = assetUrl(serverUrl, 'are', are.walk.walkBinName);
  const flagsRes = await fetch(flagsUrl);
  const flagsFailed = !flagsRes.ok;
  if (flagsFailed) throw new Error(`${areId}: walk binary ${flagsRes.status}`);
  const walkBase = new Uint8Array(await flagsRes.arrayBuffer());

  return { are, wed, tis, walkBase };
};
