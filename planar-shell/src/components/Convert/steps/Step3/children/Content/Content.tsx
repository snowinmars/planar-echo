import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { FC } from 'react';
import type { GameLanguage } from '@planar/shared';
import type { LandingStateStep1, LandingStateStep2, LandingStateStep3 } from '@/components/Convert/store/types';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  disabled: boolean;
  gameLanguage: LandingStateStep1['gameLanguage'];
  weiduExeDir: LandingStateStep2['weiduExeDir'];
  chitinKeyFile: LandingStateStep3['chitinKeyFile'];
  setChitinKeyFile: LandingStateStep3['setChitinKeyFile'];
  loading: boolean;
  validate: (weiduExeDir: string, gameLanguage: GameLanguage) => Promise<void>;
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={props.chitinKeyFile}
        onChange={(e) => {
          const value = e.target.value;
          props.setChitinKeyFile(value);
        }}
        disabled={props.loading || props.disabled}
        fullWidth
        label={t('landing.step3.chitinKeyFile')}
        placeholder="{game directory}\CHITIN.KEY"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!props.chitinKeyFile || props.loading || props.disabled}
        onClick={() => {
          if (props.chitinKeyFile && !props.disabled) props.validate(props.weiduExeDir, props.gameLanguage as GameLanguage).catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
