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

import type { AllStoresProps } from '@/engine/store/StoreCollector';

import './index.scss';
import { ThemeContextProvider } from './theme/context';

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
            <RouterComponent />
          </Suspense>
        </BrowserRouter>
      </ThemeContextProvider>
    </StoreCollector>
  </React.StrictMode>,
);
