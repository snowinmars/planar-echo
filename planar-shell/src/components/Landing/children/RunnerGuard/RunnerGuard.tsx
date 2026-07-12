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

type ButtonInsideTextFieldProps = Readonly<{
  id: string;
}>;
const ButtonInsideTextField: FC<ButtonInsideTextFieldProps> = ({ id }: ButtonInsideTextFieldProps) => {
  const { t } = useTranslation();

  const [ghostDir, setGhostDir] = useState<string>(() => planarLocalStorage.get('ghostDir', '')!);

  return (
    <TextField
      className={styles.ghostDir}
      value={ghostDir}
      onChange={(e) => {
        const value = e.target.value;
        setGhostDir(value);
        planarLocalStorage.set('ghostDir', value);
      }}
      size="small"
      variant="standard"
      placeholder={t('landing.runnerGuard.ghostDir')}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                className={styles.button}
                component={RouterLink}
                to={`/${id}`}
                nativeButton={false}
                edge="start"
                size="small"
              >
                {t(`landing.runnerGuard.${id}`)}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

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
      <ButtonInsideTextField id="dialogue" />
      <ButtonInsideTextField id="creature" />
      <ButtonInsideTextField id="item" />
      <Button
        component={RouterLink}
        to="/stores"
        nativeButton={false}
      >
        {t('landing.runnerGuard.stores')}
      </Button>
    </div>
  );
};

export default RunnerGuard;
