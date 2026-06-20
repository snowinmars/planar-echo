import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { FC } from 'react';
import type { LandingStateStep4 } from '@/components/Convert/store/types';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  disabled: boolean;
  ghostDir: LandingStateStep4['ghostDir'];
  setGhostDir: LandingStateStep4['setGhostDir'];
  loading: boolean;
  validate: (ghostDir: string) => Promise<void>;
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={props.ghostDir}
        onChange={(e) => {
          const value = e.target.value;
          props.setGhostDir(value);
        }}
        disabled={props.loading || props.disabled}
        fullWidth
        label={t('landing.step4.ghostDir')}
        placeholder="Empty output directory"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!props.ghostDir || props.loading || props.disabled}
        onClick={() => {
          if (props.ghostDir && !props.disabled) props.validate(props.ghostDir).catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
