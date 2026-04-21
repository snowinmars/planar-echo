import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import planarLocalStorage from '@/shared/planarLocalStorage';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import type { FC } from 'react';

// import styles from './DialogueMarks.module.scss';

export const DialogueMarks: FC = () => {
  const { t } = useTranslation();
  const [markDisposers, setMarkDisposers] = useState<boolean>(() => planarLocalStorage.get<boolean>('dialogueMarks_markDisposers', true)!);
  const [markExterns, setMarkExterns] = useState<boolean>(() => planarLocalStorage.get<boolean>('dialogueMarks_markExterns', false)!);

  return (
    <div>
      <Typography>{t('settings.dialogueMarks')}</Typography>

      <FormGroup>
        <FormControlLabel
          control={(
            <Checkbox
              checked={markDisposers}
              onChange={(_, x) => {
                planarLocalStorage.set('dialogueMarks_markDisposers', x);
                setMarkDisposers(x);
              }}
            />
          )}
          label={t('settings.dialogueMarks_markDisposers')}
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={markExterns}
              onChange={(_, x) => {
                planarLocalStorage.set('dialogueMarks_markExterns', x);
                setMarkExterns(x);
              }}
            />
          )}
          label={t('settings.dialogueMarks_markExterns')}
        />
      </FormGroup>
    </div>
  );
};
