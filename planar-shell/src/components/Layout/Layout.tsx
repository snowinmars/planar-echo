import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { fetchDefaults, writeLocalDirs } from '@/shared/defaultsApi';

import Footer from '../Footer';
import Header from '../Header';
import Loading from '../Loading';

import type { FC } from 'react';

import styles from './Layout.module.scss';

type Status = 'ready' | 'loading' | 'error';

const setupInitialSettingsFromServer = async (abortController: AbortController): Promise<Status> => {
  try {
    const dirs = await fetchDefaults(abortController.signal);
    writeLocalDirs(dirs);
    return 'ready';
  }
  catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'loading';
    console.error(err);
    return 'error';
  }
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
