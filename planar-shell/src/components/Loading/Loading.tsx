import CircularProgress from '@mui/material/CircularProgress';

import type { FC } from 'react';
import type { Maybe } from '@planar/shared';

import styles from './Loading.module.scss';

type LoadingProps = Readonly<{
  title?: Maybe<string>;
}>;
const Loading: FC<LoadingProps> = ({ title }: LoadingProps) => (
  <div className={styles.loader}>
    <CircularProgress size="5em" title={title ?? ''} />
  </div>
);

export default Loading;
