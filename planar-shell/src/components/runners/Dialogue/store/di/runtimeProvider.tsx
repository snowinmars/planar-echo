import { useEffect } from 'react';
import { appDialogueRuntime, DialogueRuntimeContext } from './runtime';

import type { PropsWithChildren } from 'react';
import type { DialogueStoreId } from './runtime.types';

export const DialogueRuntimeProvider = ({
  children,
  modules,
}: PropsWithChildren<Readonly<{ modules: readonly DialogueStoreId[] }>>) => {
  useEffect(() => {
    const releases = modules.map(module => appDialogueRuntime.acquire(module));
    return () => {
      for (const release of releases.reverse()) release();
    };
  }, [modules]);

  return (
    <DialogueRuntimeContext.Provider value={appDialogueRuntime}>
      {children}
    </DialogueRuntimeContext.Provider>
  );
};
