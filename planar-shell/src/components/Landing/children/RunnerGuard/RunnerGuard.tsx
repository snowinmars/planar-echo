import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import styles from './RunnerGuard.module.scss';

const RunnerGuard: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.guard}>
      <Button>
        {t('landing.runnerGuard.tryToRun')}
      </Button>
    </div>
  );
};

export default RunnerGuard;
