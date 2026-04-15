import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router';
import { client } from '@/swagger/client/client.gen';
import { useTranslation } from 'react-i18next';
import { postApiFsValidateGhostPath } from '@/swagger/client';

import { useEffect, useState, type FC } from 'react';

import styles from './RunnerGuard.module.scss';
import { Typography } from '@mui/material';
import planarLocalStorage from '@/shared/planarLocalStorage';

const RunnerGuard: FC = () => {
  const { t } = useTranslation();

  const [canRun, setCanRun] = useState(false);

  useEffect(() => {
    const ghostPath = planarLocalStorage.get('ghostPath');
    const serverUrl = planarLocalStorage.get('serverUrl');
    if (!serverUrl || !ghostPath) {
      setCanRun(false);
      return;
    }

    postApiFsValidateGhostPath({
      client,
      baseURL: serverUrl,
      body: { ghostPath },
    })
      .then(({ error }) => {
        // I suggest, that I can run game from non empty output directory
        if (error && error.error && error.error.code === 'DIRECTORY_NOT_EMPTY') {
          setCanRun(true);
        }
        else {
          console.error(error);
          setCanRun(false);
        }
      }).catch((e) => {
        console.error(e);
        setCanRun(false);
      });
  }, []);

  return (
    <div className={styles.guard}>
      <Button
        disabled={!canRun}
        component={RouterLink}
        to="/run"
      >
        {t('landing.runnerGuard.tryToRun')}
      </Button>
      <Typography>
        {t('landing.runnerGuard.or')}
      </Typography>
      <Button
        component={RouterLink}
        to="/convert"
      >
        {t('landing.runnerGuard.convert')}
      </Button>
    </div>
  );
};

export default RunnerGuard;
