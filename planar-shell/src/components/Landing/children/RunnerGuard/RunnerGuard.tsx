import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import type { FC } from 'react';

import styles from './RunnerGuard.module.scss';

const RunnerGuard: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.guard}>
      <Button
        component={RouterLink}
        to="/convert"
        nativeButton={false}
      >
        {t('landing.runnerGuard.convert')}
      </Button>
      <Typography>
        {t('landing.runnerGuard.or')}
      </Typography>
      <Button
        component={RouterLink}
        to="/workbench"
        nativeButton={false}
      >
        {t('landing.runnerGuard.workbench')}
      </Button>
      <Typography>
        {t('landing.runnerGuard.or')}
      </Typography>
      <Button
        component={RouterLink}
        to="/play"
        nativeButton={false}
      >
        {t('landing.runnerGuard.play')}
      </Button>
    </div>
  );
};

export default RunnerGuard;
