import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type { FC } from 'react';
import type { TFunction } from 'i18next';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  path: string;
  loading: boolean;
  setPath: (path: string) => void;
  validate: (t: TFunction<'translation', undefined>) => Promise<void>;
  disabled: boolean;
}>;

const Content: FC<ContentProps> = ({
  path,
  loading,
  setPath,
  validate,
  disabled,
}: ContentProps) => {
  const { t } = useTranslation();
  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={path}
        onChange={(e) => {
          const value = e.target.value;
          setPath(value);
          if (value) validate(t).catch(e => console.error(e));
        }}
        disabled={loading || disabled}
        fullWidth
        label={t('landing.step2.weiduExePath')}
        placeholder="D:\Games\weidu\weidu.exe"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!path || loading}
        onClick={() => {
          if (path) validate(t).catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
