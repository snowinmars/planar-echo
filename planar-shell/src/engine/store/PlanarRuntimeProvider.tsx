import {
  appPlanarRuntime,
  planarCoreModules,
  PlanarRuntimeContext,
  useFeatureLease,
} from './planarRuntime';

import type { PropsWithChildren } from 'react';

export const PlanarRuntimeProvider = ({ children }: PropsWithChildren) => {
  useFeatureLease(planarCoreModules);

  return (
    <PlanarRuntimeContext.Provider value={appPlanarRuntime}>
      {children}
    </PlanarRuntimeContext.Provider>
  );
};
