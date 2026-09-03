import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Loading from '@/components/Loading';
import { getDbCharacters, getDbNarrative } from '@/shared/indexedDb';

import { createZustandCharacter } from './characterStore';
import { loadInitialStores } from './loadInitialStores';
import { createZustandNarrative } from './narrativeStore';
import { registerStores } from './saveSubject';
import { setZustandCharacter, setZustandNarrative } from './worldStores';

import type { ReactNode } from 'react';

type StoreStatus = 'loading' | 'ready' | 'empty' | 'error';

type WorldStoreProviderProps = Readonly<{
  children: ReactNode;
}>;

export const WorldStoreProvider = ({ children }: WorldStoreProviderProps): ReactNode => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<StoreStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const refreshStores = useCallback(async (): Promise<void> => {
    setStatus('loading');

    try {
      const dbNarrative = await getDbNarrative();
      const dbCharacters = await getDbCharacters();

      if (dbNarrative && dbCharacters) {
        const narrative = createZustandNarrative(dbNarrative.state);
        const character = createZustandCharacter(dbCharacters.state);

        registerStores(
          () => narrative.getState(),
          () => character.getState(),
        );

        setZustandCharacter(character);
        setZustandNarrative(narrative);
        setStatus('ready');
      }
      else {
        setStatus('empty');
        const serverUrl = localStorage.getItem('serverUrl') || 'http://localhost:3003';
        loadInitialStores(serverUrl)
          .then((stores) => {
            const narrative = createZustandNarrative({
              ...stores.number,
              ...stores.boolean,
              ...stores.keys,
            });
            const character = createZustandCharacter(stores.character);

            registerStores(
              () => narrative.getState(),
              () => character.getState(),
            );

            setZustandCharacter(character);
            setZustandNarrative(narrative);
            setStatus('ready');
          })
          .catch(e => console.error(e));
      }
    }
    catch (e: unknown) {
      console.error(e);
      setStatus('error');
      setError('The IndexedDB is unavailable. Please reload the page. If it does not work - restart browser.');
    }
  }, []);

  useEffect(() => {
    refreshStores().catch(e => console.error(e));
  }, [refreshStores]);

  if (error) {
    return <>{error}</>;
  }

  if (status === 'loading') {
    return <Loading title={t('worldStore.loading')} />;
  }

  return <>{children}</>;
};
