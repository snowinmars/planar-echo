import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Footer from '../Footer';
import Loading from '../Loading';
import {
  getApiSettingsGhostDir,
  getApiSettingsPrismDir,
  getApiSettingsShellDir,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { isAxiosError } from 'axios';

import type { FC } from 'react';

import styles from './Layout.module.scss';

type Status = 'ready' | 'loading' | 'error';

// TODO [snow]: I am tired of refactoring this function.
// The issue is that three api calls returns different models, so I do not know, how to nicely write it
// The obivious choice - write proper backend api endpoint - I do not accept for now
const setupInitialSettingsFromServer = async (abortController: AbortController): Promise<Status> => {
  const existingGhostDir = planarLocalStorage.get('ghostDir');
  if (!existingGhostDir) {
    const ghostDirResponse = await getApiSettingsGhostDir({
      client,
      signal: abortController.signal,
    });

    if (isAxiosError(ghostDirResponse)) {
      if (ghostDirResponse.code !== 'ERR_CANCELED') {
        console.error(ghostDirResponse.error);
        return 'error';
      }

      return 'loading';
    }

    planarLocalStorage.set('ghostDir', ghostDirResponse.data.ghostDir);
  }

  const existingPrismDir = planarLocalStorage.get('prismDir');
  if (!existingPrismDir) {
    const prismDirResponse = await getApiSettingsPrismDir({
      client,
      signal: abortController.signal,
    });
    if (isAxiosError(prismDirResponse)) {
      if (prismDirResponse.code !== 'ERR_CANCELED') {
        console.error(prismDirResponse.error);
        return 'error';
      }

      return 'loading';
    }
    planarLocalStorage.set('prismDir', prismDirResponse.data.prismDir);
  }

  const existingShellDir = planarLocalStorage.get('shellDir');
  if (!existingShellDir) {
    const shellDirResponse = await getApiSettingsShellDir({
      client,
      signal: abortController.signal,
    });

    if (isAxiosError(shellDirResponse)) {
      if (shellDirResponse.code !== 'ERR_CANCELED') {
        console.error(shellDirResponse.error);
        return 'error';
      }

      return 'loading';
    }

    planarLocalStorage.set('shellDir', shellDirResponse.data.shellDir);
  }

  return 'ready';
};

const Layout: FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const abortController = new AbortController();

    setupInitialSettingsFromServer(abortController)
      .then(x => setStatus(x))
      .catch((e) => {
        setStatus('error');
        console.error(e);
      });

    return () => abortController.abort();
  }, []);

  return (
    <>
      <Header />

      <div className={styles.container}>
        {status === 'ready' && <Outlet />}
        {status === 'loading' && <Loading />}
        {status === 'error' && t('layout.error')}
      </div>

      <Footer />
    </>
  );
};
export default Layout;
