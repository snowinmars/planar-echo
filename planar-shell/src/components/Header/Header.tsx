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
import type { Maybe } from '@planar/shared';

import styles from './Header.module.scss';

const CreatureWidget = lazy(() => import('./children/CreatureWidget/CreatureWidget'));
const DialogueWidget = lazy(() => import('./children/DialogueWidget/DialogueWidget'));
const ItemWidget = lazy(() => import('./children/ItemWidget/ItemWidget'));

const Header: FC = () => {
  const [currentWidget, setCurrentWidget] = useState<Maybe<string>>(() => planarLocalStorage.get(planarLocalStorage.currentWidget, '')!);
  useEffect(() => {
    const subscription = planarLocalStorage.onKeyChange(planarLocalStorage.currentWidget)
      .subscribe(key => setCurrentWidget(planarLocalStorage.get<string>(key, '')));
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
            { currentWidget === 'creature' && <CreatureWidget />}
            { currentWidget === 'dialogue' && <DialogueWidget />}
            { currentWidget === 'item' && <ItemWidget />}
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
