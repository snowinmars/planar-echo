import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import styles from './Workbench.module.scss';

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

const elements = [
  'acm',
  'bam',
  'bcs',
  'bmp',
  'cre',
  'dlg',
  'eff',
  'ids',
  'ini',
  'itm',
  'mos',
  'mus',
  'pvrz',
  'tis',
  'wav',
  'wed',
];

const Workbench: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      { elements.map(x => <RouteButton id={x} />) }

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
