import '@/i18n/index';

import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { PlanarRuntimeProvider } from '@/engine/store/PlanarRuntimeProvider';
import { WorldStoreProvider } from '@/engine/store/WorldStoreProvider';
import router from '@/router';

import { ThemeContextProvider } from './theme/context';

import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <CssBaseline />
      <WorldStoreProvider>
        <PlanarRuntimeProvider>
          <RouterProvider router={router} />
        </PlanarRuntimeProvider>
      </WorldStoreProvider>
    </ThemeContextProvider>
  </StrictMode>,
);
