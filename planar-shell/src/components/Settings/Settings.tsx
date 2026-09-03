import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import BackendUrl from './children/BackendUrl';
import DlgHistorySettings from './children/DlgHistorySettings/DlgHistorySettings';
import DlgMarks from './children/DlgMarks';
import DlgRendererSwitcher from './children/DlgRendererSwitcher';
import GhostDir from './children/GhostDir/GhostDir';
import LanguageSwitcher from './children/LanguageSwitcher';
import LocalData from './children/LocalData';
import PrismDir from './children/PrismDir/PrismDir';
import ShellDir from './children/ShellDir/ShellDir';
import ThemeSwitcher from './children/ThemeSwitcher';

import type { FC } from 'react';

import styles from './Settings.module.scss';

const Settings: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.settings}>
      <Grid container spacing="1em">
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <ThemeSwitcher />
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <LanguageSwitcher />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6">
            {t('settings.serverSettings')}
          </Typography>
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          <BackendUrl />
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          <GhostDir />
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          <PrismDir />
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          <ShellDir />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6">
            {t('settings.gameInterfaceSettings')}
          </Typography>
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <DlgRendererSwitcher />
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <DlgHistorySettings />
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <DlgMarks />
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <LocalData />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
