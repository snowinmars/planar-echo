import {
  animationIdToHex4,
  evalGhostFactory,
  nothing,
  TICK_HZ,
} from '@planar/shared';

import { loadGhostAre } from '@/components/Workbench/children/Are/store/areApi';
import { loadGhostBam } from '@/components/Workbench/children/Bam/store/bamApi';
import { loadGhostCre } from '@/components/Workbench/children/Cre/store/creApi';
import { loadGhostPvrz } from '@/components/Workbench/children/Pvrz/store/pvrzApi';
import { loadGhostTis } from '@/components/Workbench/children/Tis/store/tisApi';
import { loadGhostWed } from '@/components/Workbench/children/Wed/store/wedApi';
import { assetUrl } from '@/shared/assetUrl';

import type {
  ClientGhostReader,
  GhostIniAnimation,
  Maybe,
  Meta,
  Snapshot,
} from '@planar/shared';

const creFileOf = (creId: string): string => (
  creId.toLowerCase().endsWith('.cre') ? creId : `${creId}.cre`
);

export const emptyMeta = (areId = ''): Meta => ({
  tick: 0,
  tickHz: TICK_HZ,
  paused: false,
  nextId: 2,
  areId,
});

export const metaOfSnapshot = (snapshot: Snapshot): Meta => ({
  tick: snapshot.tick,
  tickHz: snapshot.tickHz,
  paused: snapshot.paused,
  nextId: snapshot.nextId,
  areId: snapshot.areId,
});

export const createClientGhostReader = (
  serverUrl: string,
  ghostDir: string,
  areIdOf: () => string,
): ClientGhostReader => {
  const loadAre = (areId: string) => loadGhostAre({ areId, serverUrl, ghostDir });

  return {
    current: {
      are: () => loadAre(areIdOf()),
    },
    load: {
      are: (areId: string) => loadAre(areId),
      cre: (creId: string) => loadGhostCre({ creId: creFileOf(creId), serverUrl, ghostDir }),
      bam: (bamId: string) => loadGhostBam({ bamId, serverUrl, ghostDir }),
      tis: (tisId: string) => loadGhostTis({ tisId, serverUrl, ghostDir }),
      wed: (wedId: string) => loadGhostWed({ wedId, serverUrl, ghostDir }),
      pvrz: (pvrzId: string) => loadGhostPvrz({ pvrzId, serverUrl, ghostDir }),
      animation: async (animationId: number): Promise<Maybe<GhostIniAnimation>> => {
        const hex4 = animationIdToHex4(animationId);
        const iniId = `${hex4}.ini`;
        const res = await fetch(`${serverUrl}/api/ghost/ini/${encodeURIComponent(iniId)}/skeleton`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ghostDir }),
        });
        if (res.status === 404) return nothing();
        if (!res.ok) throw new Error(`animation '${iniId}': ${res.status}`);
        const json = await res.json() as { data: { content: string } };
        return evalGhostFactory<GhostIniAnimation>(json.data.content)();
      },
    },

  };
};

export { assetUrl };
