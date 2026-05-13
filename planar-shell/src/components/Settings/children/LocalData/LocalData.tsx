import planarLocalStorage from '@/shared/planarLocalStorage';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteDB } from 'idb';
import { DB_NAME } from '@planar/shared';

const ANIMATION_TIME_MS = 3000;

export const LocalData: FC = () => {
  const { t } = useTranslation();

  const [localStorageCleared, setLocalStorageCleared] = useState(false);
  const [localIndexedDb, setLocalIndexedDb] = useState(false);

  return (
    <div>
      <Button
        fullWidth
        color={localStorageCleared ? 'success' : 'warning'}
        onClick={() => {
          planarLocalStorage.clear();
          setLocalStorageCleared(true);

          setTimeout(() => {
            setLocalStorageCleared(false);
          }, ANIMATION_TIME_MS);
        }}
      >
        {t('settings.localData.clearLocalStorage')}
      </Button>

      <Button
        fullWidth
        color={localIndexedDb ? 'success' : 'warning'}
        onClick={() => {
          deleteDB(DB_NAME)
            .then(() => {
              setLocalIndexedDb(true);

              setTimeout(() => {
                setLocalIndexedDb(false);
              }, ANIMATION_TIME_MS);
            })
            .catch(e => console.error(e));
        }}
      >
        {t('settings.localData.clearIndexedDb')}
      </Button>
    </div>
  );
};
