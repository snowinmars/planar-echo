import CircularProgress from '@mui/material/CircularProgress'

import type { FC } from 'react';

import styles from './Loading.module.scss';

const Loading: FC = () => (
    <div className={styles.loader}>
        <CircularProgress size={'5em'} />
    </div>
)

export default Loading;
