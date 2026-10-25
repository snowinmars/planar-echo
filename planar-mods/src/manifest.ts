import { MOVE } from './conformance/contract.js';

import type { ModpackManifest } from '@planar/shared';

export const manifest: ModpackManifest = {
  id: 'planar.modpack',
  version: '1.0.0',
  mods: [{ id: 'planar.conformance', version: '1.0.0' }],
  seats: [
    { principalId: 'alpha', commands: [MOVE] },
    { principalId: 'bravo', commands: [MOVE] },
  ],
};
