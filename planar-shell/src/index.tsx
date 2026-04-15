import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StoreCollector from '@/engine/store/StoreCollector';
import {
  CountStoreContextProvider,
  initialCountStore,
} from '@/engine/store/count';
import '@/i18n/index';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from './theme/context';

import type { AllStoresProps } from '@/engine/store/StoreCollector';

import './index.scss';
import { RouterProvider } from 'react-router-dom';
import router from '@/components/Router';

const storeConfigs: AllStoresProps[] = [
  { provider: CountStoreContextProvider, initialData: initialCountStore },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreCollector stores={storeConfigs}>
      <ThemeContextProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </StoreCollector>
  </StrictMode>,
);
