import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import { putDefaults, readLocalDirs } from '@/shared/defaultsApi';

import BackendUrl from './children/BackendUrl';
import DlgHistorySettings from './children/DlgHistorySettings/DlgHistorySettings';
import DlgMarks from './children/DlgMarks';
import DlgRendererSwitcher from './children/DlgRendererSwitcher';
import GhostDir from './children/GhostDir/GhostDir';
import LanguageSwitcher from './children/LanguageSwitcher';
import LocalData from './children/LocalData';
import ModsDir from './children/ModsDir/ModsDir';
import PrismDir from './children/PrismDir/PrismDir';
import ShellDir from './children/ShellDir/ShellDir';
import ThemeSwitcher from './children/ThemeSwitcher';

import type { FC } from 'react';

import styles from './Settings.module.scss';

const Settings: FC = () => {
  const { t } = useTranslation();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

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
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          <ModsDir />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            disabled={saveStatus === 'saving'}
            onClick={() => {
              setSaveStatus('saving');
              putDefaults(readLocalDirs())
                .then(() => setSaveStatus('saved'))
                .catch((err: unknown) => {
                  console.error(err);
                  setSaveStatus('failed');
                });
            }}
          >
            {t('settings.saveDefaultsToJson')}
          </Button>
          {saveStatus === 'saved' && (
            <Typography variant="body2">{t('settings.saveDefaultsSaved')}</Typography>
          )}
          {saveStatus === 'failed' && (
            <Typography variant="body2" color="error">{t('settings.saveDefaultsFailed')}</Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Link component={RouterLink} to="/mods">{t('mods.title')}</Link>
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
