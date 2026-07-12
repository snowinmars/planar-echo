import { useEffect, useState, type ReactNode } from 'react';
import { createZustandNarrative } from './narrativeStore';
import { createZustandCharacter } from './characterStore';
import { registerStores } from './saveSubject';
import { setZustandCharacter, setZustandNarrative } from './worldStores';
import { getDbNarrative, getDbCharacters } from '@/shared/indexedDb';

import type { ZustandNarrative } from './narrativeStore';
import type { ZustandCharacter } from './characterStore';

type WorldStoreProviderProps = Readonly<{
  children: ReactNode;
}>;

export const WorldStoreProvider = ({ children }: WorldStoreProviderProps): ReactNode => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async (): Promise<void> => {
      const dbNarrative = await getDbNarrative();
      const dbCharacters = await getDbCharacters();

      const narrative: ZustandNarrative = dbNarrative ? createZustandNarrative(dbNarrative.state) : createZustandNarrative();
      const character: ZustandCharacter = dbCharacters ? createZustandCharacter(dbCharacters.state) : createZustandCharacter();

      registerStores(
        () => narrative.getState(),
        () => character.getState(),
      );

      setZustandCharacter(character);
      setZustandNarrative(narrative);
      setReady(true);
    };

    init().catch((e) => {
      console.error(e);
      setError('The IndexedDB is unavailable. Please reload the page. If it does not work - restart browser.');
    });
  }, []);

  if (error) {
    return <>{error}</>;
  }

  if (!ready) {
    return null;
  }

  return <>{children}</>;
};
