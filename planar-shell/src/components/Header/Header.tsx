import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslationSvg from '@/svg/translation';
import { lazy, useEffect, useState } from 'react';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';

import styles from './Header.module.scss';

type CurrentWidget = 'cre' | 'dlg' | 'itm' | '';

const CreWidget = lazy(() => import('./children/CreWidget/CreWidget'));
const DlgWidget = lazy(() => import('./children/DlgWidget/DlgWidget'));
const ItmWidget = lazy(() => import('./children/ItmWidget/ItmWidget'));

const Header: FC = () => {
  const [currentWidget, setCurrentWidget] = useState<CurrentWidget>(() => planarLocalStorage.get<CurrentWidget>(planarLocalStorage.currentWidget, '')!);
  useEffect(() => {
    const subscription = planarLocalStorage.onKeyChange(planarLocalStorage.currentWidget)
      .subscribe(key => setCurrentWidget(planarLocalStorage.get<CurrentWidget>(key, '')!));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container spacing={1} sx={{ width: '100%' }}>
          <Grid size={{ xs: 1.5 }}>
            <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
              Planar echo
            </Link>
          </Grid>

          <Grid size={{ xs: 9.5 }}>
            { currentWidget === 'cre' && <CreWidget />}
            { currentWidget === 'dlg' && <DlgWidget />}
            { currentWidget === 'itm' && <ItmWidget />}
          </Grid>

          <Grid size={{ xs: 0.5 }}>
            <IconButton
              component={RouterLink}
              to="/settings"
              nativeButton={false}
            >
              <SettingsIcon />
            </IconButton>
          </Grid>

          <Grid size={{ xs: 0.5 }}>
            <IconButton
              component={RouterLink}
              to="/settings"
              nativeButton={false}
            >
              <TranslationSvg className={styles.languange} />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
