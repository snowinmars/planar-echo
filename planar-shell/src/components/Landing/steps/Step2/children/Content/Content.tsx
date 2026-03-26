import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { FC } from 'react';
import type { LandingStateStep2 } from '@/components/Landing/store/types';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  disabled: boolean;
  weiduExePath: LandingStateStep2['weiduExePath'];
  setWeiduExePath: LandingStateStep2['setWeiduExePath'];
  loading: LandingStateStep2['step2Loading'];
  validate: LandingStateStep2['step2Validate'];
}>;
const Content: FC<ContentProps> = ({
  disabled,
  weiduExePath,
  setWeiduExePath,
  loading,
  validate,
}: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={weiduExePath}
        onChange={(e) => {
          const value = e.target.value;
          setWeiduExePath(value);
        }}
        disabled={loading || disabled}
        fullWidth
        label={t('landing.step2.weiduExePath')}
        placeholder="D:\Games\weidu\weidu.exe"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!weiduExePath || loading}
        onClick={() => {
          if (weiduExePath) validate().catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
