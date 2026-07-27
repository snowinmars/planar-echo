import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n/index';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContextProvider } from './theme/context';
import { WorldStoreProvider } from '@/engine/store/WorldStoreProvider';
import { PlanarRuntimeProvider } from '@/engine/store/PlanarRuntimeProvider';

import './index.scss';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';

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
