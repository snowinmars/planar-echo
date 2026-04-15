import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import RunnerGuard from './children/RunnerGuard/RunnerGuard';

import type { FC } from 'react';

const Landing: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">{t('landing.intro.1')}</Typography>

        <Typography color="text.secondary">
          {t('landing.intro.2')}
        </Typography>

        <Typography color="error">
          {t('landing.intro.techdemo')}
          {' '}
          v0.0.1
        </Typography>
      </Paper>

      <Grid container spacing="1em">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4">{t('landing.intro.3')}</Typography>

          <Typography color="text.secondary">
            {t('landing.intro.4')}
          </Typography>

          <Typography color="text.secondary">
            {t('landing.intro.5')}
          </Typography>

          <Link component={RouterLink} to="/details">{t('landing.intro.details')}</Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <RunnerGuard />
        </Grid>
      </Grid>
    </>
  );
};

export default Landing;
