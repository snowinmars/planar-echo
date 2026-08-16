import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import planarLocalStorage from '@/shared/planarLocalStorage';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import type { FC } from 'react';
import type { Maybe } from '@planar/shared';

import styles from './RunnerGuard.module.scss';

type ButtonInsideTextFieldProps = Readonly<{
  id: string;
  to: string;
  disabled?: Maybe<boolean>;
}>;
const ButtonInsideTextField: FC<ButtonInsideTextFieldProps> = ({ id, to, disabled }: ButtonInsideTextFieldProps) => {
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
      disabled={disabled ?? false}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                className={styles.button}
                component={RouterLink}
                to={to}
                nativeButton={false}
                edge="start"
                size="small"
                disabled={disabled ?? false}
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

type RunnerGuardProps = Readonly<{
  hasStores: boolean;
}>;
const RunnerGuard: FC<RunnerGuardProps> = ({ hasStores }: RunnerGuardProps) => {
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
      <ButtonInsideTextField id="dlg" to="/dlg" disabled={!hasStores} />
      <ButtonInsideTextField id="cre" to="/cre" disabled={!hasStores} />
      <ButtonInsideTextField id="itm" to="/itm" disabled={!hasStores} />
      <ButtonInsideTextField id="bcs" to="/bcs" disabled={!hasStores} />
      <ButtonInsideTextField id="mos" to="/mos" disabled={!hasStores} />
      <ButtonInsideTextField id="pvrz" to="/pvrz" disabled={!hasStores} />
      <ButtonInsideTextField id="tis" to="/tis" disabled={!hasStores} />
      <ButtonInsideTextField id="wed" to="/wed" disabled={!hasStores} />
      <Button
        component={RouterLink}
        to="/stores"
        nativeButton={false}
        disabled={!hasStores}
      >
        {t('landing.runnerGuard.stores')}
      </Button>
    </div>
  );
};

export default RunnerGuard;
