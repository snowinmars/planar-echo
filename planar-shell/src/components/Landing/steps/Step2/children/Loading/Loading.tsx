import CircularProgress from '@mui/material/CircularProgress';

import type { FC } from 'react';

import styles from './Loading.module.scss';

type LoadingProps = Readonly<{
  show: boolean;
}>;
const Loading: FC<LoadingProps> = ({ show }: LoadingProps) => {
  if (!show) return undefined;

  return (
    <div className={styles.loaderContainer}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
