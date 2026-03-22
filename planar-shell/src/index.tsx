import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import StoreCollector from '@/engine/store/StoreCollector';
import Loading from '@/components/Loading';
import RouterComponent from '@/components/Router';
import {
  CountStoreContextProvider,
  initialCountStore,
} from '@/engine/store/count';
import '@/i18n/index';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from './theme/context';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Link as RouterLink } from 'react-router';
import Github from './svg/github';
import EmailIcon from '@mui/icons-material/Email';
import Telegram from '@/svg/telegram';

import type { AllStoresProps } from '@/engine/store/StoreCollector';

import './index.scss';
import styles from './index.module.scss';

const storeConfigs: AllStoresProps[] = [
  { provider: CountStoreContextProvider, initialData: initialCountStore },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreCollector stores={storeConfigs}>
      <ThemeContextProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={<Loading />}>
            <CssBaseline />

            <AppBar position="static">
              <Toolbar>
                <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
                  Planar echo
                </Link>
                <ThemeSwitcher />
                <LanguageSwitcher />
              </Toolbar>
            </AppBar>

            <Container>
              <RouterComponent />
            </Container>

            <footer className={styles.footer}>
              <Link
                className={styles.license}
                href="https://github.com/snowinmars/planar-echo/blob/master/LICENSE"
                target="_blank"
                rel="noopener"
              >
                GNU/GPLv3
              </Link>

              <Link
                href="mailto:snowinmars@yandex.ru"
                target="_blank"
                rel="noopener"
              >
                <EmailIcon className={styles.email} />
              </Link>
              <Link
                href="https://t.me/snowinmars"
                target="_blank"
                rel="noopener"
              >
                <Telegram className={styles.telegram} />
              </Link>
              <Link
                href="https://github.com/snowinmars/planar-echo/"
                target="_blank"
                rel="noopener"
              >
                <Github className={styles.github} />
              </Link>
            </footer>
          </Suspense>
        </BrowserRouter>
      </ThemeContextProvider>
    </StoreCollector>
  </React.StrictMode>,
);
