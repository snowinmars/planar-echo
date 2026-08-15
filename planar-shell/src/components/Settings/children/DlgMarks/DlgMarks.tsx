import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import planarLocalStorage from '@/shared/planarLocalStorage';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import type { FC } from 'react';

// import styles from './DlgMarks.module.scss';

export const DlgMarks: FC = () => {
  const { t } = useTranslation();
  const [markDisposers, setMarkDisposers] = useState<boolean>(() => planarLocalStorage.get<boolean>('dlgMarks_markDisposers', true)!);
  const [markExterns, setMarkExterns] = useState<boolean>(() => planarLocalStorage.get<boolean>('dlgMarks_markExterns', false)!);

  return (
    <div>
      <Typography>{t('settings.dlgMarks.title')}</Typography>

      <FormGroup>
        <FormControlLabel
          control={(
            <Checkbox
              checked={markDisposers}
              onChange={(_, x) => {
                planarLocalStorage.set('dlgMarks_markDisposers', x);
                setMarkDisposers(x);
              }}
            />
          )}
          label={t('settings.dlgMarks.markDisposers')}
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={markExterns}
              onChange={(_, x) => {
                planarLocalStorage.set('dlgMarks_markExterns', x);
                setMarkExterns(x);
              }}
            />
          )}
          label={t('settings.dlgMarks.markExterns')}
        />
      </FormGroup>
    </div>
  );
};
