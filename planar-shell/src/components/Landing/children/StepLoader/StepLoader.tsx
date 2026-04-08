import CircularProgress from '@mui/material/CircularProgress';

import type { FC } from 'react';

import styles from './StepLoader.module.scss';

type StepLoaderProps = Readonly<{
  show: boolean;
}>;
const StepLoader: FC<StepLoaderProps> = ({ show }: StepLoaderProps) => {
  if (!show) return undefined;

  return (
    <div className={styles.loaderContainer}>
      <CircularProgress />
    </div>
  );
};

export default StepLoader;
