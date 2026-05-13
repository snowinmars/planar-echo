import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ThemeSwitcher from './children/ThemeSwitcher';
import LanguageSwitcher from './children/LanguageSwitcher';
import DialogueRendererSwitcher from './children/DialogueRendererSwitcher';
import DialogueMarks from './children/DialogueMarks';
import LocalData from './children/LocalData';

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
            {t('settings.gameInterfaceSettings')}
          </Typography>
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <DialogueRendererSwitcher />
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <DialogueMarks />
        </Grid>
        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
          <LocalData />
        </Grid>
      </Grid>
    </div>
  );
};

export default Settings;
