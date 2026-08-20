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

type CurrentWidget = 'cre' | 'dlg' | 'itm' | 'bcs' | 'mos' | 'pvrz' | 'tis' | 'wed' | 'acm' | 'bam' | 'bmp' | 'wav' | 'mus' | 'eff' | 'ids' | 'ini' | '';

const CreWidget = lazy(() => import('./children/CreWidget/CreWidget'));
const DlgWidget = lazy(() => import('./children/DlgWidget/DlgWidget'));
const ItmWidget = lazy(() => import('./children/ItmWidget/ItmWidget'));
const BcsWidget = lazy(() => import('./children/BcsWidget/BcsWidget'));
const MosWidget = lazy(() => import('./children/MosWidget/MosWidget'));
const PvrzWidget = lazy(() => import('./children/PvrzWidget/PvrzWidget'));
const TisWidget = lazy(() => import('./children/TisWidget/TisWidget'));
const WedWidget = lazy(() => import('./children/WedWidget/WedWidget'));
const AcmWidget = lazy(() => import('./children/AcmWidget/AcmWidget'));
const BamWidget = lazy(() => import('./children/BamWidget/BamWidget'));
const BmpWidget = lazy(() => import('./children/BmpWidget/BmpWidget'));
const WavWidget = lazy(() => import('./children/WavWidget/WavWidget'));
const MusWidget = lazy(() => import('./children/MusWidget/MusWidget'));
const EffWidget = lazy(() => import('./children/EffWidget/EffWidget'));
const IdsWidget = lazy(() => import('./children/IdsWidget/IdsWidget'));
const IniWidget = lazy(() => import('./children/IniWidget/IniWidget'));

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
            { currentWidget === 'bcs' && <BcsWidget />}
            { currentWidget === 'mos' && <MosWidget />}
            { currentWidget === 'pvrz' && <PvrzWidget />}
            { currentWidget === 'tis' && <TisWidget />}
            { currentWidget === 'wed' && <WedWidget />}
            { currentWidget === 'acm' && <AcmWidget />}
            { currentWidget === 'bam' && <BamWidget />}
            { currentWidget === 'bmp' && <BmpWidget />}
            { currentWidget === 'wav' && <WavWidget />}
            { currentWidget === 'mus' && <MusWidget />}
            { currentWidget === 'eff' && <EffWidget />}
            { currentWidget === 'ids' && <IdsWidget />}
            { currentWidget === 'ini' && <IniWidget />}
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
