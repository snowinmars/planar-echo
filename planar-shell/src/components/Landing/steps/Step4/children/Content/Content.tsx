import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { FC } from 'react';
import type { LandingStateStep4 } from '@/components/Landing/store/types';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  disabled: boolean;
  ghostPath: LandingStateStep4['ghostPath'];
  setGhostPath: LandingStateStep4['setGhostPath'];
  loading: boolean;
  validate: (ghostPath: string) => Promise<void>;
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={props.ghostPath}
        onChange={(e) => {
          const value = e.target.value;
          props.setGhostPath(value);
        }}
        disabled={props.loading || props.disabled}
        fullWidth
        label={t('landing.step4.ghostPath')}
        placeholder="Empty output folder"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!props.ghostPath || props.loading || props.disabled}
        onClick={() => {
          if (props.ghostPath && !props.disabled) props.validate(props.ghostPath).catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
