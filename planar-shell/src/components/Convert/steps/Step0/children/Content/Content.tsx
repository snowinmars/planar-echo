import TextField from '@mui/material/TextField';
import StepLoading from '../../../../StepLoader/StepLoader';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import Paper from '@mui/material/Paper';

import type { FC } from 'react';
import type { LandingStateStep0 } from '@/components/Convert/store/types';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  serverUrl: LandingStateStep0['serverUrl'];
  setServerUrl: LandingStateStep0['setServerUrl'];
  loading: LandingStateStep0['step0Loading'];
  validate: LandingStateStep0['step0Validate'];
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <StepLoading show={props.loading} />

      <TextField
        className={styles.input}
        disabled={props.loading}
        value={props.serverUrl}
        onChange={e => props.setServerUrl(e.target.value)}
        fullWidth
        label={t('landing.step0.serverUrl')}
        variant="standard"
        placeholder="http://localhost:3003"
      >
      </TextField>

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!props.serverUrl || props.loading}
        onClick={() => {
          if (props.serverUrl) props.validate().catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
