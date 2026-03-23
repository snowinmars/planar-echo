import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import { useEffect, useRef, type FC } from 'react';
import type { TFunction } from 'i18next';

import styles from './Content.module.scss';
import { Language } from '../../stores/types';
import { debounce, interval, Subject } from 'rxjs';

type ContentProps = Readonly<{
  path: string;
  loading: boolean;
  setPath: (path: string) => void;
  validate: (weiduExePath: string, lang: Language, t: TFunction<'translation', undefined>) => Promise<void>;
  weiduExePath: string;
  lang: Language;
  disabled: boolean;
}>;

const Content: FC<ContentProps> = ({
  path,
  loading,
  setPath,
  validate,
  weiduExePath,
  lang,
  disabled,
}: ContentProps) => {
  const { t } = useTranslation();

  const {current: validate$} = useRef(new Subject<void>());
  useEffect(() => {
    const subscription = validate$
      .pipe(debounce(() => interval(1000)))
      .subscribe(() => validate(weiduExePath, lang, t).catch(e => console.error(e)));
      return () => subscription.unsubscribe();
  }, [validate$]);

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={path}
        onChange={(e) => {
          const value = e.target.value;
          setPath(value);
          if (value) validate$.next();
        }}
        disabled={loading || disabled}
        fullWidth
        label={t('landing.step3.chitinKeyPath')}
        placeholder="{game folder}\CHITIN.KEY"
      />

      <IconButton
        className={styles.inputReload}
        aria-label="replay"
        disabled={!path || loading}
        onClick={() => {
          if (path) validate(weiduExePath, lang, t).catch(e => console.error(e));
        }}
      >
        <ReplayIcon />
      </IconButton>
    </Paper>
  );
};

export default Content;
