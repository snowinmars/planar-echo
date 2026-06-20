import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { FC } from 'react';
import type { LandingStateStep2 } from '@/components/Convert/store/types';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  disabled: boolean;
  weiduExeDir: LandingStateStep2['weiduExeDir'];
  setWeiduExeDir: LandingStateStep2['setWeiduExeDir'];
  loading: LandingStateStep2['step2Loading'];
  validate: LandingStateStep2['step2Validate'];
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={props.weiduExeDir}
        onChange={(e) => {
          const value = e.target.value;
          props.setWeiduExeDir(value);
        }}
        disabled={props.loading || props.disabled}
        fullWidth
        label={t('landing.step2.weiduExeDir')}
        placeholder="D:\Games\weidu\weidu.exe"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!props.weiduExeDir || props.loading || props.disabled}
        onClick={() => {
          if (props.weiduExeDir) props.validate().catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
