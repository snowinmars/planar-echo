import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { ghostTypes, type Maybe } from '@planar/shared';

import type { FC } from 'react';

// import styles from './Workbench.module.scss';

type RouteButtonProps = Readonly<{
  id: string;
}>;
const RouteButton: FC<RouteButtonProps> = ({ id }: RouteButtonProps) => {
  return (
    <Button
      component={RouterLink}
      to={`/${id}`}
      nativeButton={false}
    >
      {id}
    </Button>

  );
};

const Workbench: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    planarLocalStorage.set<Maybe<'workbench'>>(planarLocalStorage.currentWidget, 'workbench');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  return (
    <>
      { ghostTypes.map(x => <RouteButton id={x} />) }

      <Button
        component={RouterLink}
        to="/stores"
        nativeButton={false}
      >
        {t('landing.runnerGuard.stores')}
      </Button>
    </>
  );
};

export default Workbench;
