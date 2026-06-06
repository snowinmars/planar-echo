import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslationSvg from '@/svg/translation';
import DialogueWidget from './children/DialogueWidget/DialogueWidget';
import { useEffect, useState } from 'react';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';
import type { Maybe } from '@planar/shared';

import styles from './Header.module.scss';

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
        <Grid container spacing="1em" width="100%">
          <Grid size={{ xs: 1.5 }}>
            <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
              Planar echo
            </Link>
          </Grid>

          <Grid size={{ xs: 9.5 }}>
            { currentWidget === 'dialogue' && <DialogueWidget />}
          </Grid>

          <Grid size={{ xs: 0.5 }}>
            <IconButton
              component={RouterLink}
              to="/settings"
            >
              <SettingsIcon />
            </IconButton>
          </Grid>

          <Grid size={{ xs: 0.5 }}>
            <IconButton
              component={RouterLink}
              to="/settings"
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
