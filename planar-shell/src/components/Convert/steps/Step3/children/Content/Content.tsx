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
  weiduExePath: LandingStateStep2['weiduExePath'];
  chitinKeyPath: LandingStateStep3['chitinKeyPath'];
  setChitinKeyPath: LandingStateStep3['setChitinKeyPath'];
  loading: boolean;
  validate: (weiduExePath: string, gameLanguage: GameLanguage) => Promise<void>;
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={props.chitinKeyPath}
        onChange={(e) => {
          const value = e.target.value;
          props.setChitinKeyPath(value);
        }}
        disabled={props.loading || props.disabled}
        fullWidth
        label={t('landing.step3.chitinKeyPath')}
        placeholder="{game folder}\CHITIN.KEY"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!props.chitinKeyPath || props.loading || props.disabled}
        onClick={() => {
          if (props.chitinKeyPath && !props.disabled) props.validate(props.weiduExePath, props.gameLanguage as GameLanguage).catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
