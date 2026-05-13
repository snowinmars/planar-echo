import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';

import styles from './RunnerGuard.module.scss';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const RunnerGuard: FC = () => {
  const { t } = useTranslation();

  const [ghostPath, setGhostPath] = useState<string>(() => planarLocalStorage.get('ghostPath', '')!);

  return (
    <div className={styles.guard}>
      <Button
        component={RouterLink}
        to="/convert"
      >
        {t('landing.runnerGuard.convert')}
      </Button>
      <Typography>
        {t('landing.runnerGuard.or')}
      </Typography>
      <TextField
        className={styles.ghostPath}
        value={ghostPath}
        onChange={(e) => {
          const value = e.target.value;
          setGhostPath(value);
          planarLocalStorage.set('ghostPath', value);
        }}
        size="small"
        variant="standard"
        placeholder={t('landing.runnerGuard.ghostPath')}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  className={styles.run}
                  component={RouterLink}
                  to="/run"
                  edge="start"
                  size="small"
                >
                  {t('landing.runnerGuard.tryToRun')}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
};

export default RunnerGuard;
